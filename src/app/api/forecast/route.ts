import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

export async function POST(request: NextRequest) {
  try {
    const { type, period, data } = await request.json();

    const zai = await getZAI();

    const prompt = `As a financial analyst AI, analyze the following ${type} forecast data for the period ${period}:

${JSON.stringify(data, null, 2)}

Provide:
1. Key insights and trends
2. Risk factors to watch
3. Optimization recommendations
4. Forecast confidence level

Keep the analysis concise and actionable. Use specific numbers from the data.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are an expert financial analyst. Provide clear, data-driven analysis with specific numbers and actionable recommendations.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const analysis = completion.choices?.[0]?.message?.content;

    if (!analysis) {
      return NextResponse.json({ error: 'No analysis generated' }, { status: 500 });
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Forecast analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
