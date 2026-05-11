import { db } from '@/lib/db';

const ORG_ID = 'org1';

const BUNDLED_SKILLS = [
  {
    name: 'Business Plan Generator',
    slug: 'business-plan',
    description: 'Creates comprehensive professional business plans with all key sections including executive summary, market analysis, financial projections, and risk assessment.',
    version: '1.0.0',
    category: 'business',
    content: `# Business Plan Generator Skill

## Purpose
Generate comprehensive, professional business plans suitable for bank loans, investor pitches, and grant applications in the ASEAN market context.

## Instructions

When generating a business plan, follow this structure:

### 1. Executive Summary
- Company name, mission, and vision
- Business model overview
- Target market size (TAM/SAM/SOM)
- Revenue model and projections
- Funding requirement and use of funds

### 2. Company Overview
- Legal structure (Sdn Bhd, PLT, etc.)
- Founding team and key personnel
- Location and operations
- Intellectual property and competitive advantages

### 3. Market Analysis
- Industry overview with ASEAN-specific data
- Target market demographics and psychographics
- Market size and growth rate (cite sources)
- Regulatory environment (mention SSM, BNM, SC regulations as applicable)

### 4. Competitive Analysis
- Direct and indirect competitors
- Competitive positioning matrix
- Barriers to entry
- Your unique value proposition

### 5. Products & Services
- Detailed product/service description
- Pricing strategy (in RM)
- Distribution channels
- Product roadmap

### 6. Marketing & Sales Strategy
- Go-to-market plan
- Customer acquisition strategy
- Sales funnel and conversion targets
- Brand positioning

### 7. Operations Plan
- Production/service delivery process
- Key partnerships and suppliers
- Technology infrastructure
- Quality assurance

### 8. Management Team
- Key team members with roles
- Organizational structure
- Advisory board
- Key hires needed

### 9. Financial Projections
- 3-5 year revenue forecast (in RM)
- Monthly cash flow projections (Year 1)
- Profit & loss statements
- Break-even analysis
- Key financial ratios (DSCR, ROE, ROA)

### 10. Risk Analysis
- Key business risks and mitigation
- Market risks
- Operational risks
- Financial risks
- Regulatory compliance risks

### 11. SWOT Analysis
- Strengths, Weaknesses, Opportunities, Threats

### 12. Funding Request
- Total funding required
- Use of funds breakdown
- Expected ROI for investors
- Exit strategy

## Guidelines
- All financial figures in Malaysian Ringgit (RM)
- Reference Malaysian regulatory bodies (SSM, BNM, SC, LHDN)
- Include ASEAN market context where relevant
- Use professional, formal business language
- Cite data sources where possible
- Include charts and tables for financial data`,
    triggerPhrase: '/business-plan',
    tags: ['business', 'planning', 'proposals', 'funding'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'Market Analysis',
    slug: 'market-analysis',
    description: 'Analyzes markets, competitors, and industry trends with ASEAN focus. Provides data-driven market sizing and competitive intelligence.',
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

#### Industry Overview
- Market size and growth rate (CAGR)
- Key industry trends and drivers
- Regulatory landscape (ASEAN-specific)
- Technology disruptions

#### Market Segmentation
- Demographic segments
- Geographic segments (focus on ASEAN-6: Malaysia, Singapore, Indonesia, Thailand, Philippines, Vietnam)
- Behavioral segments
- Psychographic segments

#### Competitive Landscape
- Market share analysis
- Porter's Five Forces analysis
- Competitive positioning map
- Key competitive moves and strategies

#### Customer Analysis
- Target customer profile (persona)
- Buying behavior and decision process
- Customer pain points and unmet needs
- Willingness to pay analysis

#### Market Entry Strategy (if applicable)
- Entry mode selection
- Timing and phasing
- Resource requirements
- Risk assessment

### Data Sources to Reference
- Department of Statistics Malaysia (DOSM)
- World Bank data
- IMF economic forecasts
- Industry-specific reports (e.g., MDEC for tech, Bank Negara for finance)
- ASEAN Statistics Division

### Output Format
- Executive summary with key findings
- Detailed analysis sections
- Data tables and charts
- Recommendations and next steps
- Confidence level and data quality assessment

## Guidelines
- Always specify the geographic scope
- Use RM for Malaysian market sizing
- Note data currency and reliability
- Distinguish between primary and secondary research
- Include confidence intervals where possible`,
    triggerPhrase: '/market-analysis',
    tags: ['market', 'research', 'competition', 'ASEAN'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'Financial Forecast',
    slug: 'financial-forecast',
    description: 'Generates detailed financial projections including revenue models, cash flow forecasts, P&L statements, and break-even analysis in Malaysian Ringgit.',
    version: '1.0.0',
    category: 'financial',
    content: `# Financial Forecast Skill

## Purpose
Generate detailed, realistic financial projections for ASEAN SMEs, including revenue models, expense forecasts, cash flow statements, and key financial metrics.

## Instructions

### Revenue Model
1. **Revenue Streams**: Identify all revenue sources (product sales, services, subscriptions, etc.)
2. **Pricing Strategy**: Detail pricing tiers in RM
3. **Growth Assumptions**: Document growth rate assumptions with justification
4. **Churn & Retention**: Model customer churn and retention rates

### Financial Statements

#### Profit & Loss (Income Statement)
- Monthly for Year 1, Quarterly for Years 2-3, Annual for Years 4-5
- Revenue breakdown by stream
- COGS and gross margin
- Operating expenses by category
- EBITDA and net income

#### Cash Flow Statement
- Operating cash flow
- Investing cash flow
- Financing cash flow
- Monthly cash balance (Year 1 critical)

#### Balance Sheet
- Assets (current and non-current)
- Liabilities (current and non-current)
- Shareholders' equity
- Working capital analysis

### Key Metrics to Calculate
- **Burn Rate**: Monthly cash consumption
- **Runway**: Months before cash runs out at current burn rate
- **Break-even Point**: When cumulative cash flow turns positive
- **DSCR**: Debt Service Coverage Ratio (minimum 1.25x for bank loans)
- **Unit Economics**: CAC, LTV, LTV/CAC ratio, payback period
- **Margins**: Gross margin, operating margin, net margin
- **ROE & ROA**: Return on equity and assets

### Sensitivity Analysis
- Best case / Base case / Worst case scenarios
- Key variable impact (price, volume, costs)
- What-if scenarios (e.g., 20% cost increase, 30% revenue delay)

### Assumptions Template
Document all assumptions clearly:
- Revenue growth rate: ___% MoM
- Gross margin: ___%
- Operating expense ratio: ___% of revenue
- Customer acquisition cost: RM___
- Average revenue per user: RM___/month
- Churn rate: ___% monthly

## Guidelines
- All figures in Malaysian Ringgit (RM)
- Use realistic benchmarks for ASEAN SMEs
- Flag any assumptions that seem unrealistic
- Include footnotes explaining calculation methodology
- Reference Bank Negara Malaysia rates and economic data
- Consider SST (Sales and Service Tax) implications`,
    triggerPhrase: '/financial-forecast',
    tags: ['finance', 'forecasting', 'cash-flow', 'projections'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'SWOT Analysis',
    slug: 'swot',
    description: 'Creates comprehensive SWOT analysis with strategic recommendations, competitive positioning, and action planning.',
    version: '1.0.0',
    category: 'business',
    content: `# SWOT Analysis Skill

## Purpose
Generate thorough SWOT (Strengths, Weaknesses, Opportunities, Threats) analyses with strategic action plans for ASEAN SMEs.

## Instructions

### Internal Assessment

#### Strengths
- Core competencies and unique capabilities
- Proprietary technology or IP
- Team expertise and experience
- Financial resources and position
- Customer relationships and brand equity
- Operational efficiencies

#### Weaknesses
- Resource constraints (capital, talent, technology)
- Operational gaps
- Market position limitations
- Dependency risks (single customer, supplier, etc.)
- Skill gaps in the team
- Scalability challenges

### External Assessment

#### Opportunities
- Market growth trends (ASEAN focus)
- Regulatory changes that favor the business
- Technology enablers
- Partnership and collaboration potential
- Underserved market segments
- Government incentives (MIDA, MDEC, TERAJU)

#### Threats
- Competitive pressures
- Market disruption risks
- Regulatory risks (compliance burden)
- Economic downturns and currency risks
- Technology obsolescence
- Supply chain vulnerabilities

### Strategic Matrix Analysis

Create strategic recommendations using TOWS matrix:

1. **SO Strategies** (Strengths × Opportunities): Use strengths to exploit opportunities
2. **WO Strategies** (Weaknesses × Opportunities): Overcome weaknesses to pursue opportunities
3. **ST Strategies** (Strengths × Threats): Use strengths to counter threats
4. **WT Strategies** (Weaknesses × Threats): Minimize weaknesses and avoid threats

### Action Plan
For each strategic recommendation:
- Priority level (High/Medium/Low)
- Timeline (Immediate/Short-term/Medium-term/Long-term)
- Resource requirements
- Key performance indicators
- Risk mitigation measures

## Guidelines
- Be specific, not generic — avoid vague statements
- Quantify where possible (market sizes, percentages, RM amounts)
- Consider ASEAN market dynamics
- Include both current and forward-looking analysis
- Prioritize items by impact and likelihood`,
    triggerPhrase: '/swot',
    tags: ['strategy', 'analysis', 'SWOT', 'planning'],
    source: 'bundled',
    autoLearn: false,
  },
  {
    name: 'Idea Validation',
    slug: 'validate-idea',
    description: 'Validates business ideas through systematic evaluation of market viability, feasibility, financial potential, and competitive positioning.',
    version: '1.0.0',
    category: 'business',
    content: `# Idea Validation Skill

## Purpose
Systematically evaluate business ideas to determine their viability before significant resource investment. Brutally honest assessment — better to kill a bad idea early.

## Instructions

### Evaluation Framework

#### 1. Problem Validation (Score: 0-100)
- Is the problem real and significant?
- How many people have this problem?
- How painful is the problem? (must-have vs nice-to-have)
- Are people currently paying to solve this problem?
- Can you find evidence of the problem online (forums, reviews, complaints)?

#### 2. Solution Feasibility (Score: 0-100)
- Can you build this with available resources?
- What is the technical complexity?
- Are there regulatory barriers?
- What is the time-to-MVP?
- Can you deliver the core value proposition simply?

#### 3. Market Viability (Score: 0-100)
- Market size (TAM/SAM/SOM) in RM
- Market growth rate
- Market timing (too early, right time, too late?)
- Geographic focus feasibility (ASEAN)
- Market accessibility (distribution, marketing channels)

#### 4. Revenue Potential (Score: 0-100)
- Willingness to pay analysis
- Revenue model viability
- Unit economics potential (LTV vs CAC)
- Pricing benchmark against alternatives
- Path to profitability timeline

#### 5. Competitive Position (Score: 0-100)
- Competitive landscape assessment
- Differentiation strength
- Barriers to entry you can create
- Incumbent response risk
- Blue ocean vs red ocean assessment

### Risk Assessment
- **Red Flags**: Deal-breaking issues that should stop the idea
- **Yellow Flags**: Significant risks that need mitigation
- **Green Flags**: Positive indicators that validate the idea

### Scoring & Verdict
- **90-100**: Strong green light — proceed with confidence
- **70-89**: Conditional green — proceed with specific mitigations
- **50-69**: Yellow light — significant pivots or validation needed
- **30-49**: Red light — major issues, consider pivoting
- **0-29**: Strong red light — recommend killing the idea

### Benchmark Comparison
Compare against industry standards:
- Typical success rates for similar ventures
- Average time-to-revenue for the category
- Typical CAC and LTV benchmarks for the sector
- ASEAN market penetration benchmarks

## Guidelines
- Be brutally honest — optimism bias kills startups
- If you don't have enough data, say so explicitly
- Always suggest the cheapest/fastest way to validate remaining assumptions
- Reference ASEAN-specific market data where possible
- Consider cultural factors unique to ASEAN markets`,
    triggerPhrase: '/validate-idea',
    tags: ['validation', 'idea', 'assessment', 'startups'],
    source: 'bundled',
    autoLearn: true,
  },
  {
    name: 'Plan Review',
    slug: 'plan-review',
    description: 'Reviews business plans like a lender or investor, identifying discrepancies, scoring narrative and financial consistency, and providing actionable recommendations.',
    version: '1.0.0',
    category: 'business',
    content: `# Plan Review Skill

## Purpose
Review business plans through the lens of a lender, investor, or grant officer. Identify inconsistencies between narrative claims and financial reality, and provide actionable recommendations.

## Instructions

### Reviewer Personas

#### Bank Loan Officer
- Focus: Cash flow stability, collateral, DSCR (minimum 1.25x)
- Key concern: Can they repay the loan?
- Compliance: BNM lending guidelines, CCRIS/CTOS considerations
- Preferred: Steady revenue, strong cash flow, tangible assets

#### Venture Capitalist
- Focus: Market size, growth rate, team quality, scalability
- Key concern: Can this be a 10x return?
- Preferred: Large TAM, strong MoM growth, defensible moat
- Red flags: Small market, slow growth, no competitive advantage

#### Grant Officer
- Focus: Social impact, community benefit, feasibility
- Key concern: Will this create meaningful impact?
- Preferred: Clear impact metrics, sustainable model, community engagement
- Red flags: Purely commercial with no social benefit, unrealistic impact claims

### Review Structure

#### Narrative Score (0-100)
- Problem statement clarity
- Solution articulation
- Market understanding
- Competitive awareness
- Team credibility
- Vision and strategy coherence

#### Financial Score (0-100)
- Revenue projection realism
- Expense thoroughness
- Cash flow management
- Break-even analysis quality
- Key ratio health (DSCR, margins, runway)
- Assumption reasonableness

#### Consistency Score (0-100)
- Narrative vs financial alignment
- Market size vs revenue projections
- Team claims vs financial requests
- Timeline feasibility vs milestones
- Growth claims vs marketing budget

#### Overall Score (0-100)
Weighted average: Narrative (30%) + Financial (40%) + Consistency (30%)

### Discrepancy Detection
Flag specific issues:
- **Critical**: Could sink the application (e.g., DSCR below 1.0)
- **Warning**: Needs explanation or adjustment (e.g., revenue growth >50% without justification)
- **Info**: Minor improvements (e.g., formatting, missing detail)

### Recommendations
For each recommendation:
- Priority (High/Medium/Low)
- Category (Narrative, Financial, Consistency, Presentation)
- Specific action item
- Expected impact of addressing it

## Guidelines
- Score against the appropriate persona's criteria
- Be specific with feedback — "unclear" is not helpful, explain why
- Provide before/after examples where possible
- Reference Malaysian banking norms (e.g., typical DSCR requirements)
- Include a "Quick Wins" section for easy improvements`,
    triggerPhrase: '/plan-review',
    tags: ['review', 'lender', 'investor', 'audit'],
    source: 'bundled',
    autoLearn: false,
  },
];

async function seedSkills() {
  console.log('🌱 Seeding bundled skills...');

  // Ensure org exists
  let org = await db.organization.findFirst({ where: { id: ORG_ID } });
  if (!org) {
    org = await db.organization.create({
      data: {
        id: ORG_ID,
        name: 'GangNiaga Default',
        slug: 'default',
      },
    });
    console.log('✅ Created default organization');
  }

  let created = 0;
  let skipped = 0;

  for (const skillData of BUNDLED_SKILLS) {
    const existing = await db.skill.findFirst({
      where: { slug: skillData.slug, organizationId: ORG_ID },
    });

    if (existing) {
      console.log(`⏭️  Skill "${skillData.name}" already exists, skipping`);
      skipped++;
      continue;
    }

    await db.skill.create({
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

    console.log(`✅ Created skill "${skillData.name}" (${skillData.triggerPhrase})`);
    created++;
  }

  console.log(`\n📊 Seed complete: ${created} created, ${skipped} skipped`);
}

seedSkills()
  .catch(console.error)
  .finally(() => db.$disconnect());
