import { NextResponse } from 'next/server';
import { getGatewayStatus, getConversationHistory } from '@/lib/gateway';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

/**
 * GET /api/gateway/status
 * Returns status of all configured channels (Telegram, WhatsApp) plus recent conversations.
 */
export async function GET() {
  try {
    // Get channel status
    const { channels, totalMessages } = await getGatewayStatus();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      // Get recent conversations across all platforms
      const { data: recentData, error: recentError } = await supabase
        .from('gateway_conversations')
        .select('*')
        .eq('organization_id', ORG_ID)
        .order('created_at', { ascending: false })
        .limit(50);

      if (recentError) throw recentError;

      const recentConversations = (recentData || []).map((c: Record<string, unknown>) => ({
        id: c.id,
        platform: c.platform,
        platformUserId: c.platform_user_id,
        userName: c.user_name,
        direction: c.direction,
        messageType: c.message_type,
        content: (c.content as string || '').substring(0, 200),
        createdAt: c.created_at,
      }));

      // Get active sessions from last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: activeData, error: activeError } = await supabase
        .from('gateway_conversations')
        .select('platform, platform_user_id, user_name, content, message_type, created_at')
        .eq('organization_id', ORG_ID)
        .gte('created_at', yesterday)
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;

      // Deduplicate by platform + platform_user_id (keep latest)
      const sessionMap = new Map<string, Record<string, unknown>>();
      for (const row of (activeData || []) as Record<string, unknown>[]) {
        const key = `${row.platform}:${row.platform_user_id}`;
        if (!sessionMap.has(key)) {
          sessionMap.set(key, row);
        }
      }

      // Build session summaries with message counts
      const activeSessionEntries = Array.from(sessionMap.values()).slice(0, 20);
      const sessionSummaries = await Promise.all(
        activeSessionEntries.map(async (session) => {
          const { count, error: countError } = await supabase
            .from('gateway_conversations')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', ORG_ID)
            .eq('platform', session.platform as string)
            .eq('platform_user_id', session.platform_user_id as string);

          return {
            platform: session.platform,
            platformUserId: session.platform_user_id,
            userName: session.user_name,
            messageCount: count || 0,
            lastMessage: (session.content as string || '').substring(0, 100),
            lastMessageAt: session.created_at,
            messageType: session.message_type,
          };
        })
      );

      // Count today's messages
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayISO = todayStart.toISOString();

      const { count: todayInbound, error: inboundError } = await supabase
        .from('gateway_conversations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', ORG_ID)
        .eq('direction', 'inbound')
        .gte('created_at', todayISO);

      const { count: todayOutbound, error: outboundError } = await supabase
        .from('gateway_conversations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', ORG_ID)
        .eq('direction', 'outbound')
        .gte('created_at', todayISO);

      return NextResponse.json({
        channels,
        totalMessages,
        todayStats: {
          inbound: todayInbound || 0,
          outbound: todayOutbound || 0,
          total: (todayInbound || 0) + (todayOutbound || 0),
        },
        activeSessions: sessionSummaries,
        recentConversations,
      });
    } else if (db) {
      // Get recent conversations across all platforms
      const recentConversations = await db.gatewayConversation.findMany({
        where: { organizationId: ORG_ID },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      // Get unique active sessions (by platform + platformUserId)
      const activeSessions = await db.gatewayConversation.findMany({
        where: {
          organizationId: ORG_ID,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['platform', 'platformUserId'],
        take: 20,
      });

      // Build session summary with latest message and conversation count
      const sessionSummaries = await Promise.all(
        activeSessions.map(async (session) => {
          const count = await db.gatewayConversation.count({
            where: {
              organizationId: ORG_ID,
              platform: session.platform,
              platformUserId: session.platformUserId,
            },
          });

          return {
            platform: session.platform,
            platformUserId: session.platformUserId,
            userName: session.userName,
            messageCount: count,
            lastMessage: session.content.substring(0, 100),
            lastMessageAt: session.createdAt.toISOString(),
            messageType: session.messageType,
          };
        })
      );

      // Count today's messages
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayInbound = await db.gatewayConversation.count({
        where: {
          organizationId: ORG_ID,
          direction: 'inbound',
          createdAt: { gte: todayStart },
        },
      });

      const todayOutbound = await db.gatewayConversation.count({
        where: {
          organizationId: ORG_ID,
          direction: 'outbound',
          createdAt: { gte: todayStart },
        },
      });

      return NextResponse.json({
        channels,
        totalMessages,
        todayStats: {
          inbound: todayInbound,
          outbound: todayOutbound,
          total: todayInbound + todayOutbound,
        },
        activeSessions: sessionSummaries,
        recentConversations: recentConversations.map((c) => ({
          id: c.id,
          platform: c.platform,
          platformUserId: c.platformUserId,
          userName: c.userName,
          direction: c.direction,
          messageType: c.messageType,
          content: c.content.substring(0, 200),
          createdAt: c.createdAt.toISOString(),
        })),
      });
    }

    // No database available — return channel status only
    return NextResponse.json({
      channels,
      totalMessages,
      todayStats: { inbound: 0, outbound: 0, total: 0 },
      activeSessions: [],
      recentConversations: [],
    });
  } catch (error) {
    console.error('Gateway status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
