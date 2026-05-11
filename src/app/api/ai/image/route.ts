import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

const VALID_SIZES = ['1024x1024', '1344x768', '768x1344'] as const;
type ImageSize = (typeof VALID_SIZES)[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size } = body as {
      prompt?: string;
      size?: string;
    };

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate size if provided
    const effectiveSize: ImageSize =
      size && VALID_SIZES.includes(size as ImageSize)
        ? (size as ImageSize)
        : '1024x1024';

    const zai = await getZAI();

    const response = await zai.images.generations.create({
      prompt,
      size: effectiveSize,
    });

    const imageData = response.data?.[0];

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: imageData.base64,
      size: effectiveSize,
      prompt,
    });
  } catch (error) {
    console.error('[/api/ai/image] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
