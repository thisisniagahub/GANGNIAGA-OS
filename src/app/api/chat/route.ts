import { NextRequest, NextResponse } from 'next/server';
import { hermes } from '@/lib/hermes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, message, model } = body;

    let finalMessages = messages || [];
    if (finalMessages.length === 0 && message) {
      finalMessages = [{ role: 'user', content: message }];
    }

    const data = await hermes.chatCompletion(finalMessages, model);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
