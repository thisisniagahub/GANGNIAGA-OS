/**
 * GangNiaga AI OS — Database Setup API Route
 *
 * GET: Check database status and return setup instructions
 * POST: Seed database with default data
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.',
        tablesExist: false,
      });
    }

    const supabase = getSupabaseServer();

    // Check if organizations table exists
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .limit(1);

    if (orgError) {
      if (orgError.code === '42P01') {
        return NextResponse.json({
          status: 'needs_migration',
          message: 'Database tables have not been created yet. Please run the SQL migration in your Supabase SQL Editor.',
          tablesExist: false,
          migrationFile: '/supabase-schema.sql',
          instructions: [
            '1. Go to your Supabase project dashboard',
            '2. Navigate to SQL Editor',
            '3. Copy and paste the contents of supabase-schema.sql',
            '4. Click "Run" to execute the migration',
            '5. Refresh this page to verify the setup',
          ],
        });
      }
      return NextResponse.json({
        status: 'error',
        message: orgError.message,
        tablesExist: false,
      });
    }

    const hasDefaultOrg = orgs?.some(o => o.id === 'org1');

    return NextResponse.json({
      status: 'ready',
      message: 'Database is configured and tables exist.',
      tablesExist: true,
      defaultOrganizationExists: hasDefaultOrg,
      organizationCount: orgs?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      tablesExist: false,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body;
    const supabase = getSupabaseServer();

    if (action === 'seed_organization') {
      const { data, error } = await supabase
        .from('organizations')
        .upsert({
          id: 'org1',
          name: 'GangNiaga Sdn Bhd',
          slug: 'gangniaga',
          industry: 'SaaS / Software',
          size: '11-50',
          country: 'MY',
        })
        .select();

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true, data });
    }

    if (action === 'seed_skills') {
      const skills = [
        { id: 'skill-1', name: 'Market Analysis', slug: 'market-analysis', description: 'Analyze market size, trends, and competitive landscape', category: 'research', content: 'Perform comprehensive market analysis including TAM/SAM/SOM calculation, competitor mapping, and market trend identification.', trigger_phrase: '/market-analysis', source: 'bundled', organization_id: 'org1' },
        { id: 'skill-2', name: 'Financial Forecast', slug: 'financial-forecast', description: 'Generate financial projections with P&L and DSCR', category: 'financial', content: 'Create detailed financial forecasts including revenue projections, expense breakdowns, cash flow analysis, and DSCR calculations.', trigger_phrase: '/financial-forecast', source: 'bundled', organization_id: 'org1' },
        { id: 'skill-3', name: 'Business Plan', slug: 'business-plan', description: 'Generate professional 21-section business proposals', category: 'business', content: 'Generate comprehensive business plans following the 21-section professional structure.', trigger_phrase: '/business-plan', source: 'bundled', organization_id: 'org1' },
        { id: 'skill-4', name: 'Idea Validator', slug: 'validate-idea', description: 'Validate business ideas with scoring and benchmarking', category: 'business', content: 'Evaluate business ideas against multiple criteria. Provide a 0-100 validation score, benchmark comparison, and recommendations.', trigger_phrase: '/validate-idea', source: 'bundled', organization_id: 'org1' },
        { id: 'skill-5', name: 'Plan Review', slug: 'review-plan', description: 'Review business plans from lender perspective', category: 'business', content: 'Review business plans from a bank lender, investor, or grant officer perspective. Score narrative quality, financial accuracy, and consistency.', trigger_phrase: '/review-plan', source: 'bundled', organization_id: 'org1' },
      ];

      const { data, error } = await supabase.from('skills').upsert(skills).select();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
