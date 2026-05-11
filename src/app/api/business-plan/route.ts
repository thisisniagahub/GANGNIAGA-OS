import { NextRequest, NextResponse } from 'next/server';
import { getZAI } from '@/lib/zai';

const PROPOSAL_TYPE_CONTEXT: Record<string, string> = {
  bank_loan: 'This is for a bank loan application. Emphasize: cash flow stability, DSCR (Debt Service Coverage Ratio), repayment capacity, collateral, financial prudence, and risk mitigation. Use conservative projections and highlight financial discipline.',
  government_grant: 'This is for a government grant application. Emphasize: social impact, Bumiputera empowerment agenda, job creation, innovation, community development, and alignment with national economic goals (Malaysia context). Include specific impact metrics.',
  angel_investor: 'This is for an angel investor pitch. Emphasize: founding team expertise, vision, early traction, market timing, product-market fit signals, and 10x growth potential. Be bold but credible.',
  venture_capital: 'This is for a VC pitch. Emphasize: massive market size (TAM/SAM/SOM), growth velocity, scalability, technology moat, unit economics improvement, and path to market dominance. Use data-driven arguments.',
  sme_financing: 'This is for SME financing. Emphasize: revenue stability, proven business fundamentals, manageable risk profile, steady cash flow, and clear path to profitability. Be practical and grounded.',
  corporate_partnership: 'This is for a corporate partnership proposal. Emphasize: mutual value creation, strategic alignment, integration potential, complementary capabilities, and long-term partnership benefits.',
};

const SECTION_PROMPTS: Record<string, string> = {
  coverPage: `Write a professional cover page for a business proposal. Include: company name, proposal title, loan/investment amount, date prepared, company registration number, and a one-line tagline. Format with clear headers and spacing.`,
  
  executiveSummary: `Write a compelling executive summary. This is the most critical section — investors decide in 2-5 minutes. Include: the core problem, the solution, market opportunity, competitive advantage, key financial highlights (revenue, growth rate, margins), and the ask. Keep it punchy and data-rich. 2-3 paragraphs maximum.`,
  
  companyOverview: `Write a comprehensive company overview. Include: founding story, legal structure (Sdn Bhd for Malaysia), registration details, ownership breakdown with percentages, mission statement, vision statement, and key milestones achieved with dates. Format with clear sub-headers.`,
  
  problemStatement: `Write a powerful problem statement. Start with a bold data-backed headline. Then detail 4-6 specific pain points with data. Include: market inefficiency, cost of inaction, who suffers most, and why current solutions fail. Use specific statistics and numbers. End with the cost of NOT solving this problem.`,
  
  solutionProduct: `Write a solution/product section. Describe the product clearly with: core capabilities (5-7 bullet points), key differentiators vs. alternatives, unique value proposition, and "why now" timing. Include a feature comparison if relevant. Be specific — avoid generic marketing language.`,
  
  marketAnalysis: `Write a detailed market analysis. Must include: TAM (Total Addressable Market), SAM (Serviceable Available Market), SOM (Serviceable Obtainable Market) with specific dollar figures. Add market drivers (3-4 trends), target customer segments with characteristics, and geographic focus. Use real market data and cite sources where possible.`,
  
  industryResearch: `Write an industry research section. Cover: current industry size and growth rate, key industry trends (3-5), regulatory environment, technology adoption rates, industry challenges, and 3-5 year outlook. Focus on the Southeast Asian / ASEAN context.`,
  
  competitorAnalysis: `Write a competitor analysis. Identify 3-5 competitors (direct and indirect). For each: name, strengths, weaknesses, approximate market share, and pricing model. Then describe your competitive moat — what makes you uniquely hard to copy. Format as structured analysis, not just prose.`,
  
  businessModel: `Write a business model section. Describe: how the company creates value, revenue model (subscription, usage, services, marketplace), pricing tiers with amounts, customer acquisition strategy, and retention mechanics. Include a brief business model canvas-style summary.`,
  
  revenueStreams: `Write a revenue streams section. Detail each revenue stream with: name, description, pricing, current monthly revenue, and percentage of total. Include unit economics: LTV (Life Time Value), CAC (Customer Acquisition Cost), LTV:CAC ratio, and payback period. Use specific numbers.`,
  
  goToMarketStrategy: `Write a go-to-market strategy. Include: customer acquisition channels (4-5) with budget allocation percentages, partnership strategy, product-led growth tactics, sales approach, and 90-day launch plan. Be specific about channels and expected conversion rates.`,
  
  operationsPlan: `Write an operations plan. Cover: current team size and breakdown by function, scaling plan with hiring timeline (quarterly), operational processes, key vendor relationships, infrastructure requirements, and compliance/quality measures. Include a 12-month operational roadmap.`,
  
  technologySystem: `Write a technology/system section. Cover: technology stack (frontend, backend, AI, infrastructure), system architecture overview, AI/ML capabilities, security measures (encryption, compliance, data protection), scalability approach, and technical roadmap. Be specific about tools and frameworks.`,
  
  managementTeam: `Write a management team section. For each key leader: name, role, years of experience, previous companies/roles, relevant achievements, and current responsibilities. Include advisory board members with credentials. End with key hires needed and why.`,
  
  financialForecast: `Write a financial forecast section — this is CRITICAL for bank loans. Include: 3-year revenue projections with specific numbers, expense breakdown, gross margin trajectory, EBITDA margin, net income, break-even timeline, and DSCR calculation. Format with clear year-by-year tables or structured data. Include monthly burn rate and runway.`,
  
  fundingRequirement: `Write a funding requirement section. State the exact amount needed, type of funding (loan/equity/grant), tenure/terms if loan, purpose of funds, why this specific amount, what it unlocks, and how it extends runway. Include repayment capability analysis for debt financing.`,
  
  useOfFunds: `Write a use of funds section. Break down the total amount into 4-6 categories with: category name, amount, percentage, and detailed description of what it covers. Include a summary table. Make sure percentages add up to 100%.`,
  
  riskAnalysis: `Write a risk analysis section. Cover 5-6 risk categories: market risk, financial risk, operational risk, technology/AI risk, cybersecurity risk, and competitive risk. For each: describe the risk, rate probability (High/Medium/Low), rate impact (High/Medium/Low), and provide specific mitigation strategies. Be honest and credible.`,
  
  swotAnalysis: `Write a SWOT analysis. Cover each quadrant with 4-6 specific, actionable points. Strengths: what you do uniquely well. Weaknesses: honest internal gaps. Opportunities: external trends you can exploit. Threats: external risks you must navigate. Be specific, not generic.`,
  
  exitStrategy: `Write an exit strategy section. Describe 2-3 potential exit scenarios: strategic acquisition (most likely acquirers, expected timeline, valuation range), IPO path (requirements, timeline), and secondary sale option. Include investment moat protection — what makes this valuable to an acquirer.`,
  
  appendices: `Write an appendices section. List 8-10 supporting documents that would be included: financial statements, customer testimonials, technical architecture, registration documents, team resumes, market research sources, partnership agreements, product roadmap, IP filings, and compliance certifications. For each, provide a brief description.`,
};

export async function POST(request: NextRequest) {
  try {
    const { title, industry, section, proposalType } = await request.json();

    const zai = await getZAI();

    const typeContext = PROPOSAL_TYPE_CONTEXT[proposalType] || PROPOSAL_TYPE_CONTEXT.bank_loan;
    const sectionPrompt = SECTION_PROMPTS[section] || `Generate professional content for the "${section}" section of a business proposal titled "${title}" in the ${industry} industry. Make it data-rich, specific, and actionable.`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are a professional business plan writer and strategic consultant specializing in Southeast Asian markets. You write clear, compelling, and data-rich content for business proposals. Use professional formatting with **bold** headers and bullet points where appropriate. Always include specific numbers and data points. ${typeContext}`,
        },
        {
          role: 'user',
          content: `Write the "${section}" section for a business proposal titled "${title}" in the ${industry} industry.\n\n${sectionPrompt}`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Business plan generation error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
