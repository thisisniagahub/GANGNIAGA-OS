import { NextRequest, NextResponse } from 'next/server';
import {
  getTelegramConfig,
  getAIResponse,
  sendTelegramMessage,
  storeMessage,
  getConversationHistory,
} from '@/lib/gateway';

// Telegram webhook update format
interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    voice?: {
      file_id: string;
      duration: number;
      mime_type?: string;
    };
    photo?: Array<{
      file_id: string;
      width: number;
      height: number;
    }>;
    caption?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    // Validate the update has a message
    if (!update.message) {
      return NextResponse.json({ ok: true });
    }

    const { message } = update;
    const chatId = message.chat.id;
    const fromUser = message.from;
    const userName =
      fromUser?.username ||
      [fromUser?.first_name, fromUser?.last_name].filter(Boolean).join(' ') ||
      'Unknown';
    const platformUserId = String(chatId);

    // Get Telegram config from DB
    const config = await getTelegramConfig();
    if (!config?.botToken) {
      console.error('Telegram bot not configured');
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    // Determine message type and content
    let messageType: 'text' | 'voice' | 'image' = 'text';
    let userMessage = '';

    if (message.text) {
      messageType = 'text';
      userMessage = message.text;
    } else if (message.voice) {
      messageType = 'voice';
      // Acknowledge voice messages — ASR integration can be added later
      userMessage = '[Voice message received — transcription coming soon]';
      await storeMessage({
        platform: 'telegram',
        platformUserId,
        userName,
        direction: 'inbound',
        messageType: 'voice',
        content: userMessage,
        metadata: {
          messageId: message.message_id,
          fileId: message.voice.file_id,
          duration: message.voice.duration,
        },
      });
      await sendTelegramMessage(
        config.botToken,
        chatId,
        "I received your voice message! Voice transcription is coming soon. For now, please type your message. 🎙️"
      );
      await storeMessage({
        platform: 'telegram',
        platformUserId,
        userName: 'GangNiaga AI',
        direction: 'outbound',
        messageType: 'text',
        content: "I received your voice message! Voice transcription is coming soon. For now, please type your message. 🎙️",
      });
      return NextResponse.json({ ok: true });
    } else if (message.photo) {
      messageType = 'image';
      const caption = message.caption || 'No caption';
      userMessage = `[Image received: ${caption}]`;
      await storeMessage({
        platform: 'telegram',
        platformUserId,
        userName,
        direction: 'inbound',
        messageType: 'image',
        content: userMessage,
        metadata: {
          messageId: message.message_id,
          fileId: message.photo[message.photo.length - 1]?.file_id,
          caption,
        },
      });
      await sendTelegramMessage(
        config.botToken,
        chatId,
        "I received your image! Image analysis is coming soon. For now, please describe what you need help with. 📷"
      );
      await storeMessage({
        platform: 'telegram',
        platformUserId,
        userName: 'GangNiaga AI',
        direction: 'outbound',
        messageType: 'text',
        content: "I received your image! Image analysis is coming soon. For now, please describe what you need help with. 📷",
      });
      return NextResponse.json({ ok: true });
    } else {
      // Unsupported message type
      return NextResponse.json({ ok: true });
    }

    // Store inbound message
    await storeMessage({
      platform: 'telegram',
      platformUserId,
      userName,
      direction: 'inbound',
      messageType,
      content: userMessage,
      metadata: {
        messageId: message.message_id,
        updateId: update.update_id,
      },
    });

    // Get conversation history
    const history = await getConversationHistory('telegram', platformUserId);

    // Get AI response
    const aiResponse = await getAIResponse(userMessage, history);

    // Send AI response back to Telegram
    await sendTelegramMessage(config.botToken, chatId, aiResponse);

    // Store outbound message
    await storeMessage({
      platform: 'telegram',
      platformUserId,
      userName: 'GangNiaga AI',
      direction: 'outbound',
      messageType: 'text',
      content: aiResponse,
      metadata: {
        inReplyTo: message.message_id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
