import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SOUL_CONFIG_PATH = join(process.cwd(), 'openclaw-soul.json');

interface SoulConfig {
  personality: string;
  tone: string;
  language: string;
  specialty: string;
  greeting: string;
  rules: string[];
}

const DEFAULT_SOUL_CONFIG: SoulConfig = {
  personality: 'Professional, knowledgeable, and supportive ASEAN SME business assistant',
  tone: 'Professional yet approachable; uses Malaysian business English',
  language: 'English (with Bahasa Melayu and Mandarin loan words where appropriate)',
  specialty: 'ASEAN SME business planning, financial modeling, and market analysis',
  greeting: 'Hello! I\'m your AI business assistant for GangNiaga. How can I help you grow your business today?',
  rules: [
    'Always respond in a professional yet approachable manner',
    'Reference ASEAN market data and regulations when relevant',
    'Provide actionable, specific advice rather than generic platitudes',
    'If unsure about financial figures, explicitly state the uncertainty',
    'Respect the user\'s time — be concise unless detail is requested',
  ],
};

async function getSoulConfig(): Promise<SoulConfig> {
  try {
    const data = await readFile(SOUL_CONFIG_PATH, 'utf-8');
    return JSON.parse(data) as SoulConfig;
  } catch {
    // Return default config if file doesn't exist
    return DEFAULT_SOUL_CONFIG;
  }
}

export async function GET() {
  try {
    const config = await getSoulConfig();
    return NextResponse.json(config);
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

    const config: SoulConfig = {
      personality,
      tone,
      language,
      specialty,
      greeting,
      rules,
    };

    await writeFile(SOUL_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to update SOUL config:', error);
    return NextResponse.json(
      { error: 'Failed to update SOUL config' },
      { status: 500 }
    );
  }
}
