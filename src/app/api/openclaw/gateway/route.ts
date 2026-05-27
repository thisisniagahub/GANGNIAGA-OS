import { NextRequest, NextResponse } from 'next/server';
import { hermes } from '@/lib/hermes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.message || body.text || "Hello";

    const data = await hermes.chatCompletion([
      { role: 'user', content: prompt }
    ]);

    const replyMessage = data.choices?.[0]?.message?.content || "No response from Hermes Core.";
    
    return NextResponse.json({ success: true, reply: replyMessage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
