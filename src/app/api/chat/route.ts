import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, message } = body;

    let finalMessages = messages || [];
    if (finalMessages.length === 0 && message) {
      finalMessages = [{ role: 'user', content: message }];
    }

    const hermesUrl = process.env.NEXT_PUBLIC_HERMES_AGENT_URL;
    const hermesKey = process.env.HERMES_API_KEY;

    if (!hermesUrl) {
      return NextResponse.json({ 
        success: false, 
        error: "NEXT_PUBLIC_HERMES_AGENT_URL is not configured!" 
      }, { status: 500 });
    }

    const response = await fetch(`${hermesUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hermesKey}`
      },
      body: JSON.stringify({
        messages: finalMessages,
        model: "openrouter/owl-alpha"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ success: false, error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
