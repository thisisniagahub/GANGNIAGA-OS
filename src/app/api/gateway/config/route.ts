import { NextRequest, NextResponse } from 'next/server';
import { getTelegramConfig, getWhatsAppConfig, saveTelegramConfig, saveWhatsAppConfig } from '@/lib/gateway';

/**
 * GET /api/gateway/config
 * Get current gateway config (bot tokens, webhook URLs, etc.)
 * Sensitive fields (tokens, secrets) are masked for security.
 */
export async function GET() {
  try {
    const telegramConfig = await getTelegramConfig();
    const whatsappConfig = await getWhatsAppConfig();

    return NextResponse.json({
      telegram: telegramConfig
        ? {
            configured: true,
            botToken: maskSecret(telegramConfig.botToken),
            webhookUrl: telegramConfig.webhookUrl,
            botUsername: telegramConfig.botUsername,
            botName: telegramConfig.botName,
          }
        : {
            configured: false,
          },
      whatsapp: whatsappConfig
        ? {
            configured: true,
            verifyToken: maskSecret(whatsappConfig.verifyToken),
            phoneNumberId: whatsappConfig.phoneNumberId,
            accessToken: maskSecret(whatsappConfig.accessToken),
            webhookUrl: whatsappConfig.webhookUrl,
            phoneNumber: whatsappConfig.phoneNumber,
            businessName: whatsappConfig.businessName,
          }
        : {
            configured: false,
          },
    });
  } catch (error) {
    console.error('Gateway config GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/gateway/config
 * Update gateway config.
 *
 * Body: { telegram?: { botToken, botName? }, whatsapp?: { verifyToken, phoneNumberId, accessToken, phoneNumber?, businessName? } }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegram, whatsapp } = body;

    const results: Record<string, unknown> = {};

    // Update Telegram config
    if (telegram) {
      if (!telegram.botToken || typeof telegram.botToken !== 'string') {
        return NextResponse.json(
          { error: 'Telegram botToken is required' },
          { status: 400 }
        );
      }

      // Construct webhook URL from request origin
      const origin = request.headers.get('host');
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      const webhookUrl = `${protocol}://${origin}/api/gateway/telegram/webhook`;

      await saveTelegramConfig({
        botToken: telegram.botToken,
        webhookUrl,
        botName: telegram.botName,
      });

      // Also register webhook with Telegram
      try {
        const webhookResponse = await fetch(
          `https://api.telegram.org/bot${telegram.botToken}/setWebhook`,
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
        results.telegram = {
          saved: true,
          webhookRegistered: webhookData.ok,
          webhookUrl,
        };
      } catch (err) {
        results.telegram = {
          saved: true,
          webhookRegistered: false,
          webhookError: String(err),
        };
      }
    }

    // Update WhatsApp config
    if (whatsapp) {
      if (!whatsapp.verifyToken || !whatsapp.phoneNumberId || !whatsapp.accessToken) {
        return NextResponse.json(
          { error: 'WhatsApp verifyToken, phoneNumberId, and accessToken are required' },
          { status: 400 }
        );
      }

      const origin = request.headers.get('host');
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      const webhookUrl = `${protocol}://${origin}/api/gateway/whatsapp/webhook`;

      await saveWhatsAppConfig({
        verifyToken: whatsapp.verifyToken,
        phoneNumberId: whatsapp.phoneNumberId,
        accessToken: whatsapp.accessToken,
        webhookUrl,
        phoneNumber: whatsapp.phoneNumber,
        businessName: whatsapp.businessName,
      });

      results.whatsapp = {
        saved: true,
        webhookUrl,
        note: 'Subscribe the webhook URL in Meta Business Suite and verify using the verify token.',
      };
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Gateway config PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Masks a secret string, showing only the first 4 and last 4 characters.
 * Short strings are fully masked.
 */
function maskSecret(secret: string): string {
  if (!secret) return '••••••••';
  if (secret.length <= 12) return '••••••••';
  return secret.substring(0, 4) + '••••' + secret.substring(secret.length - 4);
}
