import { NextRequest, NextResponse } from 'next/server';
import {
  getWhatsAppConfig,
  getAIResponse,
  sendWhatsAppMessage,
  storeMessage,
  getConversationHistory,
} from '@/lib/gateway';

// WhatsApp webhook verification (GET)
// Meta sends this when subscribing a webhook
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Verify the webhook
    if (mode === 'subscribe' && token && challenge) {
      const config = await getWhatsAppConfig();

      if (config?.verifyToken && token === config.verifyToken) {
        // Verification successful — respond with the challenge
        return new NextResponse(challenge, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      // Token mismatch
      return NextResponse.json(
        { error: 'Verification token mismatch' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('WhatsApp webhook verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// WhatsApp message format from Meta Cloud API
interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product?: string;
        metadata?: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile?: {
            name?: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
          image?: {
            caption?: string;
            id: string;
            mime_type: string;
            sha256: string;
          };
          voice?: {
            id: string;
            mime_type: string;
            sha256: string;
          };
          document?: {
            caption?: string;
            filename: string;
            id: string;
            mime_type: string;
            sha256: string;
          };
          sticker?: {
            id: string;
            mime_type: string;
            sha256: string;
          };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

// WhatsApp message webhook (POST)
export async function POST(request: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await request.json();

    // Validate it's a WhatsApp Business Account event
    if (payload.object !== 'whatsapp_business_account') {
      return NextResponse.json({ error: 'Invalid object type' }, { status: 400 });
    }

    // Get WhatsApp config from DB
    const config = await getWhatsAppConfig();
    if (!config?.phoneNumberId || !config.accessToken) {
      console.error('WhatsApp not configured');
      return NextResponse.json(
        { error: 'WhatsApp not configured' },
        { status: 500 }
      );
    }

    // Process each entry
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        const { messages, contacts } = change.value;

        // Skip if no messages (e.g., status updates)
        if (!messages || messages.length === 0) {
          continue;
        }

        for (const msg of messages) {
          const senderPhone = msg.from;
          const contactInfo = contacts?.find((c) => c.wa_id === senderPhone);
          const userName = contactInfo?.profile?.name || senderPhone;
          const platformUserId = senderPhone;

          // Handle different message types
          if (msg.type === 'text' && msg.text) {
            const userMessage = msg.text.body;

            // Store inbound message
            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName,
              direction: 'inbound',
              messageType: 'text',
              content: userMessage,
              metadata: {
                messageId: msg.id,
                timestamp: msg.timestamp,
              },
            });

            // Get conversation history
            const history = await getConversationHistory('whatsapp', platformUserId);

            // Get AI response
            const aiResponse = await getAIResponse(userMessage, history);

            // Send AI response back via WhatsApp
            await sendWhatsAppMessage(
              config.phoneNumberId,
              config.accessToken,
              senderPhone,
              aiResponse
            );

            // Store outbound message
            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName: 'GangNiaga AI',
              direction: 'outbound',
              messageType: 'text',
              content: aiResponse,
              metadata: {
                inReplyTo: msg.id,
              },
            });
          } else if (msg.type === 'voice' && msg.voice) {
            // Acknowledge voice messages — ASR integration can be added later
            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName,
              direction: 'inbound',
              messageType: 'voice',
              content: '[Voice message received — transcription coming soon]',
              metadata: {
                messageId: msg.id,
                timestamp: msg.timestamp,
              },
            });

            await sendWhatsAppMessage(
              config.phoneNumberId,
              config.accessToken,
              senderPhone,
              "I received your voice message! Voice transcription is coming soon. For now, please type your message. 🎙️"
            );

            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName: 'GangNiaga AI',
              direction: 'outbound',
              messageType: 'text',
              content: "I received your voice message! Voice transcription is coming soon. For now, please type your message. 🎙️",
            });
          } else if (msg.type === 'image' && msg.image) {
            const caption = msg.image.caption || 'No caption';
            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName,
              direction: 'inbound',
              messageType: 'image',
              content: `[Image received: ${caption}]`,
              metadata: {
                messageId: msg.id,
                timestamp: msg.timestamp,
                mediaId: msg.image.id,
              },
            });

            await sendWhatsAppMessage(
              config.phoneNumberId,
              config.accessToken,
              senderPhone,
              "I received your image! Image analysis is coming soon. For now, please describe what you need help with. 📷"
            );

            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName: 'GangNiaga AI',
              direction: 'outbound',
              messageType: 'text',
              content: "I received your image! Image analysis is coming soon. For now, please describe what you need help with. 📷",
            });
          } else if (msg.type === 'document' && msg.document) {
            const docName = msg.document.filename || 'document';
            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName,
              direction: 'inbound',
              messageType: 'text',
              content: `[Document received: ${docName}]`,
              metadata: {
                messageId: msg.id,
                timestamp: msg.timestamp,
              },
            });

            await sendWhatsAppMessage(
              config.phoneNumberId,
              config.accessToken,
              senderPhone,
              `I received your document "${docName}". Document processing is coming soon. For now, please describe what you need help with. 📄`
            );

            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName: 'GangNiaga AI',
              direction: 'outbound',
              messageType: 'text',
              content: `I received your document "${docName}". Document processing is coming soon. For now, please describe what you need help with. 📄`,
            });
          } else {
            // Unsupported message type — sticker, location, contacts, etc.
            await storeMessage({
              platform: 'whatsapp',
              platformUserId,
              userName,
              direction: 'inbound',
              messageType: 'text',
              content: `[${msg.type} message received]`,
              metadata: {
                messageId: msg.id,
                timestamp: msg.timestamp,
                type: msg.type,
              },
            });

            await sendWhatsAppMessage(
              config.phoneNumberId,
              config.accessToken,
              senderPhone,
              `I received your ${msg.type} message. This message type is not yet supported. Please send a text message. 📝`
            );
          }
        }
      }
    }

    // Meta requires a 200 OK response
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    // Still return 200 to prevent Meta from retrying
    return NextResponse.json({ ok: true });
  }
}
