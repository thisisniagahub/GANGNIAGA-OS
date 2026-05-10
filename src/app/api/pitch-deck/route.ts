import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

const TEMPLATE_CONTEXT: Record<string, string> = {
  investor: 'This is a VC/angel investor pitch deck. Emphasize: massive market opportunity, growth velocity, scalability, technology moat, unit economics, team strength, and 10x return potential. Use bold projections and highlight the "why now" urgency.',
  bank: 'This is a bank loan pitch deck. Emphasize: stable cash flow, DSCR above 1.25x, repayment capacity, collateral coverage, conservative financial projections, risk mitigation, and financial discipline. Be credible and grounded.',
  grant: 'This is a government grant pitch deck. Emphasize: social impact, community development, job creation, innovation, alignment with national economic goals, Bumiputera empowerment (if Malaysia), measurable outcomes, and sustainability.',
};

const SLIDE_TYPE_CONTEXT: Record<string, string> = {
  title: 'Create a powerful title slide with company name, tagline, and funding ask.',
  problem: 'Clearly articulate the pain point with specific data. Make the audience feel the problem.',
  solution: 'Present the solution with conviction. Show how it directly addresses the problem. Include key features.',
  market: 'Show TAM, SAM, SOM with specific numbers. Demonstrate market timing and growth trends.',
  business_model: 'Explain how the company makes money. Include pricing, unit economics, and revenue breakdown.',
  financials: 'Present 3-year financial projections with specific numbers. Include revenue, expenses, margins, and key metrics.',
  team: 'Highlight the founding team\'s relevant experience, past successes, and why they\'re uniquely positioned.',
  ask: 'State the funding ask clearly. Break down use of funds. Show what milestones the funding enables.',
  appendix: 'Provide supporting data, charts, or details that reinforce the main deck.',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, templateType, planId, action, deckId } = body;
    const zai = await getZAI();

    const templateContext = TEMPLATE_CONTEXT[templateType] || TEMPLATE_CONTEXT.investor;

    // Generate anticipated questions
    if (action === 'generate_questions') {
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content: `You are an experienced investor, bank loan officer, and grant reviewer. You analyze pitch decks and predict the specific, tough questions that funders will ask. You provide category tags, difficulty ratings, and suggested answer frameworks. ${templateContext}`,
          },
          {
            role: 'user',
            content: `Analyze this pitch deck titled "${title}" and generate 5 specific questions that ${templateType === 'investor' ? 'VCs and angel investors' : templateType === 'bank' ? 'bank loan officers' : 'grant reviewers'} are likely to ask. For each question provide: the question itself, a category (Financial, Competitive, Market, Team, Operations, or Risk), a suggested answer framework, and difficulty (easy/medium/hard). Return as JSON array with fields: id, question, category, suggestedAnswer, difficulty.`,
          },
        ],
        thinking: { type: 'disabled' },
      });

      const content = completion.choices?.[0]?.message?.content;

      if (!content) {
        return NextResponse.json({ error: 'No questions generated' }, { status: 500 });
      }

      try {
        // Try to parse JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ anticipatedQuestions: questions });
        }
      } catch {
        // If JSON parsing fails, create structured questions from the text
      }

      // Fallback: return mock questions based on template type
      const fallbackQuestions = templateType === 'bank'
        ? [
            { id: 'fq1', question: 'What is your current DSCR and how does it change under stress scenarios?', category: 'Financial', suggestedAnswer: 'Our current DSCR is 1.45x. Under a 30% revenue decline stress test, DSCR remains above 1.0x due to our low fixed-cost structure and ability to implement cost-cutting measures within 30 days.', difficulty: 'hard' },
            { id: 'fq2', question: 'What collateral secures this loan?', category: 'Collateral', suggestedAnswer: 'We offer our intellectual property portfolio, equipment and infrastructure deposits, personal guarantees from the CEO and CTO, and the company\'s receivables portfolio as collateral.', difficulty: 'hard' },
            { id: 'fq3', question: 'How will you use the loan proceeds specifically?', category: 'Use of Funds', suggestedAnswer: '37.5% for product development, 25% for market expansion, 17.5% for sales and marketing, 12.5% for operations infrastructure, and 7.5% for working capital buffer. Each category has detailed line-item budgets available.', difficulty: 'easy' },
          ]
        : templateType === 'grant'
        ? [
            { id: 'fq1', question: 'How will this project benefit the local community?', category: 'Impact', suggestedAnswer: 'Our platform will enable 500+ local SMEs to digitize operations within 12 months, creating an estimated 50 indirect jobs and improving SME survival rates by 25% in the target community.', difficulty: 'easy' },
            { id: 'fq2', question: 'How do you measure and report social impact?', category: 'Measurement', suggestedAnswer: 'We track KPIs including: number of SMEs onboarded, jobs created/supported, revenue increase for beneficiary businesses, and digital literacy improvement. Quarterly impact reports with verifiable data.', difficulty: 'medium' },
            { id: 'fq3', question: 'What happens after the grant period ends?', category: 'Sustainability', suggestedAnswer: 'Our SaaS model ensures self-sustainability. Grant funding accelerates initial rollout; recurring subscription revenue sustains operations post-grant. We project break-even within 18 months.', difficulty: 'hard' },
          ]
        : [
            { id: 'fq1', question: 'What\'s your moat against well-funded competitors?', category: 'Competitive', suggestedAnswer: 'Our moat is three-fold: (1) proprietary AI memory engine trained on ASEAN business data, (2) 18-month head start in multi-agent autonomous execution, and (3) deep localization that global players won\'t replicate.', difficulty: 'medium' },
            { id: 'fq2', question: 'What are your unit economics and path to profitability?', category: 'Financial', suggestedAnswer: 'LTV:CAC ratio of 7.5:1, gross margin of 82%, and payback period of 4.2 months. We project profitability by Q3 2025 with current growth trajectory and controlled burn rate.', difficulty: 'medium' },
            { id: 'fq3', question: 'Why is now the right time for this?', category: 'Market', suggestedAnswer: 'Three converging trends: AI adoption in SEA growing at 28% CAGR, post-COVID SME digitalization wave, and increasing bank requirements for business planning software. Our timing is optimal.', difficulty: 'easy' },
          ];

      return NextResponse.json({ anticipatedQuestions: fallbackQuestions });
    }

    // Generate full deck slides
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are a professional pitch deck designer and strategic consultant. You create compelling, data-rich presentation slides. ${templateContext}`,
        },
        {
          role: 'user',
          content: `Generate a professional pitch deck for "${title}". Template type: ${templateType}. Create 7-8 slides covering: title, problem, solution, market opportunity, business model, financials, the ask, and one template-specific slide. For each slide, provide: title, type (one of: title, problem, solution, market, business_model, financials, team, ask, appendix), content text, and relevant data points as key-value pairs. Return as JSON array of objects with fields: id, order, title, type, content, dataPoints (object), linkedSection (string). Make the content compelling and data-rich.`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const slides = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ slides, anticipatedQuestions: [] });
      }
    } catch {
      // JSON parse failed, return default slides
    }

    // Fallback: return default generated slides
    const defaultSlides = [
      { id: `gs-${Date.now()}-1`, order: 1, title: title || 'Your Company', type: 'title', content: 'Tagline / One-Liner\nFunding Round / Loan Request\nDate', linkedSection: 'coverPage', dataPoints: {} },
      { id: `gs-${Date.now()}-2`, order: 2, title: 'The Problem', type: 'problem', content: 'What pain point exists?\nHow big is the problem?\nWho is affected and what does it cost them?', linkedSection: 'problemStatement', dataPoints: { 'Market affected': '70%', 'Annual cost': 'RM2.4B' } },
      { id: `gs-${Date.now()}-3`, order: 3, title: 'Our Solution', type: 'solution', content: 'How does your product solve the problem?\nKey features and benefits\nWhy now?', linkedSection: 'solutionProduct', dataPoints: {} },
      { id: `gs-${Date.now()}-4`, order: 4, title: 'Market Opportunity', type: 'market', content: 'TAM, SAM, SOM breakdown\nMarket trends and timing\nGrowth trajectory', linkedSection: 'marketAnalysis', dataPoints: { 'TAM': 'USD12.4B', 'SAM': 'USD3.8B', 'SOM': 'USD190M' } },
      { id: `gs-${Date.now()}-5`, order: 5, title: 'Business Model', type: 'business_model', content: 'Revenue model\nPricing strategy\nUnit economics', linkedSection: 'businessModel', dataPoints: { 'LTV:CAC': '7.5:1', 'Gross Margin': '82%' } },
      { id: `gs-${Date.now()}-6`, order: 6, title: 'Financial Projections', type: 'financials', content: '3-year revenue forecast\nKey financial metrics\nBreak-even timeline', linkedSection: 'financialForecast', dataPoints: { 'Year 1': 'RM8.9M', 'Year 2': 'RM22.4M', 'Year 3': 'RM56.2M' } },
      { id: `gs-${Date.now()}-7`, order: 7, title: 'The Ask', type: 'ask', content: 'How much are you raising?\nUse of funds breakdown\nExpected outcomes and milestones', linkedSection: 'fundingRequirement', dataPoints: { 'Amount': 'RM2M', 'Tenure': '5 years' } },
    ];

    return NextResponse.json({ slides: defaultSlides, anticipatedQuestions: [] });
  } catch (error) {
    console.error('Pitch deck generation error:', error);
    return NextResponse.json({ error: 'Failed to generate pitch deck' }, { status: 500 });
  }
}
