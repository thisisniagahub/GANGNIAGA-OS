import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body as {
      query?: string;
    };

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query must be 500 characters or less' },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    const result = await zai.functions.invoke('web_search', {
      query,
    });

    return NextResponse.json({
      results: result,
      query,
    });
  } catch (error) {
    console.error('[/api/ai/search] Error:', error);
    return NextResponse.json(
      { error: 'Failed to perform web search' },
      { status: 500 }
    );
  }
}
