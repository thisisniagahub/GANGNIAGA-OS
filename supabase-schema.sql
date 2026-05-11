-- GangNiaga AI OS — Supabase Database Schema
-- Execute this SQL in the Supabase SQL Editor to create all tables.
-- This script is idempotent (uses IF NOT EXISTS).

-- ─── Organizations ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  size TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'owner',
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Business Plans ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_plans (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  executive_summary TEXT,
  market_analysis TEXT,
  swot_analysis TEXT,
  competitor_analysis TEXT,
  financial_plan TEXT,
  risk_analysis TEXT,
  recommendations TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Forecasts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS forecasts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'revenue',
  period TEXT NOT NULL,
  data JSONB DEFAULT '[]',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Agent Sessions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'idle',
  tasks_completed INT DEFAULT 0,
  last_activity TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Agent Tasks ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input TEXT,
  output TEXT,
  duration INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Agent Memory (Legacy) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_memory (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT DEFAULT 'workspace',
  category TEXT,
  content TEXT NOT NULL,
  embedding TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Workflow Runs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_runs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'scheduled',
  status TEXT DEFAULT 'pending',
  trigger_type TEXT DEFAULT 'manual',
  steps JSONB DEFAULT '[]',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── KPI Data ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kpi_data (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  metric TEXT NOT NULL,
  value FLOAT NOT NULL,
  previous_value FLOAT,
  target FLOAT,
  unit TEXT DEFAULT 'currency',
  period TEXT NOT NULL,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reports ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'investor',
  status TEXT DEFAULT 'generated',
  content JSONB DEFAULT '{}',
  format TEXT DEFAULT 'pdf',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Idea Canvas ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS idea_canvases (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  problem TEXT,
  solution TEXT,
  target_market TEXT,
  revenue_model TEXT,
  competitive_edge TEXT,
  risks JSONB DEFAULT '[]',
  validation_score FLOAT DEFAULT 0,
  validation_report JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Plan Reviews ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  lender_persona TEXT DEFAULT 'bank',
  narrative_score FLOAT DEFAULT 0,
  financial_score FLOAT DEFAULT 0,
  consistency_score FLOAT DEFAULT 0,
  overall_score FLOAT DEFAULT 0,
  discrepancies JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  full_report JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Plan Actuals ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_actuals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT NOT NULL,
  period TEXT NOT NULL,
  planned_amount FLOAT DEFAULT 0,
  actual_amount FLOAT DEFAULT 0,
  variance FLOAT DEFAULT 0,
  variance_percent FLOAT DEFAULT 0,
  source TEXT DEFAULT 'manual',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Pitch Decks ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pitch_decks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  plan_id TEXT,
  template_type TEXT DEFAULT 'investor',
  slides JSONB DEFAULT '[]',
  slide_count INT DEFAULT 0,
  anticipated_questions JSONB DEFAULT '[]',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Citations ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS citations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  source TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'market_data',
  geography TEXT,
  date_published TEXT,
  data_point TEXT,
  verified BOOLEAN DEFAULT FALSE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Integrations ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  last_sync TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'monthly',
  config JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Channels ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_channels (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  message_count INT DEFAULT 0,
  config JSONB DEFAULT '{}',
  paired_at TIMESTAMPTZ,
  avatar_url TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Gateway ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_gateways (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  status TEXT DEFAULT 'unconfigured',
  bind_host TEXT DEFAULT '127.0.0.1',
  bind_port INT DEFAULT 18789,
  uptime INT DEFAULT 0,
  connected_clients INT DEFAULT 0,
  active_channels INT DEFAULT 0,
  total_messages INT DEFAULT 0,
  last_health_check TIMESTAMPTZ,
  version TEXT,
  config JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Plugins ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_plugins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  description TEXT,
  author TEXT,
  capabilities JSONB DEFAULT '[]',
  status TEXT DEFAULT 'available',
  source TEXT DEFAULT 'clawhub',
  installed_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Delegates ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_delegates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  tier TEXT DEFAULT 'tier1_readonly',
  status TEXT DEFAULT 'setup',
  channels JSONB DEFAULT '[]',
  principal_name TEXT,
  principal_email TEXT,
  standing_orders JSONB DEFAULT '[]',
  tasks_completed INT DEFAULT 0,
  last_activity TIMESTAMPTZ,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Webhooks ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_webhooks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  method TEXT DEFAULT 'POST',
  events JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  last_triggered TIMESTAMPTZ,
  trigger_count INT DEFAULT 0,
  secret TEXT,
  headers JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Scheduled Tasks ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_scheduled_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  cron_expression TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  agent_id TEXT,
  prompt TEXT,
  channel TEXT,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  run_count INT DEFAULT 0,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OpenClaw Soul Config ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS openclaw_soul_configs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  personality TEXT DEFAULT 'Professional, knowledgeable, and supportive ASEAN SME business assistant',
  tone TEXT DEFAULT 'Professional yet approachable; uses Malaysian business English',
  language TEXT DEFAULT 'English (with Bahasa Melayu and Mandarin loan words where appropriate)',
  specialty TEXT DEFAULT 'ASEAN SME business planning, financial modeling, and market analysis',
  greeting TEXT DEFAULT 'Hello! I''m your AI business assistant for GangNiaga. How can I help you grow your business today?',
  rules JSONB DEFAULT '[]',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Gateway Conversations ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gateway_conversations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform TEXT NOT NULL,
  platform_user_id TEXT NOT NULL,
  user_name TEXT,
  direction TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Skills System (Hermes-inspired) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  category TEXT DEFAULT 'general',
  content TEXT NOT NULL,
  trigger_phrase TEXT,
  tags JSONB DEFAULT '[]',
  usage_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  source TEXT DEFAULT 'user_created',
  status TEXT DEFAULT 'active',
  auto_learn BOOLEAN DEFAULT FALSE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Agent Memory V2 (Hermes-inspired) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_memory_v2 (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT DEFAULT 'memory',
  key TEXT NOT NULL,
  content TEXT NOT NULL,
  importance INT DEFAULT 5,
  char_limit INT DEFAULT 500,
  session_id TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Chat Sessions (Hermes-inspired) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT,
  platform TEXT DEFAULT 'web',
  platform_session_id TEXT,
  messages JSONB DEFAULT '[]',
  memory_snapshot JSONB,
  soul_snapshot JSONB,
  skills_used JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes for Performance ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_org ON business_plans(organization_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_org ON agent_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_session ON agent_tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_org ON agent_memory(organization_id);
CREATE INDEX IF NOT EXISTS idx_skills_org ON skills(organization_id);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_memory_v2_org ON agent_memory_v2(organization_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_org ON chat_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_gateway_conversations_org ON gateway_conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_openclaw_channels_org ON openclaw_channels(organization_id);
CREATE INDEX IF NOT EXISTS idx_kpi_data_org ON kpi_data(organization_id);

-- ─── Enable Row Level Security ──────────────────────────────────────────────
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_actuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE openclaw_soul_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gateway_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies (Service role bypasses, anon needs read) ──────────────────
-- Allow service role full access (it bypasses RLS by default)
-- Allow anon key read access for public data
CREATE POLICY "Allow public read on organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on organizations" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on organizations" ON organizations FOR UPDATE USING (true);

-- ─── Seed Default Organization ───────────────────────────────────────────────
INSERT INTO organizations (id, name, slug, industry, size, country)
VALUES ('org1', 'GangNiaga Sdn Bhd', 'gangniaga', 'SaaS / Software', '11-50', 'MY')
ON CONFLICT (id) DO NOTHING;

-- ─── Seed Default Skills ─────────────────────────────────────────────────────
INSERT INTO skills (id, name, slug, description, category, content, trigger_phrase, source, organization_id)
VALUES
  ('skill-1', 'Market Analysis', 'market-analysis', 'Analyze market size, trends, and competitive landscape for ASEAN markets', 'research', 'Perform comprehensive market analysis including TAM/SAM/SOM calculation, competitor mapping, and market trend identification. Focus on ASEAN markets with Malaysian business context. Always cite sources and provide data-backed insights.', '/market-analysis', 'bundled', 'org1'),
  ('skill-2', 'Financial Forecast', 'financial-forecast', 'Generate financial projections with P&L, cash flow, and DSCR calculations', 'financial', 'Create detailed financial forecasts including revenue projections, expense breakdowns, cash flow analysis, and Debt Service Coverage Ratio (DSCR) calculations. Use Malaysian Ringgit (RM) as default currency. Include best-case, base-case, and worst-case scenarios.', '/financial-forecast', 'bundled', 'org1'),
  ('skill-3', 'Business Plan Generator', 'business-plan', 'Generate professional 21-section business proposals', 'business', 'Generate comprehensive business plans following the 21-section professional structure. Include executive summary, market analysis, competitive analysis, financial projections, risk assessment, and exit strategy. Adapt tone for bank loan, venture capital, or government grant audiences.', '/business-plan', 'bundled', 'org1'),
  ('skill-4', 'Idea Validator', 'validate-idea', 'Validate business ideas with scoring and benchmarking', 'business', 'Evaluate business ideas against multiple criteria: market viability, problem clarity, solution feasibility, revenue potential, and competitive position. Provide a 0-100 validation score, benchmark comparison, red flags, strengths, and weaknesses. Use ASEAN market benchmarks.', '/validate-idea', 'bundled', 'org1'),
  ('skill-5', 'Plan Review Agent', 'review-plan', 'Review business plans from lender perspective', 'business', 'Review business plans from a bank lender, investor, or grant officer perspective. Score narrative quality, financial accuracy, and consistency between claims and projections. Flag discrepancies and provide actionable recommendations. Ensure DSCR requirements are met for bank proposals.', '/review-plan', 'bundled', 'org1')
ON CONFLICT (id) DO NOTHING;
