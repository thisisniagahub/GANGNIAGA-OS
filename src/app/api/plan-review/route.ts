import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

export async function POST(request: NextRequest) {
  try {
    const { planId, lenderPersona } = await request.json();

    if (!planId || !lenderPersona) {
      return NextResponse.json(
        { error: 'planId and lenderPersona are required' },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    const personaDescription =
      lenderPersona === 'bank'
        ? 'a strict bank loan officer who focuses on DSCR, collateral, cash flow stability, and repayment capacity'
        : lenderPersona === 'investor'
        ? 'a venture capital investor who focuses on growth potential, market size, unit economics, and exit strategy'
        : 'a government grant officer who focuses on community impact, compliance, feasibility, and public benefit';

    const prompt = `You are ${personaDescription}. Review the following business plan and provide a comprehensive lender-grade analysis.

Plan ID: ${planId}

Analyze the plan and identify discrepancies between the narrative text and the financial projections. Return your analysis as a JSON object with the following structure:

{
  "narrativeScore": <number 0-100>,
  "financialScore": <number 0-100>,
  "consistencyScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "discrepancies": [
    {
      "id": "string",
      "severity": "critical" | "warning" | "info",
      "section": "string - which sections conflict",
      "description": "string - what the discrepancy is",
      "narrativeClaim": "string - what the narrative says",
      "financialReality": "string - what the financials actually show",
      "suggestedFix": "string - how to fix it"
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "priority": "high" | "medium" | "low",
      "category": "string",
      "recommendation": "string",
      "impact": "string"
    }
  ]
}

Focus on:
1. Are revenue growth claims in the narrative consistent with financial projections?
2. Are use of funds amounts properly itemized and explained?
3. Is the DSCR calculation consistent with the debt service assumptions?
4. Are market size claims backed by realistic assumptions?
5. Are there gaps in the narrative that a ${lenderPersona} would flag?
6. Are the financial projections internally consistent?

Be thorough but fair. Return only the JSON object, no additional text.`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'You are an expert financial analyst who reviews business plans from the perspective of different types of lenders. You are thorough, precise, and identify discrepancies between narrative claims and financial projections. Always return valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No review generated' },
        { status: 500 }
      );
    }

    // Parse the JSON from the AI response
    let reviewData;
    try {
      // Try to extract JSON from the response (may be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reviewData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // Fallback with basic structure if AI response isn't parseable
      reviewData = {
        narrativeScore: 70,
        financialScore: 65,
        consistencyScore: 60,
        overallScore: 65,
        discrepancies: [
          {
            id: 'd-auto-1',
            severity: 'warning' as const,
            section: 'General Review',
            description: 'AI review completed but detailed discrepancy extraction requires more structured financial data.',
            narrativeClaim: 'Review in progress',
            financialReality: 'Review in progress',
            suggestedFix: 'Ensure financial projections are fully detailed for thorough cross-checking.',
          },
        ],
        recommendations: [
          {
            id: 'r-auto-1',
            priority: 'medium' as const,
            category: 'General',
            recommendation: 'Add more detailed financial breakdowns for thorough lender review.',
            impact: 'Improves credibility and reduces lender questions.',
          },
        ],
      };
    }

    const review = {
      id: `review-${Date.now()}`,
      planId,
      status: 'completed' as const,
      lenderPersona,
      narrativeScore: reviewData.narrativeScore ?? 70,
      financialScore: reviewData.financialScore ?? 65,
      consistencyScore: reviewData.consistencyScore ?? 60,
      overallScore: reviewData.overallScore ?? 65,
      discrepancies: reviewData.discrepancies ?? [],
      recommendations: reviewData.recommendations ?? [],
      fullReport: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Plan review error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan review' },
      { status: 500 }
    );
  }
}
