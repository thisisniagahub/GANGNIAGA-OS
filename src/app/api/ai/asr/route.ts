import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

const VALID_FORMATS = ['wav', 'mp3', 'ogg', 'flac', 'm4a', 'webm'] as const;
type AudioFormat = (typeof VALID_FORMATS)[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audio, format } = body as {
      audio?: string;
      format?: string;
    };

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json(
        { error: 'Audio is required and must be a base64-encoded string' },
        { status: 400 }
      );
    }

    // Validate format if provided
    const effectiveFormat: AudioFormat =
      format && VALID_FORMATS.includes(format as AudioFormat)
        ? (format as AudioFormat)
        : 'wav';

    const zai = await getZAI();

    const response = await zai.audio.asr.create({
      audio,
      format: effectiveFormat,
    });

    // The ASR endpoint returns JSON with transcription
    const result = await response.json();

    return NextResponse.json({
      transcription: result,
      format: effectiveFormat,
    });
  } catch (error) {
    console.error('[/api/ai/asr] Error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
