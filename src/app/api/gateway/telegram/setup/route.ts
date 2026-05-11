import { NextRequest, NextResponse } from 'next/server';
import { saveTelegramConfig, getTelegramConfig } from '@/lib/gateway';

/**
 * POST /api/gateway/telegram/setup
 * Registers the webhook URL with Telegram and saves bot config.
 *
 * Body: { botToken: string, botName?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { botToken, botName } = body;

    if (!botToken || typeof botToken !== 'string') {
      return NextResponse.json(
        { error: 'botToken is required' },
        { status: 400 }
      );
    }

    // Validate the bot token by calling getMe
    const meResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );
    const meData = await meResponse.json();

    if (!meData.ok) {
      return NextResponse.json(
        { error: 'Invalid bot token', details: meData.description },
        { status: 400 }
      );
    }

    const botInfo = meData.result;
    const resolvedBotName = botName || botInfo.username || 'Telegram Bot';

    // Construct the webhook URL from the request origin
    const origin = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const webhookUrl = `${protocol}://${origin}/api/gateway/telegram/webhook`;

    // Register the webhook with Telegram
    const webhookResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
        }),
      }
    );
    const webhookData = await webhookResponse.json();

    if (!webhookData.ok) {
      return NextResponse.json(
        {
          error: 'Failed to set webhook',
          details: webhookData.description,
        },
        { status: 500 }
      );
    }

    // Save config to database
    await saveTelegramConfig({
      botToken,
      webhookUrl,
      botUsername: botInfo.username,
      botName: resolvedBotName,
    });

    return NextResponse.json({
      success: true,
      webhookUrl,
      botInfo: {
        id: botInfo.id,
        username: botInfo.username,
        firstName: botInfo.first_name,
      },
    });
  } catch (error) {
    console.error('Telegram setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gateway/telegram/setup
 * Removes the Telegram webhook and clears config.
 */
export async function DELETE() {
  try {
    const config = await getTelegramConfig();

    if (config?.botToken) {
      // Remove webhook from Telegram
      await fetch(
        `https://api.telegram.org/bot${config.botToken}/deleteWebhook`,
        { method: 'POST' }
      );
    }

    // Config will remain in DB but webhook URL is removed from Telegram's side
    return NextResponse.json({ success: true, message: 'Telegram webhook removed' });
  } catch (error) {
    console.error('Telegram webhook removal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
