import { NextRequest, NextResponse } from 'next/server';
import { getZAI, SOUL_PROMPT } from '@/lib/zai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, systemPrompt } = body as {
      message?: string;
      history?: ChatMessage[];
      systemPrompt?: string;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    // Build the system prompt: use custom systemPrompt if provided, otherwise SOUL.md
    const effectiveSystemPrompt = systemPrompt || SOUL_PROMPT;

    // Build messages array with system prompt, history (last 20 messages), and current message
    const messages: ChatMessage[] = [
      { role: 'system', content: effectiveSystemPrompt },
      ...(Array.isArray(history) ? history.slice(-20) : []),
      { role: 'user', content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response,
      usage: completion.usage || null,
    });
  } catch (error) {
    console.error('[/api/ai/chat] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat response' },
      { status: 500 }
    );
  }
}
