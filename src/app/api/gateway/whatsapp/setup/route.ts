import { NextRequest, NextResponse } from 'next/server';
import { saveWhatsAppConfig, getWhatsAppConfig } from '@/lib/gateway';

/**
 * POST /api/gateway/whatsapp/setup
 * Stores WhatsApp Business API credentials and config.
 *
 * Body: { verifyToken, phoneNumberId, accessToken, phoneNumber?, businessName? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { verifyToken, phoneNumberId, accessToken, phoneNumber, businessName } = body;

    // Validate required fields
    if (!verifyToken || typeof verifyToken !== 'string') {
      return NextResponse.json(
        { error: 'verifyToken is required' },
        { status: 400 }
      );
    }

    if (!phoneNumberId || typeof phoneNumberId !== 'string') {
      return NextResponse.json(
        { error: 'phoneNumberId is required' },
        { status: 400 }
      );
    }

    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json(
        { error: 'accessToken is required' },
        { status: 400 }
      );
    }

    // Validate the access token by calling the Graph API
    const meResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    let validatedPhoneNumber = phoneNumber;
    let validatedBusinessName = businessName;

    if (meResponse.ok) {
      const meData = await meResponse.json();
      validatedPhoneNumber = phoneNumber || meData.display_phone_number;
      validatedBusinessName = businessName || meData.verified_name || 'WhatsApp Business';
    } else {
      const errorData = await meResponse.json().catch(() => ({}));
      console.warn('WhatsApp API validation warning:', errorData);
      // Still save config — the token might work for messages even if profile fetch fails
    }

    // Construct the webhook URL
    const origin = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const webhookUrl = `${protocol}://${origin}/api/gateway/whatsapp/webhook`;

    // Save config to database
    await saveWhatsAppConfig({
      verifyToken,
      phoneNumberId,
      accessToken,
      webhookUrl,
      phoneNumber: validatedPhoneNumber,
      businessName: validatedBusinessName,
    });

    return NextResponse.json({
      success: true,
      webhookUrl,
      info: {
        phoneNumberId,
        phoneNumber: validatedPhoneNumber,
        businessName: validatedBusinessName,
      },
      note: 'To complete setup, subscribe this webhook URL in your Meta Business Suite and verify it using the verify token.',
    });
  } catch (error) {
    console.error('WhatsApp setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gateway/whatsapp/setup
 * Removes WhatsApp config from the database.
 */
export async function DELETE() {
  try {
    const config = await getWhatsAppConfig();

    if (config) {
      // Import db to clear the channel config
      const { db } = await import('@/lib/db');
      const channel = await db.openClawChannel.findFirst({
        where: { organizationId: 'org1', type: 'whatsapp' },
      });

      if (channel) {
        await db.openClawChannel.update({
          where: { id: channel.id },
          data: {
            status: 'disconnected',
            config: null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp configuration removed',
    });
  } catch (error) {
    console.error('WhatsApp config removal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
