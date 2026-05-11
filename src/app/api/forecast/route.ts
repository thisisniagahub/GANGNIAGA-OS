import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const { type, period, data, name, save } = await request.json();

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

    // Optionally persist the forecast
    if (save && name) {
      try {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseServer();

          await supabase.from('forecasts').insert({
            name,
            type: type || 'revenue',
            period: period || '',
            data: data, // JSONB — store directly, no JSON.stringify
            organization_id: ORG_ID,
          });
        } else if (db) {
          await db.forecast.create({
            data: {
              name,
              type: type || 'revenue',
              period: period || '',
              data: JSON.stringify(data),
              organizationId: ORG_ID,
            },
          });
        }
      } catch (persistError) {
        // Persistence failure should not block the response
        console.error('Error persisting forecast:', persistError);
      }
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Forecast analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
