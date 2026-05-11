import { NextResponse } from 'next/server';
import { getGatewayStatus, getConversationHistory } from '@/lib/gateway';
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
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24 hours
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
  } catch (error) {
    console.error('Gateway status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
