import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Get existing skills for context
    const existingSkills = await db.skill.findMany({
      where: { organizationId: ORG_ID, status: 'active' },
      select: { name: true, slug: true, category: true, description: true },
    });

    // Use z-ai-web-dev-sdk to analyze the conversation
    const zai = await getZAI();

    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join('\n');

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are an AI skill extraction assistant for GangNiaga AI OS. Your job is to analyze conversations and identify:

1. **New Skill Suggestions**: Patterns of knowledge or workflows that could be formalized as reusable skills
2. **Skill Improvements**: Existing skills that could be enhanced based on the conversation
3. **Memory Extractions**: Important facts, preferences, or context that should be stored as persistent memories

Existing skills in the system:
${existingSkills.map((s) => `- ${s.name} (${s.slug}): ${s.description}`).join('\n')}

Analyze the conversation below and respond with a JSON object:
{
  "newSkills": [
    {
      "name": "Skill Name",
      "description": "What this skill does",
      "category": "business|financial|marketing|research|automation|general",
      "triggerPhrase": "/slash-command",
      "content": "The detailed skill instructions in markdown...",
      "tags": ["tag1", "tag2"],
      "autoLearn": true/false
    }
  ],
  "skillImprovements": [
    {
      "skillSlug": "existing-skill-slug",
      "suggestion": "How to improve this skill",
      "additionalContent": "Content to append or modify"
    }
  ],
  "memoryExtractions": [
    {
      "key": "Short Label",
      "content": "The fact or preference to remember",
      "importance": 1-10,
      "type": "memory|user_profile"
    }
  ]
}

Only suggest items that are genuinely valuable. Quality over quantity. If nothing stands out, return empty arrays.`,
        },
        {
          role: 'user',
          content: `Analyze this conversation:\n\n${conversationText}`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No analysis generated' }, { status: 500 });
    }

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      return NextResponse.json({
        analysis: {
          newSkills: [],
          skillImprovements: [],
          memoryExtractions: [],
          rawContent: content,
        },
      });
    }

    // Optionally auto-create memories if they have high importance
    if (analysis.memoryExtractions && Array.isArray(analysis.memoryExtractions)) {
      for (const mem of analysis.memoryExtractions) {
        if (mem.importance >= 7 && mem.key && mem.content) {
          // Check if a memory with this key already exists
          const existing = await db.agentMemoryV2.findFirst({
            where: { key: mem.key, organizationId: ORG_ID },
          });
          if (!existing) {
            await db.agentMemoryV2.create({
              data: {
                type: mem.type || 'memory',
                key: mem.key,
                content: mem.content.substring(0, 500),
                importance: Math.min(10, Math.max(1, mem.importance)),
                charLimit: 500,
                sessionId: sessionId || null,
                organizationId: ORG_ID,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in auto-learn:', error);
    return NextResponse.json({ error: 'Failed to analyze conversation' }, { status: 500 });
  }
}
