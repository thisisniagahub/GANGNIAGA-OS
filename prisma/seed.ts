/**
 * GangNiaga AI OS — Database Seed Script
 *
 * Seeds the database with default organization, user, skills, memories,
 * and OpenClaw gateway data. Uses upsert patterns to be idempotent
 * (safe to run multiple times).
 *
 * Works with both SQLite (local dev) and PostgreSQL (Vercel/production).
 *
 * Usage:
 *   bunx tsx prisma/seed.ts
 *   bun run db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ORG_ID = 'org1';
const ORG_SLUG = 'gangniaga-default';

// ─── Bundled Skills ──────────────────────────────────────────────

const BUNDLED_SKILLS = [
  {
    name: 'Market Analysis',
    slug: 'market-analysis',
    description:
      'Analyzes markets, competitors, and industry trends with ASEAN focus. Provides data-driven market sizing and competitive intelligence.',
    version: '1.0.0',
    category: 'research',
    content: `# Market Analysis Skill

## Purpose
Provide comprehensive market analysis with a focus on Southeast Asian markets, including market sizing, competitive intelligence, and industry trends.

## Instructions

### Market Sizing Framework
1. **Total Addressable Market (TAM)**: The total market demand for the product/service
2. **Serviceable Available Market (SAM)**: The portion of TAM reachable by the business
3. **Serviceable Obtainable Market (SOM)**: The realistic market share achievable

Use both top-down and bottom-up approaches for validation.

### Analysis Structure
- Industry Overview (market size, growth rate, CAGR)
- Market Segmentation (ASEAN-6 focus)
- Competitive Landscape (Porter's Five Forces)
- Customer Analysis (personas, buying behavior, pain points)
- Market Entry Strategy if applicable

### Data Sources
- Department of Statistics Malaysia (DOSM)
- World Bank data, IMF economic forecasts
- Bank Negara Malaysia reports
- ASEAN Statistics Division

## Guidelines
- Always specify the geographic scope
- Use RM for Malaysian market sizing
- Note data currency and reliability
- Include confidence intervals where possible`,
    triggerPhrase: '/market-analysis',
    tags: ['market', 'research', 'competition', 'ASEAN'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'Financial Advisor',
    slug: 'financial-advisor',
    description:
      'Provides financial planning advice, cash flow analysis, and investment recommendations for ASEAN SMEs with Malaysian Ringgit focus.',
    version: '1.0.0',
    category: 'financial',
    content: `# Financial Advisor Skill

## Purpose
Provide expert financial planning, cash flow analysis, and investment recommendations tailored for ASEAN SMEs.

## Instructions

### Financial Health Check
1. **Liquidity Analysis**: Current ratio, quick ratio, working capital
2. **Profitability**: Gross margin, operating margin, net margin
3. **Efficiency**: Inventory turnover, receivables turnover, payables turnover
4. **Leverage**: Debt-to-equity, interest coverage, DSCR

### Cash Flow Management
- Monthly cash flow projections (12-month rolling)
- Burn rate and runway calculations
- Seasonal cash flow patterns
- Emergency fund recommendations (3-6 months operating expenses)

### Investment Guidance
- Fixed deposit vs unit trust comparisons (Malaysian context)
- EPF withdrawal strategies for business owners
- SST and tax optimization
- Working capital financing options (overdraft, factoring, trade credit)

### Key Ratios (ASEAN SME Benchmarks)
- Current Ratio: > 1.5
- DSCR: > 1.25x (bank loan minimum)
- Gross Margin: Industry-dependent (30-60% typical for SMEs)
- Debt-to-Equity: < 2.0 (banking norm)

## Guidelines
- All figures in Malaysian Ringgit (RM)
- Reference Bank Negara Malaysia rates
- Consider SST implications
- Flag when assumptions are unrealistic`,
    triggerPhrase: '/financial-advisor',
    tags: ['finance', 'cash-flow', 'investment', 'advisory'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'Business Plan Generator',
    slug: 'business-plan-generator',
    description:
      'Creates comprehensive professional business plans with all key sections for bank loans, investor pitches, and grant applications.',
    version: '1.0.0',
    category: 'business',
    content: `# Business Plan Generator Skill

## Purpose
Generate comprehensive, professional business plans suitable for bank loans, investor pitches, and grant applications in the ASEAN market context.

## Instructions

### Plan Structure
1. Executive Summary (company, mission, market size, revenue model, funding)
2. Company Overview (legal structure Sdn Bhd/PLT, team, IP)
3. Market Analysis (ASEAN-specific data, TAM/SAM/SOM)
4. Competitive Analysis (positioning, barriers to entry, UVP)
5. Products & Services (pricing in RM, distribution, roadmap)
6. Marketing & Sales Strategy (GTM, CAC, conversion targets)
7. Operations Plan (process, partnerships, QA)
8. Management Team (org structure, advisory board)
9. Financial Projections (3-5yr in RM, cash flow, P&L, break-even)
10. Risk Analysis (mitigation strategies)
11. SWOT Analysis
12. Funding Request (use of funds, ROI, exit strategy)

## Guidelines
- All financial figures in Malaysian Ringgit (RM)
- Reference Malaysian regulatory bodies (SSM, BNM, SC, LHDN)
- Include ASEAN market context
- Cite data sources where possible`,
    triggerPhrase: '/business-plan',
    tags: ['business', 'planning', 'proposals', 'funding'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'SWOT Analyzer',
    slug: 'swot-analyzer',
    description:
      'Creates comprehensive SWOT analysis with TOWS strategic matrix, action planning, and competitive positioning.',
    version: '1.0.0',
    category: 'business',
    content: `# SWOT Analyzer Skill

## Purpose
Generate thorough SWOT (Strengths, Weaknesses, Opportunities, Threats) analyses with strategic action plans for ASEAN SMEs.

## Instructions

### Internal Assessment
- **Strengths**: Core competencies, IP, team, financial position, brand
- **Weaknesses**: Resource gaps, operational limitations, dependencies

### External Assessment
- **Opportunities**: Market trends, regulatory changes, tech enablers, MIDA/MDEC/TERAJU incentives
- **Threats**: Competition, disruption, regulation, currency risks, supply chain

### TOWS Strategic Matrix
1. **SO Strategies**: Use strengths to exploit opportunities
2. **WO Strategies**: Overcome weaknesses to pursue opportunities
3. **ST Strategies**: Use strengths to counter threats
4. **WT Strategies**: Minimize weaknesses and avoid threats

### Action Plan
- Priority (High/Medium/Low)
- Timeline (Immediate/Short/Medium/Long-term)
- KPIs and risk mitigation

## Guidelines
- Be specific and quantify where possible
- Consider ASEAN dynamics
- Prioritize by impact and likelihood`,
    triggerPhrase: '/swot',
    tags: ['strategy', 'analysis', 'SWOT', 'planning'],
    source: 'bundled',
    autoLearn: false,
  },
  {
    name: 'Competitor Research',
    slug: 'competitor-research',
    description:
      'Conducts in-depth competitor analysis including market positioning, pricing benchmarking, and strategic gap identification.',
    version: '1.0.0',
    category: 'research',
    content: `# Competitor Research Skill

## Purpose
Conduct systematic competitor analysis for ASEAN SMEs with focus on positioning, pricing, and strategic gaps.

## Instructions

### Competitor Identification
- Direct competitors (same product/market)
- Indirect competitors (alternative solutions)
- Emerging disruptors
- International players entering ASEAN

### Analysis Framework
1. **Market Positioning Map** (price vs quality, niche vs broad)
2. **Pricing Benchmarking** (in RM, compare tiers and models)
3. **Feature Comparison Matrix** (must-have, nice-to-have, unique)
4. **SWOT per Competitor** (strengths, weaknesses, strategies)
5. **Porter's Five Forces** (industry attractiveness)

### Competitive Intelligence
- Recent funding rounds and valuations
- Key hires and team changes
- Product launches and pivots
- Marketing strategies and channels
- Customer reviews and sentiment

### Strategic Gap Analysis
- Underserved segments
- Feature gaps in market
- Price-value opportunities
- Geographic expansion potential

### Output Format
- Executive summary with competitive landscape overview
- Detailed competitor profiles
- Positioning map (visual description)
- Strategic recommendations with priority

## Guidelines
- Use public data only, note data freshness
- All pricing in RM for Malaysian context
- Include ASEAN regional players
- Distinguish between verified and estimated data`,
    triggerPhrase: '/competitor-research',
    tags: ['competition', 'research', 'benchmarking', 'strategy'],
    source: 'bundled',
    autoLearn: true,
  },
];

// ─── Seed Functions ──────────────────────────────────────────────

async function seedOrganization() {
  console.log('\n🏢 Seeding organization...');

  const org = await prisma.organization.upsert({
    where: { id: ORG_ID },
    update: {
      name: 'GangNiaga Default',
      slug: ORG_SLUG,
      industry: 'Technology',
      size: '1-10',
      country: 'MY',
    },
    create: {
      id: ORG_ID,
      name: 'GangNiaga Default',
      slug: ORG_SLUG,
      industry: 'Technology',
      size: '1-10',
      country: 'MY',
    },
  });

  console.log(`  ✅ Organization: ${org.name} (${org.id})`);
  return org;
}

async function seedUser() {
  console.log('\n👤 Seeding default user...');

  const user = await prisma.user.upsert({
    where: { email: 'admin@gangniaga.com' },
    update: {
      name: 'GangNiaga Admin',
      role: 'owner',
      organizationId: ORG_ID,
    },
    create: {
      email: 'admin@gangniaga.com',
      name: 'GangNiaga Admin',
      role: 'owner',
      organizationId: ORG_ID,
    },
  });

  console.log(`  ✅ User: ${user.name} (${user.email})`);
  return user;
}

async function seedOpenClawSoulConfig() {
  console.log('\n🧠 Seeding OpenClaw Soul Config...');

  const existing = await prisma.openClawSoulConfig.findFirst({
    where: { organizationId: ORG_ID },
  });

  if (existing) {
    console.log('  ⏭️  Soul config already exists, skipping');
    return existing;
  }

  const soul = await prisma.openClawSoulConfig.create({
    data: {
      personality:
        'Professional, knowledgeable, and supportive ASEAN SME business assistant',
      tone: 'Professional yet approachable; uses Malaysian business English',
      language:
        'English (with Bahasa Melayu and Mandarin loan words where appropriate)',
      specialty:
        'ASEAN SME business planning, financial modeling, and market analysis',
      greeting:
        "Hello! I'm your AI business assistant for GangNiaga. How can I help you grow your business today?",
      rules: JSON.stringify([
        'Always respond in the language the user addresses you in',
        'Cite data sources whenever providing market or financial data',
        'Never fabricate statistics — if unsure, say so and suggest verification',
        'Respect confidentiality of business information shared during sessions',
        'Reference DSCR minimum 1.25x when discussing loan eligibility',
        'Use Malaysian Ringgit (RM) as default currency unless specified otherwise',
        'Reference Malaysian regulatory bodies (SSM, BNM, SC, LHDN) where relevant',
      ]),
      organizationId: ORG_ID,
    },
  });

  console.log(`  ✅ Soul config created (${soul.id})`);
  return soul;
}

async function seedSkills() {
  console.log('\n🎯 Seeding bundled skills...');

  let created = 0;
  let skipped = 0;

  for (const skillData of BUNDLED_SKILLS) {
    // Check by slug OR name since both have unique constraints
    const existing = await prisma.skill.findFirst({
      where: {
        OR: [
          { slug: skillData.slug },
          { name: skillData.name },
        ],
        organizationId: ORG_ID,
      },
    });

    if (existing) {
      // If skill exists with same name but different slug (from old seed), update it
      if (existing.name === skillData.name && existing.slug !== skillData.slug) {
        await prisma.skill.update({
          where: { id: existing.id },
          data: {
            slug: skillData.slug,
            description: skillData.description,
            version: skillData.version,
            category: skillData.category,
            content: skillData.content,
            triggerPhrase: skillData.triggerPhrase,
            tags: JSON.stringify(skillData.tags),
            source: skillData.source,
            autoLearn: skillData.autoLearn,
            status: 'active',
          },
        });
        console.log(
          `  🔄 Updated skill "${skillData.name}" (slug: ${existing.slug} → ${skillData.slug})`
        );
        created++;
        continue;
      }

      console.log(`  ⏭️  Skill "${skillData.name}" already exists, skipping`);
      skipped++;
      continue;
    }

    await prisma.skill.create({
      data: {
        name: skillData.name,
        slug: skillData.slug,
        description: skillData.description,
        version: skillData.version,
        category: skillData.category,
        content: skillData.content,
        triggerPhrase: skillData.triggerPhrase,
        tags: JSON.stringify(skillData.tags),
        source: skillData.source,
        autoLearn: skillData.autoLearn,
        status: 'active',
        organizationId: ORG_ID,
      },
    });

    console.log(
      `  ✅ Created skill "${skillData.name}" (${skillData.triggerPhrase})`
    );
    created++;
  }

  console.log(`  📊 Skills: ${created} created, ${skipped} skipped`);
}

async function seedMemories() {
  console.log('\n💾 Seeding sample memories...');

  const memories = [
    {
      type: 'workspace',
      category: 'company_profile',
      content:
        'GangNiaga AI OS is a business intelligence platform for ASEAN SMEs. Founded in 2024, headquartered in Kuala Lumpur, Malaysia. Primary market: Malaysian SMEs with expansion plans to Singapore, Indonesia, and Thailand. Revenue model: SaaS subscription (RM99-499/month tiers). Current MRR: RM15,000. Team size: 5 full-time.',
      organizationId: ORG_ID,
    },
    {
      type: 'workspace',
      category: 'user_preferences',
      content:
        'Default currency: RM (Malaysian Ringgit). Default geography: Malaysia (MY). Preferred language: English with Bahasa Melayu terms. Report format: PDF. Financial year: January-December. Tax regime: SST (Sales and Service Tax). Banking reference: Bank Negara Malaysia rates.',
      organizationId: ORG_ID,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const mem of memories) {
    // Check if memory with this category already exists for the org
    const existing = await prisma.agentMemory.findFirst({
      where: {
        category: mem.category,
        organizationId: ORG_ID,
        type: mem.type,
      },
    });

    if (existing) {
      console.log(`  ⏭️  Memory "${mem.category}" already exists, skipping`);
      skipped++;
      continue;
    }

    await prisma.agentMemory.create({
      data: mem,
    });

    console.log(`  ✅ Created memory "${mem.category}"`);
    created++;
  }

  console.log(`  📊 Memories: ${created} created, ${skipped} skipped`);
}

async function seedMemoriesV2() {
  console.log('\n📝 Seeding AgentMemoryV2 entries...');

  const memories = [
    {
      type: 'user_profile',
      key: 'company_profile',
      content:
        'GangNiaga AI OS — ASEAN SME business intelligence platform. KL-based, 2024. SaaS RM99-499/mo. MRR RM15,000. Team of 5.',
      importance: 9,
      charLimit: 500,
      organizationId: ORG_ID,
    },
    {
      type: 'memory',
      key: 'user_preferences',
      content:
        'Currency: RM. Geography: MY. Language: EN/BM. Report format: PDF. FY: Jan-Dec. Tax: SST.',
      importance: 8,
      charLimit: 500,
      organizationId: ORG_ID,
    },
    {
      type: 'memory',
      key: 'default_dscr_target',
      content: 'Minimum DSCR for bank loan eligibility: 1.25x (Bank Negara Malaysia norm)',
      importance: 7,
      charLimit: 200,
      organizationId: ORG_ID,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const mem of memories) {
    const existing = await prisma.agentMemoryV2.findFirst({
      where: {
        key: mem.key,
        organizationId: ORG_ID,
        type: mem.type,
      },
    });

    if (existing) {
      console.log(`  ⏭️  AgentMemoryV2 "${mem.key}" already exists, skipping`);
      skipped++;
      continue;
    }

    await prisma.agentMemoryV2.create({
      data: mem,
    });

    console.log(`  ✅ Created AgentMemoryV2 "${mem.key}"`);
    created++;
  }

  console.log(`  📊 AgentMemoryV2: ${created} created, ${skipped} skipped`);
}

async function seedGateway() {
  console.log('\n🌐 Seeding OpenClaw Gateway data...');

  // Seed gateway
  const existingGateway = await prisma.openClawGateway.findFirst({
    where: { organizationId: ORG_ID },
  });

  if (existingGateway) {
    console.log('  ⏭️  Gateway already exists, skipping');
  } else {
    await prisma.openClawGateway.create({
      data: {
        status: 'running',
        bindHost: '127.0.0.1',
        bindPort: 18789,
        uptime: 864000, // 10 days in seconds
        connectedClients: 3,
        activeChannels: 4,
        totalMessages: 12847,
        version: '0.9.1',
        lastHealthCheck: new Date(),
        config: JSON.stringify({
          authMode: 'loopback_only',
          logLevel: 'info',
          maxSessions: 50,
          sessionTimeout: 1800,
        }),
        organizationId: ORG_ID,
      },
    });
    console.log('  ✅ Created gateway (127.0.0.1:18789)');
  }

  // Seed sample channels
  const channels = [
    {
      type: 'whatsapp',
      name: 'WhatsApp Business',
      status: 'connected',
      messageCount: 5230,
      lastMessage: 'Kuala Lumpur market data ready for review',
      avatarUrl: '/icons/whatsapp.svg',
    },
    {
      type: 'telegram',
      name: 'Telegram Bot',
      status: 'connected',
      messageCount: 3120,
      lastMessage: 'Financial forecast updated for Q1 2025',
      avatarUrl: '/icons/telegram.svg',
    },
    {
      type: 'discord',
      name: 'Discord Server',
      status: 'connected',
      messageCount: 2890,
      lastMessage: 'New competitor analysis available',
      avatarUrl: '/icons/discord.svg',
    },
    {
      type: 'webchat',
      name: 'Web Chat',
      status: 'connected',
      messageCount: 1607,
      lastMessage: 'Welcome to GangNiaga AI OS support',
      avatarUrl: '/icons/webchat.svg',
    },
  ];

  let channelsCreated = 0;
  for (const ch of channels) {
    const existing = await prisma.openClawChannel.findFirst({
      where: { type: ch.type, organizationId: ORG_ID },
    });

    if (existing) {
      console.log(`  ⏭️  Channel "${ch.name}" already exists, skipping`);
      continue;
    }

    await prisma.openClawChannel.create({
      data: {
        type: ch.type,
        name: ch.name,
        status: ch.status,
        messageCount: ch.messageCount,
        lastMessage: ch.lastMessage,
        lastMessageAt: new Date(),
        config: JSON.stringify({ enabled: true }),
        pairedAt: new Date('2024-12-01'),
        avatarUrl: ch.avatarUrl,
        organizationId: ORG_ID,
      },
    });

    console.log(`  ✅ Created channel "${ch.name}" (${ch.type})`);
    channelsCreated++;
  }

  if (channelsCreated > 0) {
    console.log(`  📊 Channels: ${channelsCreated} created`);
  }
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 GangNiaga AI OS — Database Seed');
  console.log('='.repeat(50));

  const dbUrl = process.env.DATABASE_URL || '(not set)';
  const dbType = dbUrl.startsWith('file:') ? 'SQLite' : dbUrl.startsWith('postgresql') ? 'PostgreSQL' : 'Unknown';
  console.log(`📦 Database type: ${dbType}`);
  console.log(`🔗 DATABASE_URL: ${dbUrl.substring(0, 30)}...`);
  console.log('─'.repeat(50));

  try {
    await seedOrganization();
    await seedUser();
    await seedOpenClawSoulConfig();
    await seedSkills();
    await seedMemories();
    await seedMemoriesV2();
    await seedGateway();

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Seed completed successfully!');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
