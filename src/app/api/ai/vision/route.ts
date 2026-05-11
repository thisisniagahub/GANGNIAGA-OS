import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, prompt } = body as {
      image?: string;
      prompt?: string;
    };

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Image is required and must be a base64-encoded string' },
        { status: 400 }
      );
    }

    const effectivePrompt =
      prompt && typeof prompt === 'string'
        ? prompt
        : 'Describe this image in detail. Identify any text, objects, people, scenes, data, charts, or business-relevant information.';

    const zai = await getZAI();

    // Determine if the base64 string already has a data URI prefix
    const imageUrl = image.startsWith('data:')
      ? image
      : `data:image/png;base64,${image}`;

    const completion = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: effectivePrompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'No vision analysis generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis: response,
      prompt: effectivePrompt,
      usage: completion.usage || null,
    });
  } catch (error) {
    console.error('[/api/ai/vision] Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
