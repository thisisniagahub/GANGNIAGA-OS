import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';
import { db } from '@/lib/db';

const ORG_ID = 'org1';

/** Map a Supabase kpi_data row (snake_case) to camelCase */
function mapKpiFromSupabase(k: Record<string, unknown>) {
  return {
    id: k.id as string,
    metric: k.metric as string,
    value: k.value as number,
    previousValue: (k.previous_value as number) ?? null,
    target: (k.target as number) ?? null,
    unit: (k.unit as string) || 'currency',
    period: k.period as string,
    organizationId: k.organization_id as string,
    createdAt: k.created_at as string,
    updatedAt: k.updated_at as string,
  };
}

/** Map a Supabase business_plan row (snake_case) to camelCase */
function mapPlanFromSupabase(p: Record<string, unknown>) {
  return {
    id: p.id as string,
    title: p.title as string,
    status: (p.status as string) || 'draft',
    executiveSummary: (p.executive_summary as string) ?? null,
    marketAnalysis: (p.market_analysis as string) ?? null,
    swotAnalysis: (p.swot_analysis as string) ?? null,
    competitorAnalysis: (p.competitor_analysis as string) ?? null,
    financialPlan: (p.financial_plan as string) ?? null,
    riskAnalysis: (p.risk_analysis as string) ?? null,
    recommendations: (p.recommendations as string) ?? null,
    organizationId: p.organization_id as string,
    createdAt: p.created_at as string,
    updatedAt: p.updated_at as string,
  };
}

/** Map a Supabase agent_session row (snake_case) to camelCase */
function mapAgentFromSupabase(a: Record<string, unknown>) {
  return {
    id: a.id as string,
    name: a.name as string,
    type: (a.type as string) || 'general',
    status: (a.status as string) || 'idle',
    tasksCompleted: (a.tasks_completed as number) ?? 0,
    lastActivity: a.last_activity as string | null,
    config: a.config as unknown ?? null,
    organizationId: a.organization_id as string,
    createdAt: a.created_at as string,
    updatedAt: a.updated_at as string,
  };
}

/** Map a Supabase workflow_run row (snake_case) to camelCase */
function mapWorkflowFromSupabase(w: Record<string, unknown>) {
  return {
    id: w.id as string,
    name: w.name as string,
    type: (w.type as string) || 'scheduled',
    status: (w.status as string) || 'pending',
    triggerType: (w.trigger_type as string) || 'manual',
    steps: w.steps as unknown ?? null,
    organizationId: w.organization_id as string,
    createdAt: w.created_at as string,
    updatedAt: w.updated_at as string,
  };
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServer();

      const [kpisRes, plansRes, agentsRes, workflowsRes] = await Promise.all([
        supabase.from('kpi_data').select('*').eq('organization_id', ORG_ID).order('created_at', { ascending: false }).limit(10),
        supabase.from('business_plans').select('*').eq('organization_id', ORG_ID).order('updated_at', { ascending: false }).limit(5),
        supabase.from('agent_sessions').select('*').eq('organization_id', ORG_ID).order('updated_at', { ascending: false }).limit(10),
        supabase.from('workflow_runs').select('*').eq('organization_id', ORG_ID).order('updated_at', { ascending: false }).limit(10),
      ]);

      if (kpisRes.error) throw kpisRes.error;
      if (plansRes.error) throw plansRes.error;
      if (agentsRes.error) throw agentsRes.error;
      if (workflowsRes.error) throw workflowsRes.error;

      const kpis = (kpisRes.data || []).map(mapKpiFromSupabase);
      const plans = (plansRes.data || []).map(mapPlanFromSupabase);
      const agents = (agentsRes.data || []).map(mapAgentFromSupabase);
      const workflows = (workflowsRes.data || []).map(mapWorkflowFromSupabase);

      return NextResponse.json({ kpis, plans, agents, workflows });
    } else if (db) {
      const kpis = await db.kPIData.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const plans = await db.businessPlan.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
      });

      const agents = await db.agentSession.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 10,
      });

      const workflows = await db.workflowRun.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 10,
      });

      return NextResponse.json({
        kpis,
        plans,
        agents,
        workflows,
      });
    }

    return NextResponse.json({ kpis: [], plans: [], agents: [], workflows: [] });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
