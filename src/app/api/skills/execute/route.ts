import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getZAI } from '@/lib/zai';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillSlug, input, sessionId } = body;

    if (!skillSlug || !input) {
      return NextResponse.json(
        { error: 'skillSlug and input are required' },
        { status: 400 }
      );
    }

    // Find the skill by slug
    const skill = await db.skill.findFirst({
      where: { slug: skillSlug, organizationId: ORG_ID, status: 'active' },
    });

    if (!skill) {
      return NextResponse.json(
        { error: `Active skill with slug "${skillSlug}" not found` },
        { status: 404 }
      );
    }

    // Get related memories for context (top 5 most important)
    const memories = await db.agentMemoryV2.findMany({
      where: { organizationId: ORG_ID, type: 'memory' },
      orderBy: { importance: 'desc' },
      take: 5,
    });

    // Get user profile if available
    const userProfile = await db.agentMemoryV2.findFirst({
      where: { organizationId: ORG_ID, type: 'user_profile' },
    });

    // Build context from memory
    const memoryContext = memories.length > 0
      ? memories.map((m) => `- ${m.key}: ${m.content}`).join('\n')
      : 'No prior memories.';

    const profileContext = userProfile
      ? `User Profile: ${userProfile.content}`
      : '';

    // Use z-ai-web-dev-sdk to generate a response using the skill as context
    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are GangNiaga AI, a professional ASEAN SME business assistant. You are now using the skill "${skill.name}" (v${skill.version}).

## SKILL INSTRUCTIONS
${skill.content}

## RELEVANT MEMORIES
${memoryContext}

${profileContext}

Follow the skill instructions precisely. Apply the skill's knowledge to the user's input. Be thorough, professional, and data-driven. Use Malaysian business context where relevant. Format your response in clear markdown.`,
        },
        {
          role: 'user',
          content: input,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: 'No response generated' }, { status: 500 });
    }

    // Increment usage count and update lastUsedAt
    await db.skill.update({
      where: { id: skill.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    // Update session skillsUsed if sessionId provided
    if (sessionId) {
      const session = await db.chatSession.findFirst({
        where: { id: sessionId, organizationId: ORG_ID },
      });
      if (session) {
        const skillsUsed: string[] = session.skillsUsed ? JSON.parse(session.skillsUsed) : [];
        if (!skillsUsed.includes(skill.id)) {
          skillsUsed.push(skill.id);
          await db.chatSession.update({
            where: { id: sessionId },
            data: { skillsUsed: JSON.stringify(skillsUsed) },
          });
        }
      }
    }

    return NextResponse.json({
      skill: {
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        category: skill.category,
      },
      response,
    });
  } catch (error) {
    console.error('Error executing skill:', error);
    return NextResponse.json({ error: 'Failed to execute skill' }, { status: 500 });
  }
}
