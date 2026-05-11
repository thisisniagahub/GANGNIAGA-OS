import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

// Default org ID (no auth)
const ORG_ID = 'org1';

// ── SOUL.md Personality ──

export async function getSoulPrompt(): Promise<string> {
  const soul = await db.openClawSoulConfig.findFirst({
    where: { organizationId: ORG_ID },
  });

  if (!soul) {
    return 'You are GangNiaga AI, a helpful business assistant for ASEAN SMEs. Be professional, concise, and data-driven.';
  }

  let rulesList = '';
  try {
    const rules: string[] = JSON.parse(soul.rules);
    if (rules.length > 0) {
      rulesList = '\n\nRules:\n' + rules.map((r, i) => `${i + 1}. ${r}`).join('\n');
    }
  } catch {
    // ignore parse errors
  }

  return [
    `You are ${soul.personality}.`,
    `Tone: ${soul.tone}.`,
    `Language: ${soul.language}.`,
    `Specialty: ${soul.specialty}.`,
    rulesList,
  ].join(' ');
}

// ── AI Response ──

export async function getAIResponse(
  message: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const zai = await getZAI();
    const soulPrompt = await getSoulPrompt();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: soulPrompt },
        ...history.slice(-8).map((h) => ({
          role: h.role as 'user' | 'assistant',
          content: h.content,
        })),
        { role: 'user', content: message },
      ],
      thinking: { type: 'disabled' },
    });

    return (
      completion.choices?.[0]?.message?.content ||
      'I apologize, I could not process your request. Please try again.'
    );
  } catch (error) {
    console.error('AI response error:', error);
    return 'I apologize, I am having trouble processing your request right now. Please try again in a moment.';
  }
}

// ── Telegram Helpers ──

export async function sendTelegramMessage(
  botToken: string,
  chatId: string | number,
  text: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Telegram send error:', response.status, errorBody);
    }
  } catch (error) {
    console.error('Telegram send error:', error);
  }
}

// ── WhatsApp Helpers ──

export async function sendWhatsAppMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('WhatsApp send error:', response.status, errorBody);
    }
  } catch (error) {
    console.error('WhatsApp send error:', error);
  }
}

// ── Channel Config Helpers ──

interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
  botUsername?: string;
  botName?: string;
}

interface WhatsAppConfig {
  verifyToken: string;
  phoneNumberId: string;
  accessToken: string;
  webhookUrl?: string;
  phoneNumber?: string;
  businessName?: string;
}

export async function getTelegramConfig(): Promise<TelegramConfig | null> {
  const channel = await db.openClawChannel.findFirst({
    where: { organizationId: ORG_ID, type: 'telegram' },
  });

  if (!channel?.config) return null;

  try {
    return JSON.parse(channel.config) as TelegramConfig;
  } catch {
    return null;
  }
}

export async function getWhatsAppConfig(): Promise<WhatsAppConfig | null> {
  const channel = await db.openClawChannel.findFirst({
    where: { organizationId: ORG_ID, type: 'whatsapp' },
  });

  if (!channel?.config) return null;

  try {
    return JSON.parse(channel.config) as WhatsAppConfig;
  } catch {
    return null;
  }
}

export async function saveTelegramConfig(
  config: TelegramConfig
): Promise<void> {
  const existing = await db.openClawChannel.findFirst({
    where: { organizationId: ORG_ID, type: 'telegram' },
  });

  if (existing) {
    await db.openClawChannel.update({
      where: { id: existing.id },
      data: {
        config: JSON.stringify(config),
        status: 'connected',
        name: config.botName || 'Telegram Bot',
        pairedAt: new Date(),
      },
    });
  } else {
    await db.openClawChannel.create({
      data: {
        type: 'telegram',
        name: config.botName || 'Telegram Bot',
        status: 'connected',
        config: JSON.stringify(config),
        pairedAt: new Date(),
        organizationId: ORG_ID,
      },
    });
  }
}

export async function saveWhatsAppConfig(
  config: WhatsAppConfig
): Promise<void> {
  const existing = await db.openClawChannel.findFirst({
    where: { organizationId: ORG_ID, type: 'whatsapp' },
  });

  if (existing) {
    await db.openClawChannel.update({
      where: { id: existing.id },
      data: {
        config: JSON.stringify(config),
        status: 'connected',
        name: config.businessName || 'WhatsApp Business',
        pairedAt: new Date(),
      },
    });
  } else {
    await db.openClawChannel.create({
      data: {
        type: 'whatsapp',
        name: config.businessName || 'WhatsApp Business',
        status: 'connected',
        config: JSON.stringify(config),
        pairedAt: new Date(),
        organizationId: ORG_ID,
      },
    });
  }
}

// ── Conversation History ──

export async function getConversationHistory(
  platform: string,
  platformUserId: string,
  limit: number = 10
): Promise<Array<{ role: string; content: string }>> {
  const messages = await db.gatewayConversation.findMany({
    where: {
      organizationId: ORG_ID,
      platform,
      platformUserId,
      messageType: 'text',
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return messages
    .reverse()
    .map((m) => ({
      role: m.direction === 'inbound' ? 'user' : 'assistant',
      content: m.content,
    }));
}

export async function storeMessage(params: {
  platform: string;
  platformUserId: string;
  userName?: string;
  direction: 'inbound' | 'outbound';
  messageType?: 'text' | 'voice' | 'image' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await db.gatewayConversation.create({
    data: {
      platform: params.platform,
      platformUserId: params.platformUserId,
      userName: params.userName,
      direction: params.direction,
      messageType: params.messageType || 'text',
      content: params.content,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      organizationId: ORG_ID,
    },
  });

  // Update channel message count
  const channel = await db.openClawChannel.findFirst({
    where: { organizationId: ORG_ID, type: params.platform },
  });

  if (channel) {
    await db.openClawChannel.update({
      where: { id: channel.id },
      data: {
        messageCount: { increment: 1 },
        lastMessage: params.content.substring(0, 200),
        lastMessageAt: new Date(),
      },
    });
  }
}

// ── Gateway Status ──

export interface GatewayChannelStatus {
  platform: string;
  name: string;
  status: string;
  configured: boolean;
  messageCount: number;
  lastMessageAt: string | null;
  webhookUrl?: string;
  botName?: string;
  phoneNumber?: string;
  businessName?: string;
}

export async function getGatewayStatus(): Promise<{
  channels: GatewayChannelStatus[];
  totalMessages: number;
}> {
  const channels = await db.openClawChannel.findMany({
    where: {
      organizationId: ORG_ID,
      type: { in: ['telegram', 'whatsapp'] },
    },
  });

  const channelStatuses: GatewayChannelStatus[] = channels.map((ch) => {
    let config: Record<string, unknown> = {};
    try {
      config = ch.config ? JSON.parse(ch.config) : {};
    } catch {
      // ignore
    }

    const isConfigured =
      ch.type === 'telegram'
        ? !!(config as TelegramConfig).botToken
        : !!(
            (config as WhatsAppConfig).verifyToken &&
            (config as WhatsAppConfig).phoneNumberId &&
            (config as WhatsAppConfig).accessToken
          );

    return {
      platform: ch.type,
      name: ch.name,
      status: ch.status,
      configured: isConfigured,
      messageCount: ch.messageCount,
      lastMessageAt: ch.lastMessageAt?.toISOString() ?? null,
      webhookUrl: (config as TelegramConfig | WhatsAppConfig).webhookUrl,
      botName:
        ch.type === 'telegram'
          ? (config as TelegramConfig).botName
          : undefined,
      phoneNumber:
        ch.type === 'whatsapp'
          ? (config as WhatsAppConfig).phoneNumber
          : undefined,
      businessName:
        ch.type === 'whatsapp'
          ? (config as WhatsAppConfig).businessName
          : undefined,
    };
  });

  // Add unconfigured platforms
  const existingTypes = new Set(channels.map((c) => c.type));
  if (!existingTypes.has('telegram')) {
    channelStatuses.push({
      platform: 'telegram',
      name: 'Telegram',
      status: 'unconfigured',
      configured: false,
      messageCount: 0,
      lastMessageAt: null,
    });
  }
  if (!existingTypes.has('whatsapp')) {
    channelStatuses.push({
      platform: 'whatsapp',
      name: 'WhatsApp',
      status: 'unconfigured',
      configured: false,
      messageCount: 0,
      lastMessageAt: null,
    });
  }

  const totalMessages = channels.reduce((sum, ch) => sum + ch.messageCount, 0);

  return { channels: channelStatuses, totalMessages };
}
