import { NextRequest, NextResponse } from 'next/server';
import { hermes } from '@/lib/hermes';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceTaskName = searchParams.get('task');

    // 1. Fetch KPI metrics from DB or fallback
    let kpiBriefing = "Revenue: RM284,500 (+11.1% MRR) | Burn Rate: RM187,200 | DSCR: 1.45x (Bank target: 1.25x)";

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();
      const { data } = await supabase
        .from('kpis')
        .select('*')
        .eq('organization_id', ORG_ID);
      
      if (data && data.length > 0) {
        kpiBriefing = data.map((k: any) => `${k.metric}: ${k.value}${k.unit === 'currency' ? ' MYR' : ''}`).join(' | ');
      }
    } else if (db) {
      const kpis = await db.kPIData.findMany({
        where: { organizationId: ORG_ID }
      });
      if (kpis.length > 0) {
        kpiBriefing = kpis.map(k => `${k.metric}: ${k.value} ${k.unit === 'currency' ? 'MYR' : ''}`).join(' | ');
      }
    }

    // 2. Draft the daily briefing using Hermes
    const prompt = `You are the Daily Briefing Bot for GangNiaga AI OS.
Compile a professional daily update for the business owner based on these metrics:
${kpiBriefing}

Format it beautifully for messaging apps (Telegram/WhatsApp) using emojis, clear bullet points, and bold text. Keep it brief.`;

    const completion = await hermes.chatCompletion([
      { role: 'user', content: prompt }
    ]);

    const summaryText = completion.choices?.[0]?.message?.content || "Daily KPI Briefing failed to generate.";

    // 3. Simulate message gateway dispatch (OpenClaw delivery)
    console.log(`[Cron Task] Daily Briefing Dispatched to Gateway:`);
    console.log(summaryText);

    return NextResponse.json({
      success: true,
      taskRun: forceTaskName || "Daily KPI Summary",
      timestamp: new Date().toISOString(),
      briefing: summaryText,
      dispatchStatus: "sent_to_gateway"
    });

  } catch (error: any) {
    console.error('Error in scheduled task execution:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
