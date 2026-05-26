import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const hermesUrl = process.env.NEXT_PUBLIC_HERMES_AGENT_URL;
    const hermesKey = process.env.HERMES_API_KEY;

    if (!hermesUrl) {
      return NextResponse.json({ success: false, error: "Hermes URL missing" }, { status: 500 });
    }

    const response = await fetch(`${hermesUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hermesKey}`
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: body.message || body.text || "Hello" }],
        model: "openrouter/owl-alpha"
      }),
    });

    const data = await response.json();
    const replyMessage = data.choices?.[0]?.message?.content || "No response from Hermes Core.";
    
    return NextResponse.json({ success: true, reply: replyMessage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
