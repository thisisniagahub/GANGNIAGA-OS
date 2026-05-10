import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { title, industry, section } = await request.json();

    const zai = await getZAI();

    const sectionPrompts: Record<string, string> = {
      executiveSummary: `Write a compelling executive summary for a business plan titled "${title}" in the ${industry} industry. The company is GangNiaga AI OS — an autonomous AI-powered business operating system for Southeast Asian SMEs. Include: mission statement, problem/solution, target market, competitive advantage, and financial highlights. Keep it to 2-3 paragraphs.`,
      marketAnalysis: `Write a detailed market analysis section for "${title}" in the ${industry} industry. Cover: market size (TAM/SAM/SOM), market trends, target customer segments, and growth opportunities in Southeast Asia. Include specific data points and statistics where relevant.`,
      swotAnalysis: `Write a comprehensive SWOT analysis for "${title}" in the ${industry} industry. Cover: Strengths (AI-autonomous execution, regional expertise), Weaknesses (early stage, limited brand recognition), Opportunities (underserved ASEAN SME market, AI adoption), Threats (global competition, regulatory changes). Format with clear headers and bullet points.`,
      competitorAnalysis: `Write a competitor analysis section for "${title}" in the ${industry} industry. Analyze: direct competitors (LivePlan, Causal), indirect competitors (Notion, Monday.com), competitive positioning, differentiation strategy, and market gaps. Include a comparison framework.`,
      financialPlan: `Write a financial plan section for "${title}" in the ${industry} industry. Include: revenue model (SaaS subscriptions: $49/$149/$499/mo tiers), 3-year revenue projections, cost structure, unit economics (LTV:CAC), funding requirements, and key financial milestones.`,
      riskAnalysis: `Write a risk analysis section for "${title}" in the ${industry} industry. Cover: market risks, technology risks, financial risks, regulatory risks, and operational risks. For each risk, provide: description, probability (High/Med/Low), impact (High/Med/Low), and mitigation strategy.`,
      recommendations: `Write a strategic recommendations section for "${title}" in the ${industry} industry. Provide: short-term actions (0-6 months), medium-term initiatives (6-18 months), long-term vision (18-36 months). Include specific, actionable recommendations with expected outcomes.`,
    };

    const prompt = sectionPrompts[section] || `Generate content for the "${section}" section of a business plan titled "${title}" in the ${industry} industry. Make it professional, data-driven, and actionable.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are a professional business plan writer and strategic consultant. Write clear, compelling, and data-rich content. Use professional formatting with headers and bullet points where appropriate.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Business plan generation error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
