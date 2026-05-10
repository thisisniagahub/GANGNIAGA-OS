import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
