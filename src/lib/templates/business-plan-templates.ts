export interface BusinessPlanSection {
  title: string;
  description: string;
  prompts: string[];
  placeholder: string;
}

export interface BusinessPlanTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  industry: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  sections: BusinessPlanSection[];
}

export const businessPlanTemplates: BusinessPlanTemplate[] = [
  {
    id: 'nasi-lemak-stall',
    name: 'Nasi Lemak Stall / Food Business',
    description: 'Complete business plan for starting a Nasi Lemak stall or Malaysian food business with local market insights, SSM registration, and halal compliance.',
    category: 'Food & Beverage',
    icon: 'ChefHat',
    industry: 'F&B',
    difficulty: 'beginner',
    estimatedTime: '2-3 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your Nasi Lemak business concept',
        prompts: ['What is your unique Nasi Lemak recipe or concept?', 'What is your target daily revenue in MYR?', 'Where will your stall be located?'],
        placeholder: 'A traditional yet innovative Nasi Lemak stall serving authentic Malaysian breakfast with a modern twist. Target revenue of RM500-1,000 daily within the first 6 months of operation in Klang Valley.'
      },
      {
        title: 'Company Description',
        description: 'Business registration and structure',
        prompts: ['Have you registered with SSM?', 'Will you operate as sole proprietorship or Sdn Bhd?', 'Do you plan to get halal certification from JAKIM?'],
        placeholder: 'Registered with SSM as Enterprise. Planning to obtain JAKIM Halal certification within 3 months. Operating from a strategic location near LRT/MRT stations for morning commuter traffic.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian F&B market and competitor analysis',
        prompts: ['Who are your direct competitors within 2km radius?', 'What is the average spending on breakfast in Malaysia?', 'How will you differentiate from existing stalls?'],
        placeholder: 'Malaysian F&B market worth RM150+ billion annually. Breakfast segment accounts for 30% of daily food spending. Average Malaysian spends RM5-15 on breakfast. Nasi Lemak remains #1 breakfast choice across all demographics.'
      },
      {
        title: 'Products & Services',
        description: 'Your menu and offerings',
        prompts: ['What varieties of Nasi Lemak will you offer?', 'Will you offer catering or delivery via GrabFood/Foodpanda?', 'What complementary dishes will you serve?'],
        placeholder: 'Core menu: Nasi Lemak Original (RM5), Nasi Lemak Special with Ayam Goreng (RM8), Nasi Lemak Daging (RM10). Add-ons: Teh Tarik, Kopi O, Roti Bakar. Delivery available via GrabFood and Foodpanda.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'How to attract and retain customers',
        prompts: ['Will you use social media marketing (TikTok, Instagram)?', 'Do you plan corporate catering for offices?', 'What loyalty programs will you implement?'],
        placeholder: 'Social media marketing on TikTok and Instagram targeting local foodies. Partnerships with nearby offices for corporate breakfast packages. Stamp card loyalty program - buy 10 get 1 free. Ramadan special sets for buka puasa.'
      },
      {
        title: 'Operations Plan',
        description: 'Daily operations and supply chain',
        prompts: ['What are your operating hours?', 'Where will you source fresh ingredients?', 'How many staff do you need?'],
        placeholder: 'Operating hours: 5:30 AM - 12:00 PM (breakfast focus). Ingredients sourced from Pasar Borong Selayang daily. 2 cooks, 1 cashier, 1 delivery rider. Kitchen prep starts at 4:00 AM.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your startup capital requirement?', 'What are your monthly operating costs?', 'When do you expect to break even?'],
        placeholder: 'Startup capital: RM15,000-25,000 (equipment, deposit, initial inventory). Monthly operating cost: RM8,000-12,000. Break-even target: Month 3-4. Projected annual revenue: RM180,000-300,000.'
      },
      {
        title: 'Risk Analysis',
        description: 'Potential risks and mitigation strategies',
        prompts: ['What happens if ingredient prices increase?', 'How will you handle food safety compliance?', 'What is your contingency for low sales periods?'],
        placeholder: 'Key risks: ingredient price fluctuation (mitigate with bulk purchasing), food safety (MOH compliance and regular inspections), competition (differentiate through quality and consistency), seasonal variation (expand menu for Ramadan and festive seasons).'
      },
      {
        title: 'Team & Management',
        description: 'Key personnel and roles',
        prompts: ['Who will manage daily operations?', 'Do you have F&B experience?', 'Will you hire part-time or full-time staff?'],
        placeholder: 'Owner-operator with 5+ years F&B experience. Head cook specializing in traditional Malay cuisine. 2 part-time assistants for peak hours. Plan to train and promote reliable staff.'
      }
    ]
  },
  {
    id: 'ecommerce-online-store',
    name: 'E-Commerce / Online Store',
    description: 'Business plan for Shopee/Lazada sellers or independent e-commerce operations targeting Malaysian consumers.',
    category: 'E-Commerce',
    icon: 'ShoppingCart',
    industry: 'Retail',
    difficulty: 'beginner',
    estimatedTime: '2-3 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your e-commerce business',
        prompts: ['What products will you sell online?', 'Which platforms will you use (Shopee, Lazada, own website)?', 'What is your target monthly revenue in MYR?'],
        placeholder: 'An e-commerce business selling [product category] on Shopee and Lazada Malaysia. Target monthly revenue of RM10,000-30,000 within 6 months. Leveraging Malaysia high internet penetration rate of 96.8%.'
      },
      {
        title: 'Company Description',
        description: 'Business structure and registration',
        prompts: ['Are you registered with SSM?', 'Will you sell locally or also export to Singapore/Brunei?', 'What is your business model - dropship, wholesale, or manufacture?'],
        placeholder: 'SSM-registered enterprise specializing in online retail. Business model: wholesale sourcing with value-added packaging. Target market: Malaysian consumers aged 18-45 in Peninsular and East Malaysia.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian e-commerce landscape',
        prompts: ['What is your product category market size on Shopee/Lazada?', 'Who are the top sellers in your category?', 'What consumer trends favor your business?'],
        placeholder: 'Malaysia e-commerce market projected to reach RM60+ billion by 2025. Shopee leads with 55% market share, Lazada at 30%. Mobile commerce accounts for 70% of transactions. Popular categories: fashion, electronics, health & beauty.'
      },
      {
        title: 'Products & Services',
        description: 'Product catalog and offerings',
        prompts: ['What is your product range and pricing strategy?', 'Do you offer free shipping or same-day delivery?', 'What is your return/refund policy?'],
        placeholder: 'Core products: [Product list]. Price range: RM15-150. Free shipping for orders above RM50. Same-day delivery available in Klang Valley via PosLaju and J&T Express. 7-day return policy for defective items.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'How to drive traffic and conversions',
        prompts: ['Will you run Shopee/Lazada ads?', 'How will you leverage 11.11, 12.12 and other mega sales?', 'Will you use influencer marketing or live selling?'],
        placeholder: 'Platform advertising (Shopee Ads, Lazada Sponsored Solutions). Mega sales participation (11.11, 12.12, Chinese New Year, Hari Raya). Live selling sessions 3x weekly. KOL partnerships for product reviews. Voucher and bundle deals.'
      },
      {
        title: 'Operations Plan',
        description: 'Order fulfillment and logistics',
        prompts: ['Where is your warehouse/storage located?', 'Which courier partners will you use?', 'How will you handle customer service?'],
        placeholder: 'Home-based storage initially, scaling to small warehouse in Klang Valley. Courier partners: J&T Express, PosLaju, Ninjavan. Customer service via platform chat and WhatsApp Business. Target: ship within 24 hours of order.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your startup capital?', 'What are your product margins?', 'What platform fees do you expect?'],
        placeholder: 'Startup capital: RM5,000-15,000. Product margin: 30-50%. Platform fees: 2-4% commission + payment processing. Monthly operating cost: RM3,000-8,000. Break-even: Month 2-3. Projected annual revenue: RM120,000-360,000.'
      },
      {
        title: 'Risk Analysis',
        description: 'E-commerce specific risks',
        prompts: ['How will you handle counterfeit competition?', 'What is your plan for platform policy changes?', 'How will you manage cash flow during mega sales inventory buildup?'],
        placeholder: 'Key risks: platform commission increases, counterfeit competition, logistics delays, cash flow during mega sales. Mitigation: diversify across platforms, build own website, negotiate bulk shipping rates, maintain 3-month cash reserve.'
      },
      {
        title: 'Team & Management',
        description: 'Key personnel for e-commerce operations',
        prompts: ['Will you manage the store yourself initially?', 'Do you need a graphic designer for product photos?', 'Will you hire customer service staff?'],
        placeholder: 'Owner-operator handling product sourcing, listing, and marketing initially. Part-time graphic designer for product photography and design. Virtual assistant for customer service during peak periods.'
      }
    ]
  },
  {
    id: 'digital-marketing-agency',
    name: 'Digital Marketing Agency',
    description: 'Business plan for a digital marketing agency serving Malaysian SMEs with social media, SEO, and performance marketing services.',
    category: 'Marketing & Media',
    icon: 'Megaphone',
    industry: 'Services',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your digital marketing agency',
        prompts: ['What services will you offer?', 'Who is your target client profile?', 'What is your target annual revenue in MYR?'],
        placeholder: 'A full-service digital marketing agency helping Malaysian SMEs grow their online presence. Services include social media management, SEO, Google/Meta ads, and content creation. Target revenue of RM500,000 in Year 1.'
      },
      {
        title: 'Company Description',
        description: 'Agency structure and positioning',
        prompts: ['Will you register as Enterprise or Sdn Bhd?', 'What is your agency unique selling point?', 'Will you serve specific industries?'],
        placeholder: 'SSM-registered Sdn Bhd. Specializing in F&B, retail, and professional services verticals. Unique positioning: data-driven marketing with local cultural insights for multilingual campaigns (BM, English, Mandarin, Tamil).'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian digital marketing landscape',
        prompts: ['How many SMEs in Malaysia need digital marketing?', 'What is the average monthly marketing budget of Malaysian SMEs?', 'Who are the major competitors in this space?'],
        placeholder: 'Malaysia has 1.2 million SMEs, with 70% still underserved in digital marketing. Average SME marketing budget: RM2,000-10,000/month. Digital ad spend in Malaysia reached RM3.5 billion. Growing demand for performance marketing and TikTok advertising.'
      },
      {
        title: 'Products & Services',
        description: 'Service packages and pricing',
        prompts: ['What service tiers will you offer?', 'Will you provide monthly retainer or project-based pricing?', 'Do you offer performance guarantees?'],
        placeholder: 'Starter Package (RM2,500/month): Social media management + basic ads. Growth Package (RM5,000/month): Full social media + SEO + Google Ads. Enterprise Package (RM10,000+/month): Full-service with dedicated account manager. Project-based work available for one-off campaigns.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'How to acquire and retain clients',
        prompts: ['How will you generate leads?', 'Will you attend business networking events?', 'Do you offer free audits or consultations?'],
        placeholder: 'Inbound marketing through agency blog and social media. Free digital marketing audit as lead magnet. Partnerships with business chambers (MCC, DCCC, ACCIM). LinkedIn outreach to SME decision makers. Referral program: 10% commission for successful referrals.'
      },
      {
        title: 'Operations Plan',
        description: 'Agency workflows and tools',
        prompts: ['What tools will you use for project management?', 'How will you manage client reporting?', 'What is your client onboarding process?'],
        placeholder: 'Tools: Notion for project management, Canva/Figma for design, Hootsuite for social scheduling, Google Analytics for reporting. Monthly reporting cadence with KPI dashboards. Client onboarding: 2-week setup phase including audit, strategy, and content calendar.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your startup capital requirement?', 'What are your monthly fixed costs?', 'How many clients do you need to break even?'],
        placeholder: 'Startup capital: RM30,000-50,000. Monthly fixed costs: RM8,000-15,000 (rent, salaries, tools). Break-even: 5-8 retainer clients. Year 1 target: 15-20 active clients. Projected annual revenue: RM500,000-800,000.'
      },
      {
        title: 'Risk Analysis',
        description: 'Agency-specific risks',
        prompts: ['How will you handle client churn?', 'What if key team members leave?', 'How will you stay updated with platform algorithm changes?'],
        placeholder: 'Key risks: client churn (mitigate with long-term contracts and performance tracking), talent retention (competitive salary + profit sharing), platform changes (continuous training and certifications), economic downturn (diversify service offerings).'
      },
      {
        title: 'Team & Management',
        description: 'Agency team structure',
        prompts: ['What roles do you need to fill first?', 'Will you hire full-time or freelance?', 'What is your hiring strategy?'],
        placeholder: 'Founding team: 2 partners (strategy + creative). First hires: social media executive, graphic designer. Freelance pool: copywriters, videographers, web developers. Target team size by Year 2: 8-10 full-time staff.'
      }
    ]
  },
  {
    id: 'homestay-airbnb',
    name: 'Homestay / Airbnb Business',
    description: 'Business plan for a homestay or Airbnb rental business in Malaysia tourist destinations.',
    category: 'Tourism & Hospitality',
    icon: 'Home',
    industry: 'Hospitality',
    difficulty: 'beginner',
    estimatedTime: '2-3 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your homestay business',
        prompts: ['Where will your homestay be located?', 'What type of property will you use?', 'What is your target occupancy rate?'],
        placeholder: 'A curated homestay experience in [location - e.g., Genting Highlands, Langkawi, Melaka] targeting domestic tourists and international visitors. Target occupancy rate of 70%+ with average nightly rate of RM150-350.'
      },
      {
        title: 'Company Description',
        description: 'Business registration and property details',
        prompts: ['Is the property registered with local council (Majlis Perbandaran)?', 'Have you obtained the required Airbnb/homestay license?', 'Will you manage the property yourself or use a management company?'],
        placeholder: 'SSM-registered enterprise with proper homestay license from local authority. Property type: [landed/condo/villa]. Self-managed with support from cleaning and maintenance partners. Listed on Airbnb, Booking.com, and Agoda.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian tourism and short-term rental market',
        prompts: ['What is the tourism trend in your location?', 'Who are your main competitors in the area?', 'What are the peak and off-peak seasons?'],
        placeholder: 'Malaysia welcomed 26 million tourists pre-pandemic, recovering strongly. Domestic tourism accounts for 60% of hospitality spending. Short-term rental market growing 15% annually. Peak seasons: school holidays, festive periods (Raya, CNY, Deepavali), year-end.'
      },
      {
        title: 'Products & Services',
        description: 'Accommodation offerings and amenities',
        prompts: ['How many guests can your property accommodate?', 'What unique amenities do you offer?', 'Will you provide additional services like tours or transport?'],
        placeholder: 'Property accommodates 4-6 guests. Amenities: WiFi, Smart TV, kitchen, parking, pool access. Unique features: Instagram-worthy interior design, local experience guidebook, welcome hamper with local snacks. Add-on: airport transfer and local tour arrangement.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'How to attract guests and maximize bookings',
        prompts: ['Which OTA platforms will you list on?', 'How will you encourage positive reviews?', 'Will you offer long-stay discounts?'],
        placeholder: 'Listed on Airbnb, Booking.com, Agoda, and Traveloka. Professional photography and virtual tour. Social media marketing on Instagram and TikTok. Weekly-stay discount of 15%, monthly discount of 30%. Superhost target within 6 months.'
      },
      {
        title: 'Operations Plan',
        description: 'Property management and guest handling',
        prompts: ['How will you handle check-in/check-out?', 'Who will clean between guests?', 'How will you manage guest communication?'],
        placeholder: 'Self check-in via smart lock. Professional cleaning service between guests. Guest communication via Airbnb app and WhatsApp. 24/7 emergency contact. Standard operating procedures for cleaning, maintenance, and guest issues.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your property cost (rental/loan)?', 'What are your monthly operating expenses?', 'What is your expected ROI timeline?'],
        placeholder: 'Property cost: RM1,500-3,000/month (rental) or RM3,000-5,000 (mortgage). Monthly operating cost: RM800-1,500. Average nightly rate: RM200. At 70% occupancy: RM4,200/month revenue. ROI: 18-24 months for furnished setup cost of RM30,000-50,000.'
      },
      {
        title: 'Risk Analysis',
        description: 'Homestay-specific risks',
        prompts: ['How will you handle property damage by guests?', 'What if local regulations change?', 'How will you manage seasonal low demand?'],
        placeholder: 'Key risks: property damage (Airbnb AirCover + security deposit), regulation changes (monitor local council policies), seasonal variation (adjust pricing dynamically), party/damage risk (strict house rules and screening). Mitigation: comprehensive insurance, diversified booking platforms, competitive off-peak pricing.'
      },
      {
        title: 'Team & Management',
        description: 'Property management team',
        prompts: ['Will you hire a property manager?', 'Do you have reliable cleaning partners?', 'How will you handle maintenance issues?'],
        placeholder: 'Owner-operator managing bookings and guest relations. Contracted cleaning service for turnover. Handyman on call for maintenance. Considering property management company if scaling to 3+ properties.'
      }
    ]
  },
  {
    id: 'saas-startup',
    name: 'Software / SaaS Startup',
    description: 'Business plan for a SaaS startup targeting Malaysian and regional markets with MDEC and MIDA incentive considerations.',
    category: 'Technology',
    icon: 'Code2',
    industry: 'Software',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your SaaS startup',
        prompts: ['What problem does your SaaS solve?', 'Who are your target users?', 'What is your pricing model?'],
        placeholder: 'A cloud-based [solution type] SaaS platform targeting Malaysian SMEs. Solving [specific pain point] with an affordable, easy-to-use solution. Freemium model with plans starting from RM99/month.'
      },
      {
        title: 'Company Description',
        description: 'Startup structure and vision',
        prompts: ['Will you incorporate as Sdn Bhd?', 'Are you applying for MDEC status?', 'What is your long-term vision?'],
        placeholder: 'Sdn Bhd registered with plans to apply for MDEC MSC Malaysia status for tax incentives. Vision: Become the leading [category] SaaS in Southeast Asia. Currently in MVP/beta stage with early adopters.'
      },
      {
        title: 'Market Analysis',
        description: 'SaaS market in Malaysia and ASEAN',
        prompts: ['What is the TAM for your solution in Malaysia?', 'Who are the existing competitors?', 'What is the ASEAN expansion potential?'],
        placeholder: 'Malaysia SaaS market valued at USD 500M+ growing at 20% CAGR. ASEAN SaaS market projected at USD 5B by 2027. 800,000+ Malaysian SMEs are potential customers. Low current penetration rate of 15% in target segment presents massive opportunity.'
      },
      {
        title: 'Products & Services',
        description: 'SaaS features and pricing tiers',
        prompts: ['What are your core features?', 'What is your technology stack?', 'How will you handle data security and PDPA compliance?'],
        placeholder: 'Core features: [feature list]. Technology: Next.js, AWS/Azure, PostgreSQL. PDPA-compliant data handling with encryption at rest and in transit. Pricing: Free tier (limited), Starter RM99/month, Professional RM299/month, Enterprise custom pricing.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Customer acquisition strategy',
        prompts: ['How will you acquire your first 100 customers?', 'Will you use PLG (Product-Led Growth)?', 'What partnerships will you pursue?'],
        placeholder: 'Product-led growth with free trial. Content marketing and SEO for organic acquisition. Partnerships with accounting firms and business consultants. MDEC and MAGIC programs for startup visibility. Target: 500 paying customers within 18 months.'
      },
      {
        title: 'Operations Plan',
        description: 'Technical operations and scaling',
        prompts: ['What is your deployment strategy?', 'How will you handle customer support?', 'What is your SLA?'],
        placeholder: 'Cloud-native architecture on AWS/Azure. CI/CD pipeline for rapid deployment. Customer support via chat and email with 4-hour response SLA. 99.9% uptime target. Monthly feature release cycle.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue model and fundraising',
        prompts: ['What is your monthly burn rate?', 'Are you seeking venture capital?', 'What is your path to profitability?'],
        placeholder: 'Pre-revenue stage seeking RM500K-1M seed funding. Monthly burn rate: RM30,000-50,000. Revenue target: RM100K ARR by Month 12, RM500K ARR by Month 24. Path to profitability by Month 30. Potential investors: Cradle Fund, 500 Global, local VCs.'
      },
      {
        title: 'Risk Analysis',
        description: 'Startup risks and mitigation',
        prompts: ['What if a well-funded competitor enters your space?', 'How will you handle technical debt?', 'What is your plan if fundraising fails?'],
        placeholder: 'Key risks: competition from funded startups (mitigate with speed and niche focus), technical debt (allocate 20% sprint time for refactoring), fundraising risk (bootstrap path with consulting revenue), talent shortage (competitive equity packages and remote work).'
      },
      {
        title: 'Team & Management',
        description: 'Founding team and hiring plan',
        prompts: ['Who are the founders and their backgrounds?', 'What key hires do you need?', 'Will you offer equity to early employees?'],
        placeholder: 'Co-founding team: CEO (business), CTO (engineering). First hires: 2 full-stack developers, 1 product designer. ESOP pool of 10-15% for early team members. Advisory board with industry veterans. Target team size: 8-10 by Year 1.'
      }
    ]
  },
  {
    id: 'agritech-palm-oil',
    name: 'Palm Oil / AgriTech Business',
    description: 'Business plan for palm oil plantation or AgriTech solutions serving the Malaysian palm oil industry.',
    category: 'Agriculture & Technology',
    icon: 'Sprout',
    industry: 'Agriculture',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your AgriTech/palm oil business',
        prompts: ['Are you a plantation owner or AgriTech solution provider?', 'What technology will you implement?', 'What is your production or revenue target?'],
        placeholder: 'An AgriTech-enhanced palm oil operation leveraging IoT sensors, drone monitoring, and AI-powered yield prediction. Target: increase FFB yield by 25% and reduce operational costs by 15%. Serving the Malaysian palm oil industry worth RM70+ billion annually.'
      },
      {
        title: 'Company Description',
        description: 'Business structure and certifications',
        prompts: ['Do you have MPOB certification?', 'Are you MSPO certified?', 'Will you pursue RSPO certification?'],
        placeholder: 'Registered Sdn Bhd with MPOB license. MSPO certified plantation. Pursuing RSPO certification for premium market access. Committed to sustainable palm oil production in compliance with Malaysia Sustainable Palm Oil standards.'
      },
      {
        title: 'Market Analysis',
        description: 'Palm oil industry landscape',
        prompts: ['What is the current CPO price trend?', 'Who are the major players in your region?', 'What sustainability requirements do buyers demand?'],
        placeholder: 'Malaysia is the world 2nd largest palm oil producer. CPO prices averaging RM3,500-4,500/MT. Global demand for sustainable palm oil growing. EU Deforestation Regulation (EUDR) creating new compliance requirements. MSPO certification increasingly mandatory for market access.'
      },
      {
        title: 'Products & Services',
        description: 'AgriTech solutions or palm oil products',
        prompts: ['What technology solutions will you deploy?', 'What is your plantation size or target acreage?', 'Will you produce CPO, PKO, or value-added products?'],
        placeholder: 'IoT soil moisture and nutrient sensors across plantation. Drone-based aerial imaging for health assessment. AI yield prediction model. Products: Fresh Fruit Bunches (FFB), Crude Palm Oil (CPO), Palm Kernel Oil (PKO). Potential: biodiesel and oleochemicals.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Market access and buyer relationships',
        prompts: ['Will you sell to mills directly or through brokers?', 'Do you have export market access?', 'How will you differentiate on sustainability?'],
        placeholder: 'Direct supply agreements with nearby mills. Export through MPOB-licensed exporters. Sustainability differentiation through MSPO/RSPO certification and tech-enabled traceability. Target premium pricing of 5-10% for certified sustainable supply.'
      },
      {
        title: 'Operations Plan',
        description: 'Plantation and technology operations',
        prompts: ['What is your harvesting and collection process?', 'How will you manage pest and disease control?', 'What is your replanting schedule?'],
        placeholder: 'Harvesting cycle: every 10-14 days. Drone surveillance weekly. IoT sensor monitoring 24/7. Integrated pest management with biological controls. 25-year replanting cycle with progressive replanting schedule. Worker housing and welfare compliance with MPOB standards.'
      },
      {
        title: 'Financial Projections',
        description: 'Investment and return forecasts in MYR',
        prompts: ['What is the total investment required?', 'What is the expected yield per hectare?', 'When will the plantation reach maturity?'],
        placeholder: 'Investment: RM15,000-20,000/hectare for development. AgriTech investment: RM500-1,000/hectare. Yield target: 20-25 MT FFB/hectare at maturity. Revenue at maturity: RM8,000-12,000/hectare/year. ROI: 5-7 years from planting. CPO price sensitivity analysis included.'
      },
      {
        title: 'Risk Analysis',
        description: 'Agricultural and market risks',
        prompts: ['How will you manage climate and weather risks?', 'What is your plan for commodity price volatility?', 'How will you address labor shortage issues?'],
        placeholder: 'Key risks: commodity price volatility (hedging and diversification), climate change (drought-resistant varieties, irrigation), labor shortage (mechanization and automation), regulatory compliance (EUDR, MSPO updates). Mitigation: crop diversification, forward contracts, technology adoption.'
      },
      {
        title: 'Team & Management',
        description: 'Agricultural and technical team',
        prompts: ['Do you have experienced plantation managers?', 'What AgriTech expertise do you have on the team?', 'Will you use consultants or in-house agronomists?'],
        placeholder: 'Plantation manager with 15+ years experience. In-house agronomist for crop management. AgriTech partner for IoT and drone operations. MPOB-certified field assistants. Plan to hire data scientist for yield optimization analytics.'
      }
    ]
  },
  {
    id: 'islamic-fintech',
    name: 'Islamic FinTech',
    description: 'Business plan for a Shariah-compliant financial technology startup serving the Malaysian Islamic finance market.',
    category: 'Finance & Technology',
    icon: 'Landmark',
    industry: 'Finance',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your Islamic FinTech venture',
        prompts: ['What financial product will you offer?', 'How will you ensure Shariah compliance?', 'What is your target market segment?'],
        placeholder: 'A Shariah-compliant FinTech platform offering [product - e.g., micro-investment, crowdfunding, digital banking] to Malaysian Muslims. Supervised by Shariah Advisory Board. Licensed/seeking license from BNM or SC Malaysia. Target: RM50M AUM within 3 years.'
      },
      {
        title: 'Company Description',
        description: 'Regulatory structure and compliance',
        prompts: ['What regulatory license do you need from BNM/SC?', 'Do you have a Shariah Advisory Board?', 'Are you applying for BNM FinTech sandbox?'],
        placeholder: 'Sdn Bhd applying for [license type] from BNM/SC. Shariah Advisory Board with 3 qualified scholars. Applying for BNM Financial Technology Regulatory Sandbox. Compliant with Shariah Governance Policy Document and Islamic Financial Services Act 2013.'
      },
      {
        title: 'Market Analysis',
        description: 'Islamic finance market in Malaysia',
        prompts: ['What is the size of Malaysian Islamic finance market?', 'Who are the established Islamic finance players?', 'What gap in the market are you addressing?'],
        placeholder: 'Malaysia is the global Islamic finance hub with RM3.5+ trillion in Islamic banking assets. Islamic banking penetration at 40% of total banking. Takaful market growing 12% annually. Muslim millennials underserved by conventional products. Crowdfunding and micro-investment segments still nascent.'
      },
      {
        title: 'Products & Services',
        description: 'Shariah-compliant product offerings',
        prompts: ['What Islamic finance contracts will you use (Murabahah, Mudarabah, etc.)?', 'How will you structure profit-sharing?', 'What digital features will you offer?'],
        placeholder: 'Core product: Shariah-compliant [product] using [Islamic contract - e.g., Mudarabah profit-sharing]. Features: auto-investment, portfolio tracking, Zakat calculator, Qibla direction. Digital-first with mobile app. No riba, no gharar, no maysir. All transactions reviewed by Shariah board.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Customer acquisition for Islamic finance',
        prompts: ['How will you build trust with Muslim consumers?', 'Will you partner with mosques and Islamic organizations?', 'What role will social media play?'],
        placeholder: 'Trust-building through Shariah transparency and certification. Partnerships with mosques, Islamic schools, and Muslim organizations. Content marketing on Islamic finance education. Collaborations with Islamic influencers and ustaz/ustazah. Community events during Ramadan.'
      },
      {
        title: 'Operations Plan',
        description: 'Technology and compliance operations',
        prompts: ['What technology infrastructure will you use?', 'How will you handle AML/CFT compliance?', 'What is your Shariah audit process?'],
        placeholder: 'Cloud infrastructure on AWS/Azure with Malaysia data residency. AML/CFT screening using Bank Negara blacklist. Shariah audit quarterly by advisory board. PDPA-compliant data management. 24/7 system monitoring and security operations.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and funding forecasts in MYR',
        prompts: ['What is your funding requirement?', 'What is your revenue model?', 'When do you expect to be profitable?'],
        placeholder: 'Seed funding: RM2-5 million. Monthly burn rate: RM100,000-200,000. Revenue model: [udiyah/wakalah fee structure]. Break-even: Month 24-36. Projected Year 3 revenue: RM10-20 million. Target AUM: RM50 million by Year 3. Potential series A: RM10-20 million.'
      },
      {
        title: 'Risk Analysis',
        description: 'Financial and regulatory risks',
        prompts: ['What if BNM/SC rejects your license application?', 'How will you handle Shariah non-compliance risk?', 'What cybersecurity measures will you implement?'],
        placeholder: 'Key risks: regulatory approval (BNM sandbox pathway as mitigation), Shariah non-compliance (regular board reviews and audits), cybersecurity (SOC 2 compliance, penetration testing), market adoption (gradual rollout with beta testing). Insurance: professional indemnity and cyber liability coverage.'
      },
      {
        title: 'Team & Management',
        description: 'Finance and technology team',
        prompts: ['Do you have team members with Islamic finance expertise?', 'What technical talent do you need?', 'Will you have full-time Shariah scholars?'],
        placeholder: 'CEO: Islamic finance background with BNM experience. CTO: 10+ years in banking technology. Head of Shariah: certified Shariah advisor. Development team: 5-8 engineers. Advisory board: 3 Shariah scholars, 2 industry veterans. Total team: 15-20 by Year 2.'
      }
    ]
  },
  {
    id: 'tour-travel-agency',
    name: 'Tour & Travel Agency',
    description: 'Business plan for a tour and travel agency serving domestic and inbound tourism in Malaysia.',
    category: 'Tourism & Hospitality',
    icon: 'Plane',
    industry: 'Tourism',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your travel agency',
        prompts: ['What type of tours will you specialize in?', 'Will you focus on domestic or inbound tourists?', 'What is your target annual revenue?'],
        placeholder: 'A licensed tour agency specializing in [niche - e.g., eco-tourism, cultural tours, adventure] experiences in Malaysia. Serving both domestic travelers and international tourists. Target revenue of RM800,000 in Year 1 with 30% growth target.'
      },
      {
        title: 'Company Description',
        description: 'Licensing and business structure',
        prompts: ['Do you have MOTAC tour agency license?', 'Are you a member of MATTA?', 'Will you operate as Enterprise or Sdn Bhd?'],
        placeholder: 'Sdn Bhd registered with MOTAC tour agency license (License No: []). MATTA member for industry credibility. Certified tour guides on staff. Compliant with Tourism Industry Act 1992 and Tourism Vehicle Licensing.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian tourism market overview',
        prompts: ['What are the current tourism arrival trends?', 'What is the domestic travel market size?', 'Which tourist segments are growing fastest?'],
        placeholder: 'Malaysia targets 30+ million tourist arrivals. Domestic tourism spending exceeded RM100 billion pre-pandemic. Growth segments: eco-tourism (Sabah/Sarawak), cultural tourism (Melaka/Penang), Muslim-friendly travel, medical tourism. Post-pandemic revenge travel driving strong recovery.'
      },
      {
        title: 'Products & Services',
        description: 'Tour packages and travel services',
        prompts: ['What tour packages will you offer?', 'Will you provide custom/private tours?', 'Do you offer flight and hotel booking services?'],
        placeholder: 'Day tours: KL City Tour (RM150/pax), Batu Caves + Genting (RM120/pax). Multi-day: Borneo Adventure 3D2N (RM1,200/pax), Penang Heritage 2D1N (RM600/pax). Custom private tours available. Add-ons: airport transfer, travel insurance, photography services.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Travel marketing and distribution',
        prompts: ['How will you reach international tourists?', 'Will you partner with overseas travel agents?', 'What is your social media strategy?'],
        placeholder: 'Online presence: website with booking engine, TripAdvisor, Viator, Klook listings. Social media: Instagram and TikTok showcasing destinations. Partnerships with hotels and airlines. Travel fair participation (Matta Fair). Corporate team building packages. Chinese market: WeChat and Xiaohongshu marketing.'
      },
      {
        title: 'Operations Plan',
        description: 'Tour operations and logistics',
        prompts: ['How will you manage transportation?', 'What is your tour guide training process?', 'How will you handle emergency situations?'],
        placeholder: 'Fleet: leased vans and coaches with tourism vehicle license. Tour guides: licensed by MOTAC, multilingual. Emergency protocol: 24/7 hotline, travel insurance coverage, hospital network agreements. Quality assurance: post-tour feedback surveys, guide performance reviews.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your startup capital requirement?', 'What are your monthly fixed costs?', 'What is your average margin per tour?'],
        placeholder: 'Startup capital: RM50,000-100,000. Monthly fixed costs: RM15,000-25,000. Average gross margin: 25-35% per tour package. Break-even: 8-12 months. Year 1 revenue target: RM800,000. Year 3 target: RM2-3 million.'
      },
      {
        title: 'Risk Analysis',
        description: 'Tourism industry risks',
        prompts: ['How will you handle seasonality?', 'What is your plan for travel disruptions?', 'How will you manage safety incidents?'],
        placeholder: 'Key risks: seasonality (diversify with corporate and MICE segments), pandemic/travel restrictions (domestic focus and flexible cancellation policies), safety incidents (insurance, training, emergency protocols), fuel cost increases (dynamic pricing strategy).'
      },
      {
        title: 'Team & Management',
        description: 'Tourism team structure',
        prompts: ['How many licensed tour guides will you employ?', 'Will you have in-house or freelance guides?', 'Do you need a reservation team?'],
        placeholder: 'Operations manager with 10+ years tourism experience. 3-5 licensed tour guides (multilingual). 2 reservation/customer service staff. Freelance guides for peak periods. Transport coordinator for fleet management.'
      }
    ]
  },
  {
    id: 'fnb-franchise',
    name: 'F&B Franchise',
    description: 'Business plan for acquiring or developing a food & beverage franchise in Malaysia.',
    category: 'Food & Beverage',
    icon: 'Store',
    industry: 'Franchise',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your franchise venture',
        prompts: ['Which franchise brand are you acquiring or developing?', 'Will you be a franchisee or franchisor?', 'How many outlets do you plan to open?'],
        placeholder: 'Acquiring/developing a [brand name] franchise in [location]. Target: 3-5 outlets within 3 years. Initial investment of RM200,000-500,000 per outlet. Projected ROI of 25-35% within 24 months per outlet.'
      },
      {
        title: 'Company Description',
        description: 'Franchise structure and agreements',
        prompts: ['Have you reviewed the franchise agreement with a lawyer?', 'Is the franchise registered with MFA (Malaysia Franchise Association)?', 'What territory rights do you have?'],
        placeholder: 'Sdn Bhd registered as master franchisee/area developer. Franchise agreement reviewed by legal counsel. Registered with Malaysia Franchise Association. Exclusive territory rights for [area]. Franchise fee: RM50,000-150,000. Royalty: 5-8% of gross sales.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian F&B franchise market',
        prompts: ['What is the success rate of similar franchises in Malaysia?', 'What is the average franchise revenue in your category?', 'How saturated is the market in your territory?'],
        placeholder: 'Malaysia F&B franchise market worth RM15+ billion. Over 800 franchise brands operating. Average franchise success rate of 85% vs 50% for independent outlets. Growing demand for halal-certified and local brand franchises. Mid-range and quick-service segments growing fastest.'
      },
      {
        title: 'Products & Services',
        description: 'Franchise menu and service offerings',
        prompts: ['What is the core menu of the franchise?', 'Are there mandatory menu items vs optional ones?', 'Can you localize the menu for Malaysian tastes?'],
        placeholder: 'Core menu: [franchise standard items]. Localized items: [Malaysian adaptations]. Halal certification required for all menu items. Average ticket size: RM15-25 per person. Service model: quick-service with 10-15 minute wait time target.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Franchise marketing obligations and local strategies',
        prompts: ['What marketing support does the franchisor provide?', 'What is the marketing fund contribution?', 'How will you drive local store traffic?'],
        placeholder: 'National marketing fund: 2-4% of gross sales. Franchisor provides brand guidelines, seasonal campaigns, and digital assets. Local marketing: grand opening campaign, social media, loyalty program, delivery platform presence (GrabFood, Foodpanda, ShopeeFood).'
      },
      {
        title: 'Operations Plan',
        description: 'Franchise operations and compliance',
        prompts: ['What is the franchisor training program?', 'What are the mandatory SOPs?', 'How will you maintain quality standards?'],
        placeholder: 'Franchisor training: 2-4 week intensive program. Mandatory SOPs: food preparation, service standards, hygiene protocols, inventory management. Quality audits: monthly self-audit, quarterly franchisor audit. Supply chain: approved vendor list with centralized procurement.'
      },
      {
        title: 'Financial Projections',
        description: 'Franchise investment and returns in MYR',
        prompts: ['What is the total investment per outlet?', 'What are the monthly operating costs?', 'What is the expected payback period?'],
        placeholder: 'Total investment per outlet: RM250,000-500,000 (franchise fee, renovation, equipment, working capital). Monthly operating cost: RM30,000-60,000. Average monthly revenue: RM80,000-150,000. Net margin: 15-25%. Payback period: 18-24 months.'
      },
      {
        title: 'Risk Analysis',
        description: 'Franchise-specific risks',
        prompts: ['What if the franchisor brand reputation suffers?', 'Can you exit the franchise agreement early?', 'What if the franchisor increases royalty fees?'],
        placeholder: 'Key risks: brand reputation risk (franchisor management quality), franchise agreement lock-in (negotiate exit clauses), royalty increases (cap in agreement), location risk (thorough site analysis), supply chain dependency (understand alternative sourcing options).'
      },
      {
        title: 'Team & Management',
        description: 'Franchise staffing requirements',
        prompts: ['How many staff per outlet?', 'Does the franchisor provide training for your staff?', 'What is the management structure?'],
        placeholder: 'Per outlet: 1 outlet manager, 2-3 shift supervisors, 6-10 crew members. Franchisor provides training curriculum. Outlet manager must complete franchisor certification. Central team: operations manager overseeing all outlets, HR for recruitment, finance for reporting.'
      }
    ]
  },
  {
    id: 'telemedicine',
    name: 'Healthcare / Telemedicine',
    description: 'Business plan for a telemedicine or digital health platform serving the Malaysian healthcare market.',
    category: 'Healthcare & Technology',
    icon: 'Heart',
    industry: 'Healthcare',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your telemedicine platform',
        prompts: ['What healthcare services will you provide digitally?', 'Will you serve B2C patients or B2B healthcare providers?', 'What regulatory approvals do you need?'],
        placeholder: 'A telemedicine platform connecting Malaysian patients with licensed healthcare providers for video consultations, e-prescriptions, and digital health monitoring. B2C model targeting urban professionals and rural underserved communities. Seeking MDA registration and MoH compliance.'
      },
      {
        title: 'Company Description',
        description: 'Healthcare business structure and compliance',
        prompts: ['Are you registered with MOH for telemedicine services?', 'Do you comply with MyHDMS standards?', 'What data protection measures do you have?'],
        placeholder: 'Sdn Bhd registered with MOH telemedicine guidelines compliance. MDA (Medical Device Authority) registration for digital health software. PDPA and MyHDMS compliant. Medical advisory board with licensed specialists. Professional indemnity insurance coverage.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian digital health landscape',
        prompts: ['What is the telemedicine adoption rate in Malaysia?', 'Who are the existing telemedicine players?', 'What healthcare gaps exist in rural vs urban areas?'],
        placeholder: 'Malaysia healthcare spending at 4.3% of GDP. Telemedicine adoption surged 300% post-pandemic. Only 30% of specialists available outside Klang Valley. Rural Sabah/Sarawak severely underserved. Growing demand for chronic disease management, mental health support, and senior care.'
      },
      {
        title: 'Products & Services',
        description: 'Telemedicine platform features',
        prompts: ['What consultation types will you offer?', 'Will you integrate with pharmacies for e-prescriptions?', 'Do you offer AI-powered symptom checking?'],
        placeholder: 'Core services: video consultations (RM50-150), e-prescriptions, specialist referrals, digital health monitoring. Features: AI symptom checker, appointment scheduling, medical record storage, medicine delivery integration. Subscription plans: Basic RM29/month, Premium RM79/month with unlimited GP consults.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Healthcare marketing and patient acquisition',
        prompts: ['How will you acquire patients?', 'Will you partner with corporate employers for employee health benefits?', 'How will you build trust in digital healthcare?'],
        placeholder: 'Corporate partnerships for employee telemedicine benefits. Insurance panel partnerships (Prudential, AIA, Allianz). SEO and content marketing on health topics. Community health webinars. Partnerships with pharmacies for patient referrals. Government clinic referral network for specialist consults.'
      },
      {
        title: 'Operations Plan',
        description: 'Healthcare platform operations',
        prompts: ['How will you verify and onboard doctors?', 'What is the consultation workflow?', 'How will you handle medical emergencies?'],
        placeholder: 'Doctor onboarding: MMC verification, credentialing, platform training. Consultation workflow: booking, video call, e-prescription, follow-up. Emergency protocol: redirect to 999, nearest hospital notification. Quality assurance: patient feedback, clinical audit, peer review. 24/7 technical support.'
      },
      {
        title: 'Financial Projections',
        description: 'Healthcare platform revenue and costs in MYR',
        prompts: ['What is your platform commission per consultation?', 'What are your technology development costs?', 'When do you expect to reach profitability?'],
        placeholder: 'Seed funding: RM2-5 million. Platform commission: 20-30% of consultation fee. Monthly technology cost: RM30,000-50,000. Doctor onboarding cost: RM500-1,000 per doctor. Break-even: 18-24 months with 200+ active doctors and 5,000+ monthly consults. Year 3 revenue target: RM15-25 million.'
      },
      {
        title: 'Risk Analysis',
        description: 'Healthcare and regulatory risks',
        prompts: ['How will you handle medical malpractice claims?', 'What if MOH changes telemedicine regulations?', 'How will you ensure patient data security?'],
        placeholder: 'Key risks: medical malpractice (professional indemnity insurance, clinical governance), regulatory changes (active MOH engagement, compliance monitoring), data breach (encryption, access controls, incident response plan), doctor supply (competitive compensation, flexible scheduling).'
      },
      {
        title: 'Team & Management',
        description: 'Healthcare and technology team',
        prompts: ['Do you have medical professionals on the founding team?', 'What technology expertise do you need?', 'Will you have a medical advisory board?'],
        placeholder: 'Co-founders: medical doctor + technology executive. CTO with healthcare IT experience. Medical advisory board: 3 specialists (GP, internal medicine, psychiatry). Development team: 8-10 engineers. Operations: clinical operations manager, patient experience lead. Total: 20-25 by Year 2.'
      }
    ]
  },
  {
    id: 'edtech-online-tutoring',
    name: 'EdTech / Online Tutoring',
    description: 'Business plan for an EdTech platform or online tutoring service for the Malaysian education market.',
    category: 'Education & Technology',
    icon: 'GraduationCap',
    industry: 'Education',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your EdTech venture',
        prompts: ['What educational level will you target?', 'Will you offer live classes or self-paced courses?', 'What is your monetization model?'],
        placeholder: 'An online tutoring platform for Malaysian students (UPSR/PT3/SPM) with live classes and on-demand video lessons. Monetization: subscription model at RM49-99/month. Target: 10,000 subscribers within 12 months.'
      },
      {
        title: 'Company Description',
        description: 'EdTech business structure and compliance',
        prompts: ['Is your content aligned with the Malaysian National Curriculum (KSSM/KSSR)?', 'Will you register with MOE or MDEC?', 'What is your legal structure?'],
        placeholder: 'SSM-registered Sdn Bhd. Content aligned with KSSM/KSSR syllabus and MOE guidelines. Applying for MDEC MSC status for technology incentives. PDPA-compliant student data management. Compliant with Child Act 2001 for online learning platforms.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian EdTech and tutoring market',
        prompts: ['What is the size of the Malaysian private tuition market?', 'Who are the major EdTech competitors?', 'What gaps exist in current online learning solutions?'],
        placeholder: 'Malaysian private tuition market worth RM6+ billion annually. 85% of Malaysian students attend tuition. Online learning adoption accelerated post-pandemic. Major players: Kumon, Eyelevel, Pandai, Vedantu. Gap: affordable quality SPM-focused content in BM and local languages.'
      },
      {
        title: 'Products & Services',
        description: 'Platform features and learning content',
        prompts: ['What subjects and exam levels will you cover?', 'Will you offer AI-powered adaptive learning?', 'Do you provide progress tracking for parents?'],
        placeholder: 'Subjects: BM, English, Mathematics, Science, Sejarah for SPM. Features: live interactive classes (max 25 students), recorded video library, AI-powered quizzes, SPM past paper analysis. Parent dashboard with progress tracking. Free trial: 7 days. Plans: Basic RM49/month, Premium RM99/month with 1-on-1 sessions.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Student and parent acquisition',
        prompts: ['How will you reach parents and students?', 'Will you partner with schools?', 'What is your referral strategy?'],
        placeholder: 'Social media marketing targeting parents (Facebook, Instagram). School partnership program for discounted group access. KOL partnerships with popular SPM influencers and teachers. Free webinars on exam preparation tips. Referral program: 1 month free for every 3 referrals. Seasonal campaigns before major exams.'
      },
      {
        title: 'Operations Plan',
        description: 'Platform operations and content management',
        prompts: ['How will you recruit and verify tutors?', 'What is your content development process?', 'How will you handle technical support?'],
        placeholder: 'Tutor recruitment: MOE-qualified teachers, minimum 3 years experience, interview and demo class. Content development: in-house team following KSSM syllabus, quarterly updates. Technical support: in-app chat and WhatsApp, 12-hour response SLA. Platform maintenance: weekly updates, 99.5% uptime target.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your startup capital?', 'What are your monthly operating costs?', 'When do you expect to break even?'],
        placeholder: 'Startup capital: RM200,000-500,000 (platform development, content creation, marketing). Monthly operating cost: RM30,000-60,000. Tutor payment: 60-70% of subscription revenue. Break-even: 3,000-5,000 subscribers (Month 8-12). Year 2 revenue target: RM2-5 million.'
      },
      {
        title: 'Risk Analysis',
        description: 'EdTech industry risks',
        prompts: ['How will you handle curriculum changes by MOE?', 'What if free alternatives become available?', 'How will you ensure consistent tutor quality?'],
        placeholder: 'Key risks: curriculum changes (dedicated team for syllabus updates), free competition (differentiate with live interaction and SPM-specific content), tutor quality (rating system, regular training, student feedback), platform reliability (redundant servers, CDN for video delivery).'
      },
      {
        title: 'Team & Management',
        description: 'EdTech team structure',
        prompts: ['Do you have education industry experience?', 'What technology roles do you need?', 'Will you have a curriculum advisory panel?'],
        placeholder: 'Co-founders: ex-MOE teacher + technology entrepreneur. Curriculum director with 15+ years teaching experience. Development team: 4-6 engineers. Content team: 5-8 subject matter experts. Advisory panel: former SPM examiners. Target team: 20-25 by Year 2.'
      }
    ]
  },
  {
    id: 'construction-property-development',
    name: 'Construction & Property Development',
    description: 'Business plan for a construction or property development company in Malaysia with CIDB licensing and HDA compliance.',
    category: 'Construction & Real Estate',
    icon: 'Building2',
    industry: 'Construction',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your construction and property development venture',
        prompts: ['What type of projects will you undertake (residential, commercial, mixed-use)?', 'What is your target project value in MYR?', 'Will you focus on new builds or renovation?'],
        placeholder: 'A property development company specializing in affordable residential projects in [location - e.g., Iskandar Puteri, Nilai, Kajang]. Target: launch first project of RM30-50 million GDV within 18 months. Focus on mid-range landed properties for first-time homebuyers.'
      },
      {
        title: 'Company Description',
        description: 'Business structure and licensing',
        prompts: ['What CIDB grade are you registered under?', 'Do you have HDA (Housing Development Act) license?', 'Will you operate as Sdn Bhd?'],
        placeholder: 'Sdn Bhd registered with CIDB G7 certification. HDA licensed housing developer. Compliant with Uniform Building By-Laws (UBBL) and local authority regulations. Applying for MIDA incentives for green building adoption. Member of REHDA (Real Estate and Housing Developers Association).'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian property market landscape',
        prompts: ['What is the current property market sentiment in your target area?', 'Who are the major developers competing in your segment?', 'What is the demand for affordable housing?'],
        placeholder: 'Malaysian property market valued at RM300+ billion. Affordable housing segment (RM300K-500K) remains underserved with 60% demand. PR1MA and Rumah Mampu Milik programs indicate strong government support. Iskandar Malaysia and Greater KL remain high-growth corridors. Homeownership rate at 76% with room for growth among young adults.'
      },
      {
        title: 'Products & Services',
        description: 'Property development offerings',
        prompts: ['What type of properties will you develop?', 'What is your pricing strategy per unit?', 'Will you include smart home features or green certifications?'],
        placeholder: 'Phase 1: 50 units double-storey terrace houses (RM380,000-450,000). Features: contemporary design, smart home wiring, GreenRE certified. Additional: guarded community, playground, surau. Future phases: semi-D and apartment units. Customization options available for early buyers.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Property sales and marketing approach',
        prompts: ['How will you market your properties before completion?', 'Will you participate in property expos (MAPEX)?', 'Do you offer financing assistance or EPF withdrawal guidance?'],
        placeholder: 'Pre-launch marketing: show unit, VR tours, social media campaigns. MAPEX and HOC (Home Ownership Campaign) participation. Partnerships with major banks (Maybank, CIMB, Public Bank) for end-financing packages. EPF Account 2 withdrawal assistance. Early bird discounts and free SPA legal fees. Realtor network with 2% commission structure.'
      },
      {
        title: 'Operations Plan',
        description: 'Construction and project management',
        prompts: ['How will you manage the construction timeline?', 'Will you use in-house contractors or subcontractors?', 'What quality control measures will you implement?'],
        placeholder: 'Project management: Gantt chart with 24-30 month construction timeline. Main contractor: CIDB-registered with track record. Subcontractors: specialized trades (M&E, piling, landscaping). Quality control: independent QA consultant, monthly site inspections. Safety: OSHA compliance, SHO on site. Progressive billing per HDA schedule.'
      },
      {
        title: 'Financial Projections',
        description: 'Development costs and revenue forecasts in MYR',
        prompts: ['What is the total development cost?', 'What is the expected profit margin?', 'How will you finance the project?'],
        placeholder: 'Total development cost: RM22-35 million (land, construction, soft costs). Construction cost: RM180-220/sq ft. Expected profit margin: 18-25% on GDV. Financing: bank bridging loan (70-80% of cost) + equity (20-30%). Sales velocity target: 60% sold before VP. Cash flow: progressive claim from purchasers bank.'
      },
      {
        title: 'Risk Analysis',
        description: 'Construction and development risks',
        prompts: ['How will you manage construction cost overruns?', 'What if property sales are slower than expected?', 'How will you handle regulatory delays?'],
        placeholder: 'Key risks: cost overruns (fixed-price contracts, 10% contingency), slow sales (pre-launch testing, flexible payment schemes), regulatory delays (early submission, consultant engagement), material price increase (bulk procurement, price escalation clauses), labor shortage (foreign worker quota management).'
      },
      {
        title: 'Team & Management',
        description: 'Development and construction team',
        prompts: ['Do you have experienced project managers?', 'Will you have in-house architects and engineers?', 'What is your site management structure?'],
        placeholder: 'Managing Director with 20+ years property development experience. Project Manager (registered with BQSM). In-house: architect, M&E engineer, civil engineer. Site team: site supervisor, safety officer, clerk of works. External: quantity surveyor firm, town planning consultant. Total: 15-20 core team.'
      }
    ]
  },
  {
    id: 'logistics-last-mile-delivery',
    name: 'Logistics & Last-Mile Delivery',
    description: 'Business plan for a logistics and last-mile delivery service in Malaysia with e-commerce integration.',
    category: 'Logistics & Transportation',
    icon: 'Truck',
    industry: 'Logistics',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your logistics and delivery business',
        prompts: ['What delivery services will you offer?', 'Which regions will you cover?', 'What is your target monthly parcel volume?'],
        placeholder: 'A last-mile delivery service specializing in e-commerce parcel delivery within Klang Valley and major Malaysian cities. Target: 50,000 parcels/month within 12 months. Leveraging route optimization technology and gig rider network for cost-efficient delivery.'
      },
      {
        title: 'Company Description',
        description: 'Business structure and licensing',
        prompts: ['Are you registered with SSM and LPKP?', 'Will you operate as Enterprise or Sdn Bhd?', 'Do you have a goods vehicle license?'],
        placeholder: 'Sdn Bhd registered with LPKP (Land Public Transport Commission) goods vehicle license. MDEC e-logistics initiative member. PDPA-compliant tracking system. Fleet includes vans and motorcycles. Warehouse facility in Shah Alam/Seri Kembangan logistics hub.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian logistics and delivery market',
        prompts: ['What is the size of the Malaysian last-mile delivery market?', 'Who are the dominant logistics players?', 'What is the growth rate of e-commerce parcels?'],
        placeholder: 'Malaysian logistics market worth RM200+ billion. Last-mile delivery segment growing 25% annually driven by e-commerce. Parcel volume: 500+ million parcels/year. Major players: PosLaju, J&T Express, Ninjavan, GDex. Gap: same-day and hyperlocal delivery for SME sellers at competitive rates.'
      },
      {
        title: 'Products & Services',
        description: 'Delivery service offerings',
        prompts: ['What delivery timeframes will you offer?', 'Will you provide warehousing and fulfillment?', 'What is your pricing structure?'],
        placeholder: 'Standard delivery (2-3 days): RM5-8/parcel. Express delivery (next day): RM10-15/parcel. Same-day delivery (Klang Valley): RM15-25/parcel. Warehousing and fulfillment: RM2-5/parcel storage + pick-pack. API integration with Shopee, Lazada, and Shopify. COD service with 1% handling fee.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Client acquisition for logistics services',
        prompts: ['How will you acquire e-commerce sellers?', 'Will you offer volume discounts?', 'Do you have API integration with e-commerce platforms?'],
        placeholder: 'Direct sales to mid-size e-commerce sellers (100+ parcels/month). API integration with Shopee, Lazada, EasyParcel. Volume tiered pricing for high-volume sellers. Free pickup service for 50+ parcels/day clients. Warehouse open house events. Partnership with e-commerce enablers and dropship communities.'
      },
      {
        title: 'Operations Plan',
        description: 'Logistics operations and fleet management',
        prompts: ['How will you manage your rider/driver fleet?', 'What technology will you use for route optimization?', 'How will you handle lost or damaged parcels?'],
        placeholder: 'Fleet: 50% employed riders, 50% gig riders via proprietary app. Route optimization using AI-powered dispatch system. Sorting hub operation: 2 shifts (6AM-2PM, 2PM-10PM). Lost parcel protocol: investigation within 48 hours, compensation at declared value (max RM500). Real-time tracking via GPS.'
      },
      {
        title: 'Financial Projections',
        description: 'Revenue and cost forecasts in MYR',
        prompts: ['What is your startup capital?', 'What are your monthly operating costs?', 'When do you expect to break even?'],
        placeholder: 'Startup capital: RM500,000-1 million (fleet, warehouse deposit, technology). Monthly operating cost: RM150,000-300,000. Average revenue per parcel: RM8-12. Break-even: 30,000-40,000 parcels/month (Month 8-12). Year 2 revenue target: RM8-15 million. Gross margin target: 25-35%.'
      },
      {
        title: 'Risk Analysis',
        description: 'Logistics and delivery risks',
        prompts: ['How will you handle fuel price increases?', 'What is your plan for seasonal volume spikes?', 'How will you manage rider safety and liability?'],
        placeholder: 'Key risks: fuel price volatility (fuel surcharge mechanism), seasonal spikes (flexible gig rider pool), parcel loss/damage (insurance coverage, SOP enforcement), rider safety (safety training, insurance coverage), competition from larger players (niche focus on SME sellers, superior service quality).'
      },
      {
        title: 'Team & Management',
        description: 'Logistics team structure',
        prompts: ['Do you have logistics operations experience?', 'How will you manage the technology team?', 'What is your dispatch and sorting team structure?'],
        placeholder: 'Operations Director with 10+ years logistics experience (ex-J&T or GDex). Technology team: 3-4 developers for dispatch and tracking system. Hub managers at each sorting facility. Fleet manager for rider operations. Customer service team: 5-8 staff for parcel inquiries. Total: 30-40 including riders by Year 1.'
      }
    ]
  },
  {
    id: 'halal-food-manufacturing',
    name: 'Halal Food Manufacturing',
    description: 'Business plan for a halal food manufacturing facility in Malaysia with JAKIM certification and export potential.',
    category: 'Manufacturing & Food',
    icon: 'Factory',
    industry: 'Manufacturing',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your halal food manufacturing business',
        prompts: ['What food products will you manufacture?', 'Will you target domestic or export markets?', 'What is your target production capacity?'],
        placeholder: 'A JAKIM-certified halal food manufacturing facility producing [product - e.g., sauces, frozen food, snacks] for domestic and export markets. Target: 5,000 units/day production capacity. Export focus on ASEAN, Middle East, and global halal market worth USD2+ trillion.'
      },
      {
        title: 'Company Description',
        description: 'Manufacturing business structure and certifications',
        prompts: ['Do you have JAKIM halal certification?', 'Are you HACCP and GMP certified?', 'Will you register with MIDA for manufacturing incentives?'],
        placeholder: 'Sdn Bhd registered with JAKIM Halal certification. HACCP, GMP, and MeSTI certified facility. MIDA-registered for manufacturing incentives (Pioneer Status or Investment Tax Allowance). FDA-registered for US export. Member of Halal Industry Development Corporation (HDC) ecosystem.'
      },
      {
        title: 'Market Analysis',
        description: 'Global halal food market and Malaysian position',
        prompts: ['What is the size of the global halal food market?', 'How does Malaysia rank in halal food exports?', 'Who are the major competitors in your product category?'],
        placeholder: 'Global halal food market valued at USD2+ trillion, growing 10% annually. Malaysia is a global halal hub with RM50+ billion halal exports. Malaysia JAKIM certification recognized in 70+ countries. Growing demand in Middle East, China, and Europe. Competitive advantage: trusted halal certification ecosystem.'
      },
      {
        title: 'Products & Services',
        description: 'Halal food product range',
        prompts: ['What is your product range and SKUs?', 'Will you do OEM/contract manufacturing?', 'What packaging formats will you offer?'],
        placeholder: 'Core products: [product list with SKUs]. Product formats: retail pouches (200g-1kg), foodservice packs (5kg), bulk (20kg). OEM manufacturing available for private label. R&D capability for custom formulations. Shelf life: 12-24 months (ambient), 6 months (frozen). All products 100% halal with traceability from farm to fork.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Domestic and export market strategy',
        prompts: ['How will you distribute domestically?', 'What export markets will you target first?', 'Will you participate in trade fairs like MIHAS?'],
        placeholder: 'Domestic: distributor network covering all states, supermarket chain listings (Mydin, AEON, Tesco), e-commerce (Shopee/Lazada). Export: MIHAS participation, MATRADE trade missions, Halal expo events. Target markets: Singapore, Brunei, Indonesia, UAE, Saudi Arabia. OEM partnerships with international halal brands.'
      },
      {
        title: 'Operations Plan',
        description: 'Manufacturing operations and quality control',
        prompts: ['What is your factory size and location?', 'What is your production line setup?', 'How will you maintain halal integrity in production?'],
        placeholder: 'Factory: 10,000-20,000 sq ft in halal park (e.g., Halmas, Pulau Indah). Production lines: semi-automated with quality checkpoints. Halal integrity: dedicated halal production line, no non-halal ingredients on premises, daily halal audit. Warehouse: FIFO system, temperature-controlled storage. Shift: 2 shifts, 6 days/week.'
      },
      {
        title: 'Financial Projections',
        description: 'Manufacturing investment and revenue in MYR',
        prompts: ['What is the total capital investment?', 'What is your production cost per unit?', 'When do you expect to reach full capacity?'],
        placeholder: 'Total capital investment: RM2-5 million (factory, machinery, working capital). Production cost: 40-55% of selling price. Monthly operating cost: RM200,000-500,000. Break-even: 60-70% capacity utilization (Month 12-18). Full capacity target: Month 18-24. Year 2 revenue target: RM5-10 million.'
      },
      {
        title: 'Risk Analysis',
        description: 'Manufacturing and halal compliance risks',
        prompts: ['What happens if JAKIM halal certification is revoked?', 'How will you handle product recall situations?', 'What is your plan for raw material price volatility?'],
        placeholder: 'Key risks: halal certification loss (strict compliance protocol, dedicated halal officer), product recall (recall SOP, product liability insurance), raw material costs (bulk contracts, alternative suppliers), food safety (HACCP compliance, third-party testing), regulatory changes (active engagement with MOH and JAKIM).'
      },
      {
        title: 'Team & Management',
        description: 'Manufacturing team structure',
        prompts: ['Do you have food manufacturing experience?', 'Will you have a dedicated halal officer?', 'What is your quality assurance team structure?'],
        placeholder: 'Factory Manager with 15+ years food manufacturing experience. Halal Executive: JAKIM-certified halal officer on staff. Quality Assurance team: QA Manager + 3 QA inspectors. Production team: 20-30 factory workers per shift. R&D Chef for product development. Total: 50-70 staff including admin and sales.'
      }
    ]
  },
  {
    id: 'renewable-energy-solar',
    name: 'Renewable Energy / Solar',
    description: 'Business plan for a solar energy company in Malaysia with SEDA and Net Energy Metering considerations.',
    category: 'Energy & Sustainability',
    icon: 'Sun',
    industry: 'Energy',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your solar energy business',
        prompts: ['Will you focus on residential, commercial, or utility-scale solar?', 'What is your target installed capacity in MW?', 'Will you offer solar leasing or outright purchase?'],
        placeholder: 'A solar energy solutions company providing rooftop solar PV installations for commercial and industrial clients in Malaysia. Target: 10 MW installed capacity in Year 1. Offering both outright purchase and solar leasing models. Leveraging SEDA Net Energy Metering (NEM) and Large Scale Solar (LSS) programs.'
      },
      {
        title: 'Company Description',
        description: 'Solar business structure and certifications',
        prompts: ['Are you a SEDA-registered solar contractor?', 'Do you have EC (Electrical Contractor) license?', 'Are you applying for MIDA green technology incentives?'],
        placeholder: 'Sdn Bhd registered as SEDA-qualified solar PV installer. EC-licensed electrical team. MIDA Green Technology Tax Incentive applicant. Certified by Tier 1 solar panel manufacturers as authorized installer. Member of Malaysian Photovoltaic Industry Association (MPIA). ISO 9001 certified operations.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian renewable energy landscape',
        prompts: ['What is Malaysia renewable energy target?', 'What is the current solar installed capacity in Malaysia?', 'Who are the major solar players?'],
        placeholder: 'Malaysia targets 40% renewable energy capacity by 2035. Solar installed capacity growing 30%+ annually. NEM 3.0 program with 500MW allocation. LSS program driving utility-scale projects. Average solar irradiance: 4.5-5.5 kWh/m2/day. Electricity tariff for commercial: RM0.40-0.50/kWh making solar highly viable.'
      },
      {
        title: 'Products & Services',
        description: 'Solar installation and energy solutions',
        prompts: ['What solar system sizes will you offer?', 'Will you provide battery storage solutions?', 'Do you offer monitoring and maintenance?'],
        placeholder: 'Residential: 5-15 kW systems (RM25,000-70,000). Commercial: 50-500 kW systems (RM200,000-2M). Industrial: 500 kW-5 MW systems. Battery storage: lithium-ion options for energy independence. O&M service: RM500-1,500/month per system including monitoring, cleaning, and inverter maintenance. 25-year performance warranty.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Solar client acquisition strategy',
        prompts: ['How will you reach commercial and industrial clients?', 'Will you partner with property developers?', 'How will you communicate ROI to customers?'],
        placeholder: 'Direct B2B sales to factories, malls, and office buildings. ROI calculator tool on website showing payback period. Partnerships with property developers for new-build solar integration. SEDA and MIDA co-marketing at energy events. Referral program: RM1,000 per successful commercial referral. Free energy audit as lead magnet.'
      },
      {
        title: 'Operations Plan',
        description: 'Solar installation and project management',
        prompts: ['What is your installation timeline per project?', 'How will you manage solar panel procurement?', 'What is your quality assurance process?'],
        placeholder: 'Installation timeline: 2-4 weeks for commercial, 4-8 weeks for industrial. Procurement: direct from Tier 1 manufacturers (JinkoSolar, LONGi, Canadian Solar). Project management: dedicated PM per project. Quality: IEC-certified panels and inverters, structural engineering sign-off. SEDA submission and TNB coordination included. Post-installation: 1-year workmanship warranty.'
      },
      {
        title: 'Financial Projections',
        description: 'Solar business revenue and investment in MYR',
        prompts: ['What is your project margin?', 'What is your working capital requirement?', 'When do you expect to break even?'],
        placeholder: 'Startup capital: RM500,000-1 million. Project gross margin: 20-30%. Working capital: RM1-3 million (for material procurement). Revenue per MW installed: RM3-4 million. Year 1 target: 10 MW (RM30-40M revenue). Break-even: Month 8-12. Year 3 target: 30 MW installed with RM100M+ revenue. Recurring O&M revenue growing 15% annually.'
      },
      {
        title: 'Risk Analysis',
        description: 'Solar energy business risks',
        prompts: ['What if government solar incentives are reduced?', 'How will you handle solar panel supply chain disruptions?', 'What is your plan for warranty claims?'],
        placeholder: 'Key risks: policy changes (diversify revenue with O&M and battery storage), supply chain (maintain relationships with 3+ Tier 1 suppliers), warranty claims (manufacturer warranty + workmanship reserve fund), weather delays (project buffer, seasonal planning), competition (differentiate with superior service and financing options).'
      },
      {
        title: 'Team & Management',
        description: 'Solar engineering and operations team',
        prompts: ['Do you have certified solar engineers?', 'What is your installation team structure?', 'Will you subcontract installations?'],
        placeholder: 'Technical Director: 10+ years solar engineering experience, SEDA-certified. Engineering team: 3-5 solar designers (PVsyst, AutoCAD). Installation team: 4-6 crew leaders, 15-20 technicians. In-house vs subcontract: 70% in-house for quality control. Project managers: 2-3 PMP-certified PMs. Business development: 3-4 sales engineers. Total: 35-45 staff.'
      }
    ]
  },
  {
    id: 'aquaculture-seafood-farming',
    name: 'Aquaculture / Seafood Farming',
    description: 'Business plan for an aquaculture or seafood farming operation in Malaysia with DOF licensing and sustainability focus.',
    category: 'Agriculture & Fisheries',
    icon: 'Fish',
    industry: 'Aquaculture',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your aquaculture business',
        prompts: ['What species will you farm?', 'Will you operate inland or marine aquaculture?', 'What is your target annual production volume?'],
        placeholder: 'A sustainable aquaculture operation farming [species - e.g., tiger prawn, barramundi, tilapia] in [location - e.g., Tasik Kenyir, Pulau Ketumbar, Sabah coastal waters]. Target: 100 MT annual production by Year 3. Combining traditional methods with Recirculating Aquaculture System (RAS) technology for year-round production.'
      },
      {
        title: 'Company Description',
        description: 'Aquaculture business structure and licensing',
        prompts: ['Do you have a DOF (Department of Fisheries) aquaculture license?', 'Have you obtained EIA approval?', 'Will you pursue MyGAP certification?'],
        placeholder: 'Sdn Bhd registered with DOF aquaculture license. EIA (Environmental Impact Assessment) approved for site. MyGAP (Malaysian Good Agricultural Practices) certification in progress. Compliant with Fisheries Act 1985. Planning ASC (Aquaculture Stewardship Council) certification for export market access.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian aquaculture and seafood market',
        prompts: ['What is the size of the Malaysian seafood market?', 'What is the current supply gap for your species?', 'Who are the major aquaculture producers?'],
        placeholder: 'Malaysian seafood market worth RM20+ billion annually. Per capita fish consumption: 56 kg/year (among highest globally). Local production meets only 75% of demand. Aquaculture growing 8% annually to bridge the gap. Import value: RM4+ billion. Strong demand for premium species like tiger prawns and barramundi in domestic and export markets.'
      },
      {
        title: 'Products & Services',
        description: 'Aquaculture product offerings',
        prompts: ['Will you sell live, fresh, or frozen products?', 'Will you offer value-added products?', 'Do you plan hatchery operations?'],
        placeholder: 'Primary product: fresh [species] (whole and fillet). Wholesale: RM15-80/kg depending on species and size. Retail packaging: vacuum-packed portions (500g-1kg). Value-added: marinated, breaded, and ready-to-cook options. Hatchery: fingerling production for own use and sale to other farmers. Future: fish feed production and aquaculture consultancy.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Seafood market distribution strategy',
        prompts: ['Will you sell through wholesale markets or direct to restaurants?', 'Do you plan to export?', 'How will you ensure consistent supply to buyers?'],
        placeholder: 'Distribution: Pasar Borong (wholesale) for volume sales, direct supply to hotels and restaurants, supermarket chains (AEON, Village Grocer). Export: Singapore (AVS certified), Hong Kong, China. Online: fresh seafood delivery via own website and Shopee Fresh. Supply contracts with 3-month minimum commitment from major buyers.'
      },
      {
        title: 'Operations Plan',
        description: 'Aquaculture farm operations',
        prompts: ['What is your farm size and stocking density?', 'How will you manage water quality and disease?', 'What is your harvest cycle?'],
        placeholder: 'Farm size: 5-10 hectares (ponds/cages). Stocking density: species-appropriate levels with water quality monitoring. RAS system for indoor nursery. Water quality testing: daily (pH, DO, ammonia, temperature). Disease management: biosecurity protocols, regular health checks, quarantine for new stock. Harvest cycle: 4-8 months depending on species. Feed conversion ratio target: 1.5-2.0.'
      },
      {
        title: 'Financial Projections',
        description: 'Aquaculture investment and returns in MYR',
        prompts: ['What is the total setup cost for the farm?', 'What are your annual operating costs?', 'What is the expected ROI timeline?'],
        placeholder: 'Total setup cost: RM1-3 million (land lease, ponds/cages, RAS, equipment). Annual operating cost: RM500,000-1.5 million (feed 60%, labor 15%, utilities 10%). Production cost: RM8-25/kg depending on species. Selling price: RM15-80/kg. Gross margin: 30-50%. ROI: 3-5 years. Break-even at 60-70% capacity utilization.'
      },
      {
        title: 'Risk Analysis',
        description: 'Aquaculture industry risks',
        prompts: ['How will you manage disease outbreaks?', 'What is your plan for water contamination events?', 'How will you handle feed price increases?'],
        placeholder: 'Key risks: disease outbreak (biosecurity, vaccination, quarantine protocols), water contamination (regular testing, backup water supply, buffer zones), feed costs (bulk contracts, alternative feed research), weather events (farm design for flooding/storms, insurance), market price fluctuation (diversify species, value-added products).'
      },
      {
        title: 'Team & Management',
        description: 'Aquaculture team structure',
        prompts: ['Do you have aquaculture expertise on the team?', 'Will you employ a full-time aquaculturist?', 'How many farm workers do you need?'],
        placeholder: 'Farm Manager: BSc Aquaculture with 10+ years experience. Aquaculturist: MSc in Aquaculture for technical operations. Farm workers: 8-12 staff for daily operations (feeding, water monitoring, harvesting). Quality control: 2 staff for processing and packaging. Sales: 2 staff for market distribution. Consultant: fish pathologist on retainer. Total: 15-20 staff.'
      }
    ]
  },
  {
    id: 'creative-content-studio',
    name: 'Creative Content Studio',
    description: 'Business plan for a creative content studio producing video, animation, and digital content for Malaysian and regional brands.',
    category: 'Media & Creative',
    icon: 'Clapperboard',
    industry: 'Creative',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your creative content studio',
        prompts: ['What type of content will you produce?', 'Who is your target client base?', 'What is your target annual revenue in MYR?'],
        placeholder: 'A creative content studio specializing in video production, animation, and social media content for Malaysian brands and agencies. Services include TVCs, corporate videos, motion graphics, and TikTok/Reels content. Target revenue of RM600,000 in Year 1 with 40% from recurring retainer clients.'
      },
      {
        title: 'Company Description',
        description: 'Studio structure and capabilities',
        prompts: ['Will you register as Enterprise or Sdn Bhd?', 'Do you have an in-house studio space?', 'Will you apply for FINAS or MDEC creative industry incentives?'],
        placeholder: 'SSM-registered Sdn Bhd. In-house studio: 1,500-3,000 sq ft with green screen, lighting, and editing suites. Applying for MDEC Creative Content incentives and FINAS registration for local content production. Member of Malaysia Digital Content Association. Equipment: professional cinema cameras, drones, editing workstations.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian creative content industry',
        prompts: ['What is the size of the Malaysian creative content market?', 'Who are the major production houses?', 'What content trends are growing?'],
        placeholder: 'Malaysian creative industry contributes RM30+ billion to GDP. Digital content segment growing 20% annually. Growing demand for social media video content (TikTok, Instagram Reels, YouTube). Brand content budgets increasing 15-25% year-on-year. Gap: affordable, high-quality content for SMEs. Regional demand for Malaysian content expertise in ASEAN market.'
      },
      {
        title: 'Products & Services',
        description: 'Content production services and pricing',
        prompts: ['What is your pricing structure?', 'Do you offer content strategy and planning?', 'Will you produce long-form or short-form content?'],
        placeholder: 'TVC Production: RM30,000-150,000 per project. Corporate Video: RM10,000-50,000. Social Media Content Package: RM5,000-15,000/month (8-12 pieces). Animation/Motion Graphics: RM3,000-10,000 per minute. Event Coverage: RM3,000-8,000 per day. Retainer packages: RM8,000-25,000/month with dedicated creative team.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Client acquisition for creative studio',
        prompts: ['How will you attract corporate clients?', 'Will you partner with advertising agencies?', 'What is your showreel strategy?'],
        placeholder: 'Showreel marketing on website and social media. Partnerships with advertising agencies as production arm. LinkedIn outreach to marketing directors. Free creative consultation for first project. Industry events: Kancil Awards, MIFF, content marketing conferences. Referral program: 10% commission from agencies. Portfolio building with pro-bono work for NGOs.'
      },
      {
        title: 'Operations Plan',
        description: 'Content production workflow',
        prompts: ['What is your production workflow from brief to delivery?', 'How will you manage freelance crew?', 'What project management tools will you use?'],
        placeholder: 'Workflow: brief, concept, pre-production, production, post-production, delivery. Project management: Monday.com or Asana for timeline tracking. Freelance pool: 20+ trusted freelancers (DOPs, editors, animators, copywriters). Equipment management: booking system, maintenance schedule. Delivery: cloud-based review via Frame.io. Turnaround: social content 5-7 days, corporate video 3-4 weeks.'
      },
      {
        title: 'Financial Projections',
        description: 'Studio revenue and costs in MYR',
        prompts: ['What is your startup capital?', 'What are your monthly fixed costs?', 'How many projects per month do you need to break even?'],
        placeholder: 'Startup capital: RM150,000-300,000 (studio setup, equipment, working capital). Monthly fixed costs: RM20,000-40,000 (rent, salaries, subscriptions). Average project value: RM8,000-30,000. Break-even: 4-6 projects/month (Month 6-8). Year 1 revenue target: RM600,000-900,000. Gross margin: 40-55%.'
      },
      {
        title: 'Risk Analysis',
        description: 'Creative industry risks',
        prompts: ['How will you handle project delays and scope creep?', 'What if key creative staff leave?', 'How will you manage client payment delays?'],
        placeholder: 'Key risks: scope creep (detailed contracts with revision limits), talent retention (competitive pay, creative freedom, profit sharing), payment delays (50% upfront policy, clear payment terms), equipment failure (backup equipment, insurance), economic downturn (diversify with retainer packages and smaller projects).'
      },
      {
        title: 'Team & Management',
        description: 'Creative team structure',
        prompts: ['What are your core in-house roles?', 'Will you hire full-time or freelance editors?', 'What is your creative director profile?'],
        placeholder: 'Creative Director: 10+ years experience with agency background. In-house: 2 video editors, 1 motion graphics artist, 1 content strategist, 1 producer. Freelance network: directors, DOPs, animators, sound designers. Operations: studio manager, accounts executive. Target team: 8-10 full-time by Year 2. Internship program with local film schools.'
      }
    ]
  },
  {
    id: 'coworking-space',
    name: 'Coworking Space',
    description: 'Business plan for a coworking space business in Malaysia targeting freelancers, startups, and SMEs.',
    category: 'Real Estate & Services',
    icon: 'Building',
    industry: 'Workspace',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your coworking space business',
        prompts: ['Where will your coworking space be located?', 'What is your target capacity in seats?', 'What is your expected occupancy rate?'],
        placeholder: 'A premium coworking space in [location - e.g., Bangsar, PJ, Mont Kiara, Iskandar Puteri] targeting freelancers, startups, and SMEs. Capacity: 150-200 hot desks and 20-30 private offices. Target: 70% occupancy within 6 months. Offering flexible membership plans from RM150/month.'
      },
      {
        title: 'Company Description',
        description: 'Coworking business structure and compliance',
        prompts: ['Will you lease or purchase the property?', 'Is the property zoned for commercial office use?', 'Will you register as Sdn Bhd?'],
        placeholder: 'Sdn Bhd registered. Property: leased commercial space (8,000-15,000 sq ft) in Grade B+ office building. Zoning approved for office/coworking use. Compliant with local council (Majlis) regulations, fire safety (Bomba), and occupational safety. Member of Malaysia Coworking Space Alliance. MDEC partner for startup community events.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian coworking market landscape',
        prompts: ['What is the size of the Malaysian coworking market?', 'Who are the major coworking operators?', 'What is the demand trend for flexible workspace?'],
        placeholder: 'Malaysian coworking market growing 15-20% annually. 200+ coworking spaces nationwide. Key players: WeWork, Common Ground, WORQ, Colony. Post-pandemic hybrid work driving demand. SME adoption of flexible workspace increasing 30% annually. Klang Valley dominates with 70% of market. Growing demand in Tier 2 cities (Penang, Johor, Ipoh).'
      },
      {
        title: 'Products & Services',
        description: 'Coworking membership plans and amenities',
        prompts: ['What membership tiers will you offer?', 'What amenities and services will you include?', 'Will you offer virtual office services?'],
        placeholder: 'Hot Desk: RM150-300/month. Dedicated Desk: RM400-600/month. Private Office (2-4 pax): RM1,500-3,000/month. Meeting rooms: RM50-100/hour. Virtual Office: RM100-200/month (business address, mail handling). Amenities: high-speed WiFi, pantry, printing, phone booths, event space, nap room. Add-ons: business registration address, secretarial services, networking events.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Coworking member acquisition strategy',
        prompts: ['How will you attract startup and SME members?', 'Will you offer free trial days?', 'What community events will you host?'],
        placeholder: 'Free trial day for first-time visitors. Community events: weekly networking, monthly workshops, startup pitch nights. Partnerships with accelerators (MAGIC, MRANTI), universities, and MDEC. Social media: Instagram showcasing space design and community. Corporate plans: discounted rates for 10+ seats. Referral program: 1 month free per referral. SEO for "coworking space [location]" keywords.'
      },
      {
        title: 'Operations Plan',
        description: 'Coworking space management',
        prompts: ['What are your operating hours?', 'How will you manage access control?', 'What is your community management approach?'],
        placeholder: 'Operating hours: 8 AM - 10 PM weekdays, 9 AM - 6 PM weekends. 24/7 access for private office members via keycard. Access control: NFC keycard system with member app. Community manager on-site during business hours. Cleaning: twice daily, deep clean weekly. IT: 500 Mbps fiber with backup line. Member onboarding: 30-minute tour and orientation. Community app for bookings and networking.'
      },
      {
        title: 'Financial Projections',
        description: 'Coworking space revenue and costs in MYR',
        prompts: ['What is your total setup cost?', 'What is your monthly rental and operating cost?', 'When do you expect to break even?'],
        placeholder: 'Setup cost: RM500,000-1.2 million (renovation, furniture, IT, deposit). Monthly rental: RM25,000-60,000. Monthly operating cost: RM40,000-80,000 total. Revenue at 70% occupancy: RM80,000-150,000/month. Break-even: 60-65% occupancy (Month 8-14). ROI: 24-36 months. Additional revenue: events, meeting room rental, virtual office.'
      },
      {
        title: 'Risk Analysis',
        description: 'Coworking business risks',
        prompts: ['What if occupancy drops below break-even?', 'How will you handle lease renewal risk?', 'What if a major competitor opens nearby?'],
        placeholder: 'Key risks: low occupancy (flexible pricing, corporate partnerships, subleasing excess space), lease renewal (negotiate 5+ year term with renewal option), competition (differentiate with community and niche services), economic downturn (offer discounted plans, hybrid work packages), member churn (engagement programs, loyalty discounts).'
      },
      {
        title: 'Team & Management',
        description: 'Coworking space team',
        prompts: ['Will you have a full-time community manager?', 'Do you need front desk staff?', 'How will you handle IT and maintenance?'],
        placeholder: 'Community Manager: full-time, experienced in startup ecosystem and event management. Front desk: 2 staff (shift basis). Operations: 1 operations executive for vendor management. Cleaning: outsourced with daily supervision. IT: managed service provider for network and systems. Accounting: outsourced to firm. Total: 4-5 full-time staff plus outsourced services.'
      }
    ]
  },
  {
    id: 'rubber-latex-products',
    name: 'Rubber & Latex Products',
    description: 'Business plan for a rubber and latex products manufacturing business in Malaysia with MRB licensing and export focus.',
    category: 'Manufacturing & Agriculture',
    icon: 'CircleDot',
    industry: 'Rubber',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your rubber and latex products business',
        prompts: ['What rubber products will you manufacture?', 'Will you focus on domestic or export markets?', 'What is your target production capacity?'],
        placeholder: 'A rubber and latex products manufacturer producing [products - e.g., surgical gloves, condoms, rubber threads, latex mattresses] for domestic and global markets. Target: 10 million pieces/month production capacity. Export-oriented with focus on US, EU, and Japan markets. Leveraging Malaysia position as the world leading rubber gloves producer.'
      },
      {
        title: 'Company Description',
        description: 'Rubber manufacturing structure and certifications',
        prompts: ['Do you have MRB (Malaysian Rubber Board) license?', 'Are you ISO 13485 certified (medical devices)?', 'Will you apply for MIDA manufacturing incentives?'],
        placeholder: 'Sdn Bhd registered with MRB manufacturing license. ISO 13485 certified for medical-grade products. ISO 9001 and ISO 14001 certified operations. MIDA Pioneer Status applicant for manufacturing tax incentives. FDA-registered facility (US market). CE marking for EU market. Member of Malaysian Rubber Export Promotion Council (MREPC).'
      },
      {
        title: 'Market Analysis',
        description: 'Global rubber and latex market',
        prompts: ['What is the global rubber gloves market size?', 'How does Malaysia rank in rubber product exports?', 'What are the key market trends?'],
        placeholder: 'Global rubber gloves market valued at USD12+ billion, growing 8% annually. Malaysia produces 65% of world rubber gloves. Top exporters: Top Glove, Hartalega, Kossan, Supermax. Growing demand for nitrile gloves (allergy-free). Post-pandemic demand normalized but structural growth continues. Emerging demand: eco-friendly natural rubber products, specialty gloves for cleanroom and food handling.'
      },
      {
        title: 'Products & Services',
        description: 'Rubber product range and specifications',
        prompts: ['What is your product range?', 'Will you produce medical or industrial grade products?', 'What quality standards will your products meet?'],
        placeholder: 'Product range: nitrile examination gloves, latex surgical gloves, industrial gloves, rubber threads, latex foam products. Specifications: ASTM D6319 (nitrile), ASTM D3578 (latex surgical). Custom specifications available for OEM. Packaging: 100 pcs/box, 10 boxes/carton. Private label manufacturing available. R&D capability for specialty formulations.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Rubber product sales and distribution',
        prompts: ['Will you sell directly or through distributors?', 'What trade shows will you participate in?', 'How will you penetrate the US and EU markets?'],
        placeholder: 'Sales channels: direct to hospital groups and distributors, medical device distributors, industrial supply companies. Trade shows: MEDICA (Germany), Arab Health (Dubai), FMM-MRBF (Malaysia). Export: MATRADE market development grants. US market: FDA-compliant products through medical distributors. EU market: CE-marked products. OEM partnerships with global brands.'
      },
      {
        title: 'Operations Plan',
        description: 'Rubber manufacturing operations',
        prompts: ['What is your factory setup and production line configuration?', 'How will you source latex raw material?', 'What quality control measures will you implement?'],
        placeholder: 'Factory: 30,000-50,000 sq ft in industrial zone (e.g., Klang, Perai, Pasir Gudang). Production lines: 4-8 double-former dipping lines. Raw material: latex concentrate from MRB-certified suppliers, nitrile from petrochemical suppliers. QC: in-line inspection, AQL sampling per ISO 2859, lot traceability. Production: 3 shifts, 24/7 operation. Water treatment: effluent treatment plant compliance with DOE standards.'
      },
      {
        title: 'Financial Projections',
        description: 'Rubber manufacturing investment and returns in MYR',
        prompts: ['What is the total capital investment?', 'What is your production cost per unit?', 'When do you expect to achieve full capacity?'],
        placeholder: 'Total capital investment: RM10-30 million (factory, machinery, working capital). Production cost: RM12-18/box (nitrile gloves). Selling price: RM18-30/box. Gross margin: 25-40%. Monthly operating cost: RM1-3 million. Break-even: 60% capacity (Month 12-18). Full capacity target: Month 18-24. Year 2 revenue target: RM30-80 million.'
      },
      {
        title: 'Risk Analysis',
        description: 'Rubber manufacturing risks',
        prompts: ['How will you manage latex price volatility?', 'What if there is a product quality failure?', 'How will you address environmental compliance?'],
        placeholder: 'Key risks: latex/nitrile price volatility (forward contracts, hedging), quality failure (ISO 13485 quality system, recall insurance), environmental compliance (effluent treatment, air emission controls), energy costs (solar installation, energy efficiency), foreign worker dependency (automation roadmap, local hiring initiatives).'
      },
      {
        title: 'Team & Management',
        description: 'Rubber manufacturing team',
        prompts: ['Do you have rubber manufacturing experience?', 'What is your quality team structure?', 'How many production workers do you need?'],
        placeholder: 'Factory General Manager: 20+ years rubber industry experience. Production Manager: MRB-trained with dipping line expertise. Quality Director: ISO 13485 lead auditor certified. QA team: 5-8 inspectors per shift. Production team: 80-120 workers per shift (3 shifts). Engineering: 3-5 maintenance engineers. R&D: 2-3 polymer scientists. Total: 300-400 staff across all functions.'
      }
    ]
  },
  {
    id: 'smart-manufacturing-industry4',
    name: 'Smart Manufacturing (Industry 4.0)',
    description: 'Business plan for a smart manufacturing company leveraging Industry 4.0 technologies with MIDA Industry4ward incentives.',
    category: 'Technology & Manufacturing',
    icon: 'Cpu',
    industry: 'Smart Manufacturing',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your smart manufacturing venture',
        prompts: ['What products will you manufacture using Industry 4.0?', 'What smart technologies will you implement?', 'What is your target production output?'],
        placeholder: 'A smart manufacturing facility producing [products - e.g., electronics, automotive parts, medical devices] using Industry 4.0 technologies including IoT, AI, robotics, and digital twins. Target: 30% productivity improvement over traditional manufacturing. Leveraging MIDA Industry4ward initiative for smart manufacturing incentives.'
      },
      {
        title: 'Company Description',
        description: 'Smart manufacturing structure and certifications',
        prompts: ['Will you apply for MIDA Industry4ward certification?', 'Are you ISO 9001 and IATF 16949 certified?', 'What is your digital maturity assessment?'],
        placeholder: 'Sdn Bhd registered with MIDA Industry4ward readiness assessment completed. Targeting Industry4ward certification for tax incentives. ISO 9001 certified, pursuing IATF 16949 for automotive supply chain. SIRIM-certified testing laboratory. Digital maturity level: transitioning from Level 2 to Level 3 (connected). Member of Malaysia Automotive, Robotics and IoT Institute (MARii).'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian smart manufacturing landscape',
        prompts: ['What is the adoption rate of Industry 4.0 in Malaysia?', 'What government incentives are available?', 'Who are the key players in smart manufacturing?'],
        placeholder: 'Malaysia manufacturing sector contributes 23% to GDP. Industry 4.0 adoption rate at 20-25% among manufacturers, growing rapidly. MIDA Industry4ward provides tax allowances and reinvestment incentives. MARii and MDEC offering digital transformation grants. Key sectors: E&E, automotive, medical devices. Gap: SME manufacturers lagging in digital adoption, creating consulting and technology integration opportunities.'
      },
      {
        title: 'Products & Services',
        description: 'Smart manufacturing product and service offerings',
        prompts: ['What is your product catalog?', 'Will you offer manufacturing-as-a-service?', 'Do you provide digital factory consulting?'],
        placeholder: 'Core manufacturing: [product range] with smart production tracking. Services: contract manufacturing with real-time visibility, manufacturing-as-a-service (on-demand production), digital factory consulting for SMEs. Technology stack: MES (Manufacturing Execution System), SCADA, digital twin, predictive maintenance AI. Turnaround: 30% faster than traditional manufacturing. Quality: AI-powered defect detection with 99.5% accuracy.'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Smart manufacturing client acquisition',
        prompts: ['How will you attract OEM and MNC clients?', 'Will you participate in industry exhibitions?', 'How will you demonstrate your Industry 4.0 capabilities?'],
        placeholder: 'Direct sales to OEMs and MNCs in E&E and automotive sectors. Industry exhibitions: SEMI Southeast Asia, MIFF, HANNOVER MESSE. Digital factory showcase tours for prospective clients. MARii and MIDA co-marketing programs. Case study marketing demonstrating productivity gains. Vendor development program with MNCs. Consulting service as gateway to manufacturing contracts.'
      },
      {
        title: 'Operations Plan',
        description: 'Smart factory operations and technology',
        prompts: ['What is your factory layout and automation level?', 'How will you implement the digital twin?', 'What is your data analytics infrastructure?'],
        placeholder: 'Factory: 20,000-40,000 sq ft with modular production layout. Automation: collaborative robots (cobots), automated guided vehicles (AGVs), IoT sensor network. Digital twin: real-time 3D model of factory floor synced with MES. Data infrastructure: edge computing + cloud analytics (AWS/Azure). Cybersecurity: IEC 62443 compliance, network segmentation. Maintenance: predictive AI reducing downtime by 40%. Quality: machine vision inspection at every critical station.'
      },
      {
        title: 'Financial Projections',
        description: 'Smart manufacturing investment and returns in MYR',
        prompts: ['What is your total capital investment including technology?', 'What are your savings from automation?', 'When do you expect ROI?'],
        placeholder: 'Total capital investment: RM15-40 million (factory, automation, IoT, AI systems). Technology investment: 30-40% of total capex. Labor cost savings: 40-50% vs traditional manufacturing. Monthly operating cost: RM1-3 million. Break-even: Month 18-24. Year 2 revenue target: RM30-60 million. Gross margin: 30-40% (higher than traditional due to efficiency gains). MIDA tax incentives offset 30-50% of technology investment.'
      },
      {
        title: 'Risk Analysis',
        description: 'Smart manufacturing risks',
        prompts: ['What is your cybersecurity risk mitigation plan?', 'How will you handle technology obsolescence?', 'What if automation ROI is lower than expected?'],
        placeholder: 'Key risks: cybersecurity (IEC 62443 compliance, regular penetration testing, incident response plan), technology obsolescence (modular architecture, upgrade roadmap), ROI shortfall (phased implementation, measure KPIs at each phase), talent shortage (upskilling programs, university partnerships), supply chain disruption (digital supply chain visibility, dual sourcing strategy).'
      },
      {
        title: 'Team & Management',
        description: 'Smart manufacturing team structure',
        prompts: ['Do you have Industry 4.0 expertise on the team?', 'What is your engineering team profile?', 'How will you manage the data science function?'],
        placeholder: 'CEO: 15+ years manufacturing + digital transformation experience. CTO: Industry 4.0 specialist with IoT/AI background. Production Director: Lean Six Sigma Black Belt. Engineering team: 5-8 automation and robotics engineers. Data science team: 3-4 data scientists for predictive analytics. IT/OT team: 4-5 specialists for MES, SCADA, cybersecurity. Production operators: 30-50 (reduced from 80-100 in traditional setup). Total: 60-80 staff.'
      }
    ]
  },
  {
    id: 'social-enterprise-ngo',
    name: 'Social Enterprise / NGO',
    description: 'Business plan for a social enterprise or NGO in Malaysia with CCM registration and impact measurement framework.',
    category: 'Social Impact',
    icon: 'HandHeart',
    industry: 'Social Enterprise',
    difficulty: 'intermediate',
    estimatedTime: '3-4 weeks',
    sections: [
      {
        title: 'Executive Summary',
        description: 'Overview of your social enterprise or NGO',
        prompts: ['What social or environmental problem will you address?', 'What is your revenue model (earned income vs donations)?', 'What impact do you aim to achieve in 3 years?'],
        placeholder: 'A social enterprise addressing [social issue - e.g., B40 community empowerment, environmental conservation, disability inclusion, rural education] in Malaysia. Revenue model: 60% earned income from products/services, 40% grants and donations. Target: impact 5,000 beneficiaries within 3 years while achieving financial sustainability.'
      },
      {
        title: 'Company Description',
        description: 'Social enterprise structure and registration',
        prompts: ['Will you register as Sdn Bhd (with CCM) or Society (with ROS)?', 'Are you registered with maGIC as a social enterprise?', 'What is your governance structure?'],
        placeholder: 'Registered with CCM (Companies Commission of Malaysia) as a Sdn Bhd by guarantee or with ROS (Registrar of Societies) as a society. Registered with maGIC (Malaysian Global Innovation and Creativity Centre) Social Enterprise. Board of Trustees with independent members. Impact measurement using IRIS+ framework. Compliant with PDPA for beneficiary data. Considering ISO 26000 social responsibility guidance.'
      },
      {
        title: 'Market Analysis',
        description: 'Malaysian social enterprise landscape',
        prompts: ['How many social enterprises operate in Malaysia?', 'What is the funding landscape for social impact?', 'What gaps exist in the social sector?'],
        placeholder: 'Malaysia has 1,000+ registered social enterprises. Social enterprise sector growing 15% annually. Key funders: Khazanah Nasional, Yayasan Hasanah, CIMB Foundation, YTL Foundation, UNDP Malaysia. Government support: maGIC ACT programmes, TEKUN Nasional. Gap areas: B40 economic empowerment, senior care, disability employment, environmental conservation. Corporate CSR partnerships increasing with ESG mandates.'
      },
      {
        title: 'Products & Services',
        description: 'Social impact products and services',
        prompts: ['What products or services will generate revenue?', 'How do your offerings directly address the social problem?', 'Will you offer B2B services to corporations?'],
        placeholder: 'Revenue-generating products: [product/service with social impact]. B2B services: corporate training on inclusion, CSR program design and management, impact consulting. Consumer products: [product category] made by marginalized communities. Corporate partnerships: employee volunteer programs, gift-with-impact packages. Pricing: market rate with transparent profit-for-purpose model. All revenue reinvested into mission (minimum 60% of profits).'
      },
      {
        title: 'Marketing & Sales Strategy',
        description: 'Social enterprise marketing and partnerships',
        prompts: ['How will you communicate your impact story?', 'Will you pursue corporate CSR partnerships?', 'How will you leverage social media for cause awareness?'],
        placeholder: 'Impact storytelling through social media and annual impact report. Corporate CSR partnerships: pitch deck with measurable impact metrics. B2B sales: proposal to HR and sustainability departments. Events: maGIC ACT demo day, Social Enterprise Alliance events, TEDx talks. Media: press coverage in The Star, Malaysiakini, New Straits Times. Community: beneficiary testimonials and success stories. Grant applications: annual calendar of funding opportunities.'
      },
      {
        title: 'Operations Plan',
        description: 'Social enterprise operations and impact delivery',
        prompts: ['How will you deliver social impact programs?', 'What is your beneficiary onboarding process?', 'How will you measure and report impact?'],
        placeholder: 'Impact program delivery: partnerships with community organizations and government agencies. Beneficiary onboarding: needs assessment, customized support plan, progress tracking. Impact measurement: Theory of Change framework with quarterly KPI tracking. Tools: impact dashboard, beneficiary surveys, outcome measurement. Volunteer management: volunteer portal with scheduling and tracking. Operations team: lean structure with heavy reliance on volunteers and interns.'
      },
      {
        title: 'Financial Projections',
        description: 'Social enterprise financial sustainability in MYR',
        prompts: ['What is your startup funding requirement?', 'What is your earned income target vs grant target?', 'When will you achieve financial self-sustainability?'],
        placeholder: 'Startup funding: RM100,000-300,000 (grants, crowdfunding, seed investors). Year 1 revenue: RM200,000-500,000 (40% earned, 60% grants). Year 3 target: RM800,000-1.5 million (70% earned, 30% grants). Monthly operating cost: RM15,000-40,000. Financial self-sustainability target: Year 3-4. Reserve fund: 6 months operating expenses. Impact investment readiness: Year 2-3 for social impact investors.'
      },
      {
        title: 'Risk Analysis',
        description: 'Social enterprise risks',
        prompts: ['What if grant funding decreases?', 'How will you balance mission and commercial viability?', 'What is your plan for founder burnout?'],
        placeholder: 'Key risks: grant dependency (diversify revenue streams toward earned income), mission drift (board governance, impact measurement, mission lock), founder burnout (succession planning, team development), beneficiary dependency (empowerment approach, graduation programs), scaling challenges (pilot-test-scale model, impact fidelity at scale).'
      },
      {
        title: 'Team & Management',
        description: 'Social enterprise team and governance',
        prompts: ['What is your board composition?', 'Do you have social sector experience?', 'Will you use volunteers extensively?'],
        placeholder: 'Founder/CEO: social sector experience with business acumen. Board of Trustees: 5 members (2 independent, 1 beneficiary representative, 2 sector experts). Core team: 3-5 full-time staff covering programs, operations, and fundraising. Volunteer pool: 20-30 active volunteers. Internship program with local universities (UM, UKM, UPM). Advisory panel: 3 subject matter experts. Total: 8-10 full-time equivalent including key volunteers.'
      }
    ]
  }
];
