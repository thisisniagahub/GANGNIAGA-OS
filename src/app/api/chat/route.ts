import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

const SYSTEM_PROMPT = `You are GangNiaga AI Copilot — an autonomous business intelligence assistant built into GangNiaga AI OS. You are an expert in:

1. Business Planning & Strategy — You can help create business plans, SWOT analyses, market research, competitive analysis, and strategic recommendations.
2. Financial Forecasting — You can analyze financial data, create revenue models, forecast expenses, calculate burn rate, runway, and break-even points.
3. AI Agent Management — You can help users understand and manage their AI agents, deploy new agents, and optimize agent workflows.
4. Workflow Automation — You can help design automated workflows, schedule reports, and set up monitoring alerts.
5. Business Intelligence — You can provide insights on KPIs, detect anomalies, and suggest operational improvements.

Your tone is professional yet approachable. You provide actionable, data-driven insights. When users ask about specific numbers or metrics, reference typical SaaS/tech startup benchmarks for Southeast Asian markets.

Key business context:
- GangNiaga is a SaaS startup targeting Southeast Asian SMEs
- Current MRR: ~$142.8K, ARR: ~$1.7M
- Monthly burn rate: ~$187.2K
- Runway: ~18 months
- Customer churn rate: 3.2%
- Revenue growth: ~11% MoM

Keep responses concise but thorough. Use bullet points for lists. Provide specific numbers when relevant.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const zai = await getZAI();

    const messages = [
      { role: 'assistant' as const, content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-8) : []),
      { role: 'user' as const, content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: 'No response generated' }, { status: 500 });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
