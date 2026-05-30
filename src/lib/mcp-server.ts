/**
 * GANGNIAGA-OS MCP Server
 * 
 * This module exposes GANGNIAGA business tools via Model Context Protocol (MCP)
 * allowing Hermes Agent and other MCP-compatible clients to interact with your business data.
 * 
 * Usage:
 * 1. Run: npm run mcp
 * 2. Configure Hermes: Add GANGNIAGA-OS as an MCP server in ~/.hermes-agent/config.yaml
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Mock DB interfaces - replace with your actual database calls
interface BusinessStrategy {
  niche: string;
  target_audience: string;
  revenue_model: string;
  runway_months?: number;
  burn_rate?: number;
}

interface ContentDraft {
  platform: string;
  topic: string;
  hook: string;
  caption: string;
  hashtags: string[];
}

interface FinancialMetrics {
  monthly_revenue: number;
  monthly_expenses: number;
  runway_months: number;
  burn_rate: number;
  status: 'healthy' | 'warning' | 'critical';
}

// Mock data fetchers - replace with actual DB/API calls
async function getBusinessStrategy(): Promise<BusinessStrategy> {
  // TODO: Replace with actual database query
  return {
    niche: 'AI-powered content creation for ASEAN creators',
    target_audience: 'Young Malaysian entrepreneurs, 18-35',
    revenue_model: 'SaaS subscription + affiliate commissions',
    runway_months: 8,
    burn_rate: 12500,
  };
}

async function getFinancialMetrics(): Promise<FinancialMetrics> {
  // TODO: Replace with actual financial data
  const revenue = 15000;
  const expenses = 12500;
  const runway = 8;
  
  return {
    monthly_revenue: revenue,
    monthly_expenses: expenses,
    runway_months: runway,
    burn_rate: expenses - revenue,
    status: runway < 3 ? 'critical' : runway < 6 ? 'warning' : 'healthy',
  };
}

async function generateContentDraft(platform: string, topic: string): Promise<ContentDraft> {
  // TODO: Replace with actual content generation logic
  return {
    platform,
    topic,
    hook: `Why ${topic} is changing the game for Malaysian creators...`,
    caption: `🔥 ${topic} just got easier! #GANGNIAGA #CreatorMY #Startup`,
    hashtags: ['#GANGNIAGA', '#CreatorEconomy', '#Malaysia', '#StartupMY', '#ContentCreator'],
  };
}

async function trackInvestor(name: string, stage: string, notes?: string): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with actual CRM update
  console.log(`[Investor CRM] ${name} -> ${stage}: ${notes || ''}`);
  return { success: true, message: `Updated ${name} to ${stage}` };
}

// Create MCP Server
const server = new McpServer({
  name: 'GANGNIAGA-OS',
  version: '0.4.0',
  description: 'Business OS for ASEAN founders - MCP Server',
});

// Tool 1: Get Business Strategy
server.tool(
  'get_business_strategy',
  'Retrieve the current business lean canvas, niche, and target audience',
  {},
  async () => {
    const strategy = await getBusinessStrategy();
    return {
      content: [{ type: 'text', text: JSON.stringify(strategy, null, 2) }],
    };
  }
);

// Tool 2: Check Financial Health
server.tool(
  'check_burn_rate',
  'Calculate runway and alert if burn rate is concerning',
  {},
  async () => {
    const metrics = await getFinancialMetrics();
    const alert = metrics.status === 'critical' 
      ? '🚨 CRITICAL: Runway < 3 months! Consider fundraising or cost reduction.'
      : metrics.status === 'warning'
      ? '⚠️ WARNING: Runway < 6 months. Start investor outreach.'
      : '✅ Healthy: Runway > 6 months';
    
    return {
      content: [{ 
        type: 'text', 
        text: `${alert}\n\nMetrics:\n- Monthly Revenue: RM${metrics.monthly_revenue.toLocaleString()}\n- Monthly Expenses: RM${metrics.monthly_expenses.toLocaleString()}\n- Burn Rate: RM${metrics.burn_rate.toLocaleString()}/month\n- Runway: ${metrics.runway_months} months` 
      }],
    };
  }
);

// Tool 3: Generate Content Draft
server.tool(
  'create_content_draft',
  'Generate AI-powered content draft for TikTok/IG/FB/Shopee',
  {
    platform: z.enum(['tiktok', 'instagram', 'facebook', 'shopee']).describe('Target platform'),
    topic: z.string().min(5).describe('Content topic or theme'),
  },
  async ({ platform, topic }) => {
    const draft = await generateContentDraft(platform, topic);
    return {
      content: [{ type: 'text', text: JSON.stringify(draft, null, 2) }],
    };
  }
);

// Tool 4: Track Investor
server.tool(
  'update_investor_stage',
  'Update investor CRM stage (researching -> contacted -> meeting -> due_diligence -> term_sheet -> closed)',
  {
    investor_name: z.string().describe('Investor or firm name'),
    stage: z.enum(['researching', 'contacted', 'meeting', 'due_diligence', 'term_sheet', 'closed', 'passed']).describe('New stage'),
    notes: z.string().optional().describe('Additional notes'),
  },
  async ({ investor_name, stage, notes }) => {
    const result = await trackInvestor(investor_name, stage, notes);
    return {
      content: [{ type: 'text', text: result.message }],
    };
  }
);

// Tool 5: Get Content Calendar
server.tool(
  'get_content_calendar',
  'Retrieve scheduled content for the next 7 days',
  {
    platform: z.enum(['tiktok', 'instagram', 'facebook', 'shopee', 'all']).optional().describe('Filter by platform'),
  },
  async ({ platform }) => {
    // TODO: Replace with actual calendar query
    const calendar = {
      week_start: new Date().toISOString().split('T')[0],
      posts: [
        { day: 'Mon', platform: 'tiktok', topic: 'Founder journey', status: 'scheduled' },
        { day: 'Wed', platform: 'instagram', topic: 'Product demo', status: 'draft' },
        { day: 'Fri', platform: 'shopee', topic: 'Flash sale', status: 'scheduled' },
      ].filter(p => !platform || platform === 'all' || p.platform === platform),
    };
    return {
      content: [{ type: 'text', text: JSON.stringify(calendar, null, 2) }],
    };
  }
);

// Tool 6: Quick Business Health Summary
server.tool(
  'get_business_health',
  'One-command summary: financials + pipeline + content status',
  {},
  async () => {
    const [strategy, finances, calendar] = await Promise.all([
      getBusinessStrategy(),
      getFinancialMetrics(),
      // Mock calendar
      { posts: [{ day: 'Today', status: '2 posts scheduled' }] }
    ]);

    const summary = `
📊 GANGNIAGA Business Health - ${new Date().toLocaleDateString('en-MY')}

🎯 Strategy:
   • Niche: ${strategy.niche}
   • Audience: ${strategy.target_audience}

💰 Financials:
   • Runway: ${finances.runway_months} months ${finances.status === 'critical' ? '🚨' : finances.status === 'warning' ? '⚠️' : '✅'}
   • Burn: RM${finances.burn_rate.toLocaleString()}/month

📅 Content:
   • ${calendar.posts[0].status}

🤖 Ask me to:
   • "Generate TikTok script about [topic]"
   • "Update investor [name] to meeting stage"
   • "What's my burn rate?"
    `.trim();

    return {
      content: [{ type: 'text', text: summary }],
    };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🔌 GANGNIAGA-OS MCP Server running on stdio');
  console.error('📡 Ready for Hermes Agent integration');
  console.error('✨ Available tools: get_business_strategy, check_burn_rate, create_content_draft, update_investor_stage, get_content_calendar, get_business_health');
}

main().catch((error) => {
  console.error('MCP Server error:', error);
  process.exit(1);
});

export { server };
