import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as {
      url?: string;
    };

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    const result = await zai.functions.invoke('page_reader', {
      url,
    });

    return NextResponse.json({
      title: result.data?.title || null,
      html: result.data?.html || null,
      publishedTime: result.data?.publishedTime || null,
      url,
    });
  } catch (error) {
    console.error('[/api/ai/read] Error:', error);
    return NextResponse.json(
      { error: 'Failed to read web page' },
      { status: 500 }
    );
  }
}
