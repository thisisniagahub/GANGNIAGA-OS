import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const { title, type, format, save } = await request.json();

    const zai = await getZAI();

    const typeDescriptions: Record<string, string> = {
      investor: 'investor update report',
      board: 'board meeting presentation report',
      financial: 'comprehensive financial report',
      kpi: 'KPI summary and performance report',
      operational: 'operational intelligence and status report',
    };

    const prompt = `Generate a comprehensive ${typeDescriptions[type] || type} titled "${title}" for GangNiaga AI OS — an autonomous AI-powered business operating system.

Company Context:
- MRR: $142,800 | ARR: $1,713,600
- Monthly Burn Rate: $187,200
- Runway: 18 months
- Customer Churn: 3.2%
- Revenue Growth: ~11% MoM
- Team Size: 12
- Founded: 2024
- Market: Southeast Asian SMEs
- Product: AI-autonomous business OS with business planning, financial forecasting, multi-agent orchestration, workflow automation

Include key sections appropriate for this report type. Use professional formatting with clear headers and data tables where relevant.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are a professional business report writer. Create clear, data-rich reports with proper formatting, headers, and structured content.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No report generated' }, { status: 500 });
    }

    // Optionally persist the report
    if (save) {
      try {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseServer();

          await supabase.from('reports').insert({
            title: title || 'Untitled Report',
            type: type || 'investor',
            status: 'generated',
            content: content, // JSONB or text — store directly
            format: format || 'pdf',
            organization_id: ORG_ID,
          });
        } else if (db) {
          await db.report.create({
            data: {
              title: title || 'Untitled Report',
              type: type || 'investor',
              status: 'generated',
              content: JSON.stringify(content),
              format: format || 'pdf',
              organizationId: ORG_ID,
            },
          });
        }
      } catch (persistError) {
        // Persistence failure should not block the response
        console.error('Error persisting report:', persistError);
      }
    }

    return NextResponse.json({ content, title, type, format });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
