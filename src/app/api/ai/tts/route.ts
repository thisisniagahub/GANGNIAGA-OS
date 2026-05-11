import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

const VALID_VOICES = [
  'alloy',
  'ash',
  'ballad',
  'coral',
  'echo',
  'fable',
  'onyx',
  'nova',
  'sage',
  'shimmer',
] as const;
type VoiceType = (typeof VALID_VOICES)[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice } = body as {
      text?: string;
      voice?: string;
    };

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text must be 4096 characters or less' },
        { status: 400 }
      );
    }

    // Validate voice if provided
    const effectiveVoice: VoiceType =
      voice && VALID_VOICES.includes(voice as VoiceType)
        ? (voice as VoiceType)
        : 'alloy';

    const zai = await getZAI();

    const response = await zai.audio.tts.create({
      input: text,
      voice: effectiveVoice,
    });

    // The TTS endpoint returns a Response object — extract the audio data
    const audioBuffer = await response.arrayBuffer();

    // Return as audio/mpeg with proper headers
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[/api/ai/tts] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
