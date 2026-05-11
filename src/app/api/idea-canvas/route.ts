import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const { title, problem, solution, targetMarket, revenueModel, competitiveEdge, risks, canvasId, save } = await request.json();

    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are a venture capital analyst and business idea validator specializing in Southeast Asian markets. You provide honest, data-driven assessments of business ideas. You score ideas across 5 dimensions and provide specific, actionable feedback. Always include benchmark comparisons against industry standards. Be brutally honest — better to kill a bad idea now than waste money on it later.`,
        },
        {
          role: 'user',
          content: `Validate this business idea and provide a structured assessment:

**Title:** ${title}
**Problem:** ${problem || 'Not specified'}
**Solution:** ${solution || 'Not specified'}
**Target Market:** ${targetMarket || 'Not specified'}
**Revenue Model:** ${revenueModel || 'Not specified'}
**Competitive Edge:** ${competitiveEdge || 'Not specified'}
**Known Risks:** ${risks?.join(', ') || 'None specified'}

Provide your assessment as a JSON object with these fields:
- overallScore (0-100)
- marketViability (0-100)
- problemClarity (0-100)
- solutionFeasibility (0-100)
- revenuePotential (0-100)
- competitivePosition (0-100)
- riskLevel ("low", "medium", "high", or "critical")
- strengths (array of 3-5 strings)
- weaknesses (array of 3-5 strings)
- recommendations (array of 3-5 strings with specific, actionable advice)
- redFlags (array of 0-3 strings — only include if there are deal-breaking concerns)
- benchmarkComparison (array of objects with: metric, user [estimated score], benchmark [industry standard], status ["above", "below", or "at"])

Use realistic benchmark values for the ASEAN/Southeast Asian market context.`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No validation result generated' }, { status: 500 });
    }

    let validationResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        validationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      return NextResponse.json({ 
        rawContent: content,
        validation: {
          overallScore: 50,
          marketViability: 50,
          problemClarity: 50,
          solutionFeasibility: 50,
          revenuePotential: 50,
          competitivePosition: 50,
          riskLevel: 'medium',
          strengths: ['Idea has potential'],
          weaknesses: ['Needs more detail for proper assessment'],
          recommendations: ['Refine your idea canvas with more specific details'],
          redFlags: [],
          benchmarkComparison: [],
        }
      });
    }

    // Optionally persist the validation result
    if (save && canvasId) {
      try {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseServer();

          await supabase
            .from('idea_canvases')
            .update({
              status: 'validated',
              validation_score: validationResult.overallScore ?? 0,
              validation_report: validationResult, // JSONB — store directly
            })
            .eq('id', canvasId)
            .eq('organization_id', ORG_ID);
        } else if (db) {
          await db.ideaCanvas.update({
            where: { id: canvasId },
            data: {
              status: 'validated',
              validationScore: validationResult.overallScore ?? 0,
              validationReport: JSON.stringify(validationResult),
            },
          });
        }
      } catch (persistError) {
        // Persistence failure should not block the response
        console.error('Error persisting idea canvas validation:', persistError);
      }
    }

    return NextResponse.json({ validation: validationResult });
  } catch (error) {
    console.error('Idea canvas validation error:', error);
    return NextResponse.json({ error: 'Failed to validate idea' }, { status: 500 });
  }
}
