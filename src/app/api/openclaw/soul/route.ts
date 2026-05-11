import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ORGANIZATION_ID = 'org1';

interface SoulConfigResponse {
  personality: string;
  tone: string;
  language: string;
  specialty: string;
  greeting: string;
  rules: string[];
}

const DEFAULT_RULES: string[] = [
  'Always respond in a professional yet approachable manner',
  'Reference ASEAN market data and regulations when relevant',
  'Provide actionable, specific advice rather than generic platitudes',
  'If unsure about financial figures, explicitly state the uncertainty',
  "Respect the user's time — be concise unless detail is requested",
];

const DEFAULT_SOUL = {
  personality: 'Professional, knowledgeable, and supportive ASEAN SME business assistant',
  tone: 'Professional yet approachable; uses Malaysian business English',
  language: 'English (with Bahasa Melayu and Mandarin loan words where appropriate)',
  specialty: 'ASEAN SME business planning, financial modeling, and market analysis',
  greeting: "Hello! I'm your AI business assistant for GangNiaga. How can I help you grow your business today?",
  rules: JSON.stringify(DEFAULT_RULES),
};

function toResponse(row: {
  personality: string;
  tone: string;
  language: string;
  specialty: string;
  greeting: string;
  rules: string;
}): SoulConfigResponse {
  let parsedRules: string[] = [];
  try {
    parsedRules = JSON.parse(row.rules);
  } catch {
    parsedRules = [];
  }
  return {
    personality: row.personality,
    tone: row.tone,
    language: row.language,
    specialty: row.specialty,
    greeting: row.greeting,
    rules: parsedRules,
  };
}

export async function GET() {
  try {
    let config = await db.openClawSoulConfig.findFirst({
      where: { organizationId: ORGANIZATION_ID },
    });

    if (!config) {
      config = await db.openClawSoulConfig.create({
        data: {
          ...DEFAULT_SOUL,
          organizationId: ORGANIZATION_ID,
        },
      });
    }

    return NextResponse.json(toResponse(config));
  } catch (error) {
    console.error('Failed to read SOUL config:', error);
    return NextResponse.json(
      { error: 'Failed to read SOUL config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { personality, tone, language, specialty, greeting, rules } = body;

    // Validate required fields
    if (!personality || !tone || !language || !specialty || !greeting) {
      return NextResponse.json(
        { error: 'personality, tone, language, specialty, and greeting are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(rules)) {
      return NextResponse.json(
        { error: 'rules must be an array of strings' },
        { status: 400 }
      );
    }

    const existing = await db.openClawSoulConfig.findFirst({
      where: { organizationId: ORGANIZATION_ID },
    });

    const config = existing
      ? await db.openClawSoulConfig.update({
          where: { id: existing.id },
          data: {
            personality,
            tone,
            language,
            specialty,
            greeting,
            rules: JSON.stringify(rules),
          },
        })
      : await db.openClawSoulConfig.create({
          data: {
            personality,
            tone,
            language,
            specialty,
            greeting,
            rules: JSON.stringify(rules),
            organizationId: ORGANIZATION_ID,
          },
        });

    return NextResponse.json(toResponse(config));
  } catch (error) {
    console.error('Failed to update SOUL config:', error);
    return NextResponse.json(
      { error: 'Failed to update SOUL config' },
      { status: 500 }
    );
  }
}
