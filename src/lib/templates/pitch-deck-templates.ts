export interface PitchDeckSlide {
  title: string;
  description: string;
  contentPoints: string[];
  speakerNotes: string;
  duration: string;
}

export interface PitchDeckTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: string;
  slides: PitchDeckSlide[];
}

function mk(id: string, name: string, desc: string, cat: string, icon: string, diff: 'beginner' | 'intermediate' | 'advanced', audience: string, pts: string[][]): PitchDeckTemplate {
  const slideTitles = ['Title Slide', 'The Problem', 'Our Solution', 'Market Opportunity', 'Business Model', 'Traction & Milestones', 'Go-to-Market Strategy', 'Competitive Landscape', 'Team', 'Financial Projections', 'The Ask', 'Thank You'];
  const slideDescs = [
    'Introduction and hook', 'The pain point we address', 'How we solve the problem', 'Market size and potential',
    'How we make money', 'Progress and validation', 'Customer acquisition strategy', 'Our competitive position',
    'The people behind the vision', 'Revenue and growth forecasts', 'Investment opportunity', 'Closing and contact'
  ];
  const durations = ['1 min', '2 min', '2 min', '2 min', '2 min', '2 min', '2 min', '1 min', '2 min', '2 min', '1 min', '1 min'];
  return {
    id, name, description: desc, category: cat, icon, difficulty: diff, targetAudience: audience,
    slides: slideTitles.map((t, i) => ({
      title: t,
      description: slideDescs[i],
      contentPoints: pts[i] || [],
      speakerNotes: `Discuss ${t.toLowerCase()} with specific Malaysia market data and examples.`,
      duration: durations[i]
    }))
  };
}

export const pitchDeckTemplates: PitchDeckTemplate[] = [
  mk('nasi-lemak-pitch', 'Nasi Lemak Stall Pitch', 'Investor pitch for a Nasi Lemak food business in Malaysia', 'Food & Beverage', 'ChefHat', 'beginner', 'Angel investors, F&B mentors', [
    ['Nasi Lemak [Brand Name]', 'Authentic Malaysian Breakfast, Reimagined', 'Founded 2024 | Kuala Lumpur', 'Tagline: The Soul of Malaysian Breakfast'],
    ['Malaysians spend RM5-15 daily on breakfast', '70% skip home-cooked meals due to urban lifestyle', 'Limited quality Nasi Lemak options near transit hubs', 'No scalable Nasi Lemak brand with consistent quality'],
    ['Premium Nasi Lemak with consistent quality standards', 'Strategic locations near LRT/MRT stations', 'Delivery via GrabFood, Foodpanda, ShopeeFood', 'JAKIM Halal certified from day one'],
    ['Malaysia F&B market: RM150+ billion annually', 'Breakfast segment: RM45 billion (30% of F&B)', 'Target TAM: RM500M in Klang Valley breakfast market', 'Growing 8% annually in urban quick-service segment'],
    ['Dine-in: RM5-10 average ticket', 'Delivery: RM15-25 average order', 'Catering: RM30-50 per pax corporate packages', 'Monthly revenue target: RM30,000-60,000 per outlet'],
    ['1st outlet operational since [date]', 'Daily customers: 150-300 pax', '4.8 star rating on GrabFood', 'Monthly revenue: RM45,000 and growing'],
    ['Social media: TikTok and Instagram food content', 'GrabFood/Foodpanda partnership for delivery', 'Office catering for corporate breakfast', 'Loyalty program: Buy 10 Get 1 Free'],
    ['Traditional stalls: No consistency or branding', 'Chain restaurants: Higher price, less authentic', 'Our edge: Authentic taste + modern consistency + convenience', 'Competitive pricing: RM5-10 vs RM12-20 at chains'],
    ['Founder: 8 years F&B experience', 'Head Chef: Specialized in Malay traditional cuisine', 'Operations: Former GrabFood restaurant consultant', 'Advisor: Ex-CEO of local F&B chain'],
    ['Year 1: RM540K revenue, 1 outlet', 'Year 2: RM1.8M revenue, 3 outlets', 'Year 3: RM4.5M revenue, 8 outlets', 'EBITDA margin target: 18-22%'],
    ['Seeking: RM200,000 seed investment', 'Use: 2nd outlet setup + central kitchen', 'Equity offered: 15-20%', 'Expected ROI: 25-35% annually'],
    ['Thank you for your time!', 'Contact: [email] | [phone]', 'Follow us: @brand on TikTok/Instagram', 'Sample tasting available after presentation']
  ]),
  mk('ecommerce-pitch', 'E-Commerce Store Pitch', 'Pitch for a Shopee/Lazada e-commerce business', 'E-Commerce', 'ShoppingCart', 'beginner', 'Angel investors, e-commerce mentors', [
    ['[Brand Name] - Malaysia Online Store', 'Premium [Category] at Your Fingertips', 'Shopee Top Seller | Lazada Preferred Merchant', 'Tagline: Quality Products, Malaysian Prices'],
    ['Malaysian consumers lack access to affordable quality [category]', 'Offline retail markup of 40-60% in malls', 'Inconsistent product quality from unknown online sellers', 'Slow delivery and poor customer service plague the market'],
    ['Curated [category] products at 30% below retail', 'Same-day delivery in Klang Valley', '7-day hassle-free returns', 'Quality-guaranteed with SSM-registered business'],
    ['Malaysia e-commerce: RM60+ billion by 2025', '[Category] market: RM2 billion growing 25% CAGR', 'Mobile commerce: 70% of transactions', 'Shopee + Lazada combined: 85% market reach'],
    ['Product margin: 35-50% after COGS', 'Platform commission: 2-4% + payment fees', 'Average order value: RM80-120', 'Repeat purchase rate target: 40%'],
    ['1,500+ monthly orders across Shopee and Lazada', '4.9 star rating with 3,000+ reviews', 'Shopee Top Seller badge achieved in Month 3', 'Monthly GMV: RM120,000 growing 15% MoM'],
    ['Shopee/Lazada mega sales (11.11, 12.12, Raya)', 'Live selling 3x per week on TikTok Shop', 'KOL partnerships for product reviews', 'WhatsApp Business for repeat customer engagement'],
    ['Other Shopee/Lazada sellers: Fragmented, no brand loyalty', 'Retail stores: Higher prices, limited variety', 'Our moat: Brand trust, fast delivery, customer service', 'Price advantage from direct sourcing relationships'],
    ['Founder: 5 years e-commerce experience', 'Operations: Former Shopee category manager', 'Marketing: Social media specialist with 100K+ followers', 'Supply chain: 10 years sourcing from China/SEA'],
    ['Year 1: RM1.4M GMV, RM350K net profit', 'Year 2: RM3.6M GMV, RM900K net profit', 'Year 3: RM7.2M GMV, RM1.8M net profit', 'Expanding to own website and Singapore market'],
    ['Seeking: RM150,000 for inventory and marketing', 'Use: Mega sale inventory + warehouse expansion', 'Equity: 10-15%', 'Payback period: 12-18 months'],
    ['Thank you!', 'WhatsApp: [number]', 'Shopee: [store link]', 'Let us show you our best-selling products']
  ]),
  mk('digital-marketing-pitch', 'Digital Marketing Agency Pitch', 'Pitch for a digital marketing agency serving Malaysian SMEs', 'Marketing & Media', 'Megaphone', 'intermediate', 'Strategic investors, agency accelerators', [
    ['[Agency Name]', 'Data-Driven Digital Marketing for Malaysian SMEs', 'Kuala Lumpur | Established 2024', 'Tagline: Your Growth, Our Digital Expertise'],
    ['70% of Malaysian SMEs lack digital marketing expertise', 'SMEs waste RM5-10K/month on ineffective campaigns', 'Language barriers: Need multilingual content (BM, EN, Mandarin, Tamil)', 'Agencies either too expensive or too generic for local needs'],
    ['Full-service digital marketing tailored for Malaysian SMEs', 'Multilingual content creation (4 languages)', 'Performance-based pricing with guaranteed ROI', 'AI-powered campaign optimization'],
    ['1.2M Malaysian SMEs, 70% underserved digitally', 'SME digital marketing spend: RM3.5 billion annually', 'Average SME budget: RM2,000-10,000/month', 'Growing 20% annually as digital adoption increases'],
    ['Starter: RM2,500/month (social + basic ads)', 'Growth: RM5,000/month (full social + SEO + ads)', 'Enterprise: RM10,000+/month (dedicated team)', 'Performance bonus: 10% of revenue above target'],
    ['15 active retainer clients', 'RM45,000 monthly recurring revenue', 'Average client ROI: 3.5x ad spend', '95% client retention rate'],
    ['Free digital marketing audit as lead magnet', 'LinkedIn outreach to SME decision makers', 'Partnerships with business chambers (MCC, DCCC)', 'Content marketing: blog + social media presence'],
    ['Large agencies: Too expensive for SMEs', 'Freelancers: Inconsistent quality and availability', 'Our edge: SME-focused, multilingual, performance-based', 'Price: 50-70% cheaper than big agencies'],
    ['CEO: 10 years digital marketing, ex-Ogilvy', 'Creative Director: Award-winning content creator', 'Head of Performance: Google Ads certified, RM10M+ managed', 'Advisory: Former MDEC digital lead'],
    ['Year 1: RM600K revenue, 20 clients', 'Year 2: RM1.5M revenue, 40 clients', 'Year 3: RM3M revenue, 60 clients + team of 25', 'EBITDA margin: 25-30%'],
    ['Seeking: RM300,000 growth capital', 'Use: Team expansion + proprietary tool development', 'Equity: 15-20%', 'Target: 3x return in 36 months'],
    ['Thank you for your consideration!', 'Email: [email]', 'Website: [url]', 'Free audit available for interested partners']
  ]),
  mk('homestay-pitch', 'Homestay/Airbnb Pitch', 'Pitch for a homestay or short-term rental business in Malaysia', 'Tourism & Hospitality', 'Home', 'beginner', 'Property investors, REITs', [
    ['[Property Name]', 'Premium Homestay Experience in [Location]', 'Airbnb Superhost | Booking.com 9.2 Rating', 'Tagline: Your Malaysian Home Away From Home'],
    ['Hotels lack local authenticity and personal touch', 'Generic accommodations fail to showcase Malaysian culture', 'Travelers want Instagram-worthy stays with local experiences', 'Price-sensitive tourists need affordable quality options'],
    ['Curated homestay with Malaysian cultural experience', 'Instagram-worthy interiors with local design elements', 'Local experience guidebook and welcome hamper', 'Smart home features for seamless self check-in'],
    ['Malaysia: 26M+ tourist arrivals recovering strongly', 'Short-term rental market growing 15% annually', '[Location] attracts 2M+ visitors yearly', 'Domestic tourism spending: RM100+ billion'],
    ['Nightly rate: RM150-350 depending on season', 'Occupancy target: 70%+ annually', 'Weekly discount: 15%, Monthly: 30%', 'Additional revenue: experience packages, partnerships'],
    ['Operational since [date]', 'Average occupancy: 75%', 'Monthly revenue: RM4,500', 'Airbnb Superhost status achieved'],
    ['Multi-platform listing: Airbnb, Booking.com, Agoda, Traveloka', 'Social media: Instagram + TikTok showcasing property', 'SEO optimized listings with professional photography', 'Corporate stays: partnerships with local businesses'],
    ['Other Airbnb listings: Generic, no differentiation', 'Budget hotels: Less space, no kitchen, no personality', 'Our edge: Premium design + local experience + Superhost service', 'Competitive pricing vs hotels: 40-60% savings'],
    ['Founder: Hospitality management background', 'Interior Design: Award-winning local designer', 'Operations: Former hotel operations manager', 'Tech: Smart home integration specialist'],
    ['Year 1: RM54K revenue, 1 property', 'Year 2: RM180K revenue, 3 properties', 'Year 3: RM450K revenue, 7 properties', 'Net yield: 8-12% on property investment'],
    ['Seeking: RM200,000 for 2 additional properties', 'Use: Property setup, furnishing, initial marketing', 'Return: 10-15% annual yield + property appreciation', 'Projected property value appreciation: 5-8% annually'],
    ['Terima kasih! Thank you!', 'WhatsApp: [number]', 'Airbnb: [listing link]', 'Book a stay and experience it yourself!']
  ]),
  mk('saas-pitch', 'SaaS Startup Pitch', 'Pitch for a SaaS platform targeting Malaysian and ASEAN markets', 'Technology', 'Code2', 'advanced', 'VC firms, Cradle Fund, 500 Global', [
    ['[Product Name]', '[Category] SaaS for Southeast Asian SMEs', 'Built in Malaysia. Scaling to ASEAN.', 'Tagline: Enterprise Software, SME Pricing'],
    ['SMEs use spreadsheets and manual processes for [function]', 'Existing solutions are built for Western markets, too expensive', 'No affordable [category] solution in local languages', 'SMEs lose 20+ hours/week on inefficient workflows'],
    ['Cloud-based [category] platform built for Malaysian SMEs', 'Multilingual interface: BM, English, Mandarin', 'Affordable pricing starting from RM99/month', 'Integration with local tools: LHDN e-Invoice, DuitNow, FPX'],
    ['ASEAN SaaS market: USD 5B by 2027', 'Malaysia TAM: 800K SMEs x RM300/month = RM2.9B ARR potential', 'Current penetration: Only 15% use cloud [category] tools', 'Growing 25% CAGR as SMEs digitalize post-pandemic'],
    ['Freemium: Free for up to 5 users', 'Starter: RM99/month per user', 'Professional: RM299/month per user', 'Enterprise: Custom pricing with SLA'],
    ['500 beta users, 50 paying customers', 'RM25K MRR growing 20% MoM', 'MDEC MSC status approved', 'Partnership with [major local company]'],
    ['Product-led growth with free trial', 'Content marketing + SEO for organic acquisition', 'Partnerships with accounting firms', 'MDEC and MAGIC startup programs'],
    ['Global SaaS: Too expensive, not localized', 'Local competitors: Limited features, poor UX', 'Our moat: Local-first design, affordable, integrated', 'First-mover in Malaysia [category] SaaS'],
    ['CEO: Ex-[major tech company], 15 years product', 'CTO: Built platforms handling 1M+ users', 'Head of Sales: Former Microsoft Malaysia enterprise lead', 'Advisors: MDEC board member, ex-CFO of public company'],
    ['Year 1: RM300K ARR, 100 customers', 'Year 2: RM1.8M ARR, 500 customers', 'Year 3: RM6M ARR, 1,500 customers', 'Path to profitability: Month 30'],
    ['Seeking: RM2M Series Seed', 'Use: Engineering team + sales expansion + ASEAN launch', 'Equity: 15-20%', 'Target: 10x return in 5 years via Series B+'],
    ['Thank you for your time!', 'Email: [email]', 'Demo available at [url]', 'Let us show you the product live']
  ]),
  mk('agritech-pitch', 'AgriTech Palm Oil Pitch', 'Pitch for an AgriTech solution for the Malaysian palm oil industry', 'Agriculture & Technology', 'Sprout', 'advanced', 'AgriTech VCs, MIDA, palm oil industry investors', [
    ['[Company Name]', 'Smart Palm Oil: IoT + AI for Sustainable Plantations', 'MPOB Licensed | MSPO Certified', 'Tagline: Technology for Sustainable Palm Oil'],
    ['Palm oil yields declining 10-15% due to aging trees and climate', 'Manual monitoring misses 30% of crop health issues', 'Labor shortage: 80% of plantations report worker deficit', 'EUDR compliance requires traceability from seed to oil'],
    ['IoT sensors for real-time soil and crop monitoring', 'Drone imaging with AI-powered disease detection', 'Yield prediction with 90%+ accuracy', 'Blockchain traceability for EUDR and RSPO compliance'],
    ['Malaysia palm oil: RM70+ billion industry', 'Global sustainable palm oil demand growing 20% annually', 'AgriTech TAM: RM2 billion in Malaysia alone', 'ASEAN palm oil: 85% of global production'],
    ['SaaS subscription: RM500-2,000/hectare/year', 'Data analytics premium: RM5,000-10,000/plantation', 'Consulting and implementation fees', 'Government grants: MIDA and MPOB co-funding available'],
    ['3 pilot plantations operational', '25% yield improvement demonstrated', 'RM500K in MPOB research grants secured', 'MOU with 2 major plantation groups'],
    ['Direct sales to plantation groups (>1,000 hectares)', 'MPOB partnership for industry endorsement', 'Industry conferences: PIPOC, MPOB International', 'Pilot program with free 3-month trial'],
    ['Traditional monitoring: Manual, slow, inaccurate', 'Satellite imaging: Low resolution, weather-dependent', 'Our edge: Ground-level IoT + drone + AI = precision', 'Cost: 60% less than satellite solutions'],
    ['CEO: 15 years plantation management, MPOB certified', 'CTO: IoT specialist, ex-Huawei smart agriculture', 'Head of AI: PhD in computer vision, 10 papers published', 'Advisor: Former MPOB Director General'],
    ['Year 1: RM1M revenue, 10 plantation clients', 'Year 2: RM5M revenue, 50 clients', 'Year 3: RM15M revenue, 150 clients', 'Target: 1 million hectares monitored by Year 5'],
    ['Seeking: RM5M Series A', 'Use: Team expansion, R&D, and scale to 50+ plantations', 'Equity: 15-20%', 'MIDA tax incentives available for green tech investors'],
    ['Thank you!', 'Email: [email]', 'Website: [url]', 'Visit our pilot plantation for a live demo']
  ]),
  mk('islamic-fintech-pitch', 'Islamic FinTech Pitch', 'Pitch for a Shariah-compliant FinTech platform', 'Finance & Technology', 'Landmark', 'advanced', 'Islamic finance VCs, BNM, institutional investors', [
    ['[Platform Name]', 'Shariah-Compliant [Product] for Malaysian Muslims', 'BNM Sandbox | Shariah Advisory Board', 'Tagline: Halal Finance, Digital Future'],
    ['60% of Malaysian Muslims want Shariah-compliant financial products', 'Current Islamic banking: Complex, slow, not digital-native', 'Muslim millennials: Underserved by conventional and Islamic banks', 'No micro-investment/crowdfunding platform is fully Shariah-compliant'],
    ['Mobile-first Shariah-compliant [product]', 'Transparent profit-sharing (Mudarabah/Wakalah)', 'Zakat calculator and automatic deduction', 'Shariah board oversight on every transaction'],
    ['Malaysia Islamic banking: RM3.5 trillion assets', 'Islamic finance penetration: 40% of total banking', 'Muslim millennials: 10 million underserved in Malaysia', 'Global Islamic FinTech: USD 5B+ market by 2026'],
    ['Management fee: 1-1.5% AUM (Wakalah)', 'Profit sharing: 70:30 (Mudarabah)', 'Transaction fees: RM1-5 per transaction', 'Premium features: RM19.90/month'],
    ['5,000 beta users signed up', 'RM2M AUM in pilot phase', 'Shariah board fully constituted with 3 scholars', 'BNM sandbox application submitted'],
    ['Mosque partnerships for community trust', 'Islamic school alumni networks', 'Ramadan campaigns and Zakat integration', 'Social media: Islamic finance education content'],
    ['Islamic banks: Not digital-native, slow onboarding', 'Conventional FinTech: Not Shariah-compliant', 'Our moat: Shariah-first + digital-native + affordable', 'Regulatory advantage: BNM supportive of Islamic FinTech'],
    ['CEO: 10 years Islamic banking, ex-Maybank Islamic', 'CTO: Built 3 FinTech platforms, PCI-DSS certified', 'Head of Shariah: Certified Shariah advisor, ASC member', 'Board: Former BNM deputy governor, 2 finance professors'],
    ['Year 1: RM10M AUM, 10K users', 'Year 2: RM50M AUM, 50K users', 'Year 3: RM200M AUM, 200K users', 'Revenue: 1.5% of AUM = RM3M by Year 3'],
    ['Seeking: RM5M seed round', 'Use: BNM licensing, tech development, user acquisition', 'Equity: 15-20%', 'Co-investment from BNM and Islamic finance institutions available'],
    ['Jazakallahu khairan!', 'Email: [email]', 'Website: [url]', 'Shariah compliance certificate available for review']
  ]),
  mk('travel-pitch', 'Tour & Travel Pitch', 'Pitch for a tour and travel agency in Malaysia', 'Tourism & Hospitality', 'Plane', 'intermediate', 'Tourism investors, hotel groups', [
    ['[Agency Name]', 'Curated Malaysian Travel Experiences', 'MOTAC Licensed | MATTA Member', 'Tagline: Discover Malaysia Like Never Before'],
    ['Tourists get generic package tours, missing authentic experiences', 'Domestic travelers lack curated adventure and eco-tourism options', 'Muslim-friendly travel: Growing demand, limited supply', 'Sustainable tourism: No platform promotes eco-certified operators'],
    ['Curated experiential tours with local community engagement', 'Muslim-friendly travel packages (prayer facilities, halal food)', 'Sustainable tourism with carbon offset program', 'Digital booking platform with instant confirmation'],
    ['Malaysia tourism: 30M+ arrivals target', 'Domestic travel: RM100+ billion spending', 'Muslim travel market: USD 200B globally', 'Eco-tourism growing 15% annually in Sabah/Sarawak'],
    ['Day tours: RM120-200/pax', 'Multi-day packages: RM600-1,500/pax', 'Corporate team building: RM150-300/pax', 'Commission from hotel/activity partners: 15-25%'],
    ['500+ tourists served', '4.8 rating on TripAdvisor', 'MOTAC licensed and MATTA member', 'Partnership with 20+ hotels and activity providers'],
    ['Klook, Viator, TripAdvisor listings', 'Social media: Instagram + TikTok travel content', 'Corporate HR partnerships for team building', 'China market: WeChat and Xiaohongshu marketing'],
    ['Traditional agencies: Outdated, non-digital', 'Online OTAs: No curation, no personal touch', 'Our edge: Curated experiences + digital convenience + local insight', 'Price: 20-30% below traditional agencies for same quality'],
    ['Founder: 12 years tourism, ex-MATTA committee member', 'Operations: Former Malaysian Airlines experience manager', 'Digital: Built 2 travel booking platforms', 'Guides: 5 MOTAC-certified, multilingual team'],
    ['Year 1: RM800K revenue, 2,000 pax', 'Year 2: RM2M revenue, 5,000 pax', 'Year 3: RM4.5M revenue, 10,000 pax', 'Net margin: 15-20%'],
    ['Seeking: RM500K growth capital', 'Use: Digital platform development + marketing', 'Equity: 15-20%', 'Expected return: 3-5x in 4 years'],
    ['Terima kasih! Thank you!', 'Email: [email]', 'Website: [url]', 'Complimentary city tour for interested investors']
  ]),
  mk('fnb-franchise-pitch', 'F&B Franchise Pitch', 'Pitch for acquiring or developing a food franchise in Malaysia', 'Food & Beverage', 'Store', 'intermediate', 'Franchise investors, F&B industry', [
    ['[Brand Name] Franchise', 'Proven F&B Model, Malaysian Market', 'MFA Member | Halal Certified', 'Tagline: Scale What Works'],
    ['Starting a restaurant from scratch: 50% failure rate', 'Brand building takes 3-5 years and RM500K+', 'Quality consistency is impossible without systems', 'First-time F&B operators lack industry knowledge'],
    ['Turnkey franchise with proven brand and systems', 'Central kitchen and supply chain included', 'JAKIM Halal certified brand', 'Comprehensive training and ongoing support'],
    ['Malaysia F&B franchise: RM15+ billion market', 'Franchise success rate: 85% vs 50% independent', '1,000+ new franchise outlets opening annually', 'Quick-service segment growing 12% annually'],
    ['Franchise fee: RM50K-150K per outlet', 'Royalty: 5-8% of gross sales', 'Average outlet revenue: RM80K-150K/month', 'Net margin: 15-25% per outlet'],
    ['[X] outlets currently operating', 'Average outlet revenue: RM100K/month', 'Customer satisfaction: 4.7 stars', 'Payback period: 18-24 months per outlet'],
    ['Strategic locations: Malls, LRT/MRT stations, office areas', 'Delivery platform integration from day one', 'Grand opening marketing support', 'National brand campaigns by franchisor'],
    ['Independent stalls: No brand recognition, inconsistent', 'Other franchises: Higher entry cost, less support', 'Our model: Lower investment, faster ROI, proven system', 'Local brand advantage: Menu designed for Malaysian palate'],
    ['Franchise Director: 15 years F&B operations', 'Head Chef: Celebrity Malaysian chef', 'Operations Manager: ex-KFC Malaysia regional manager', 'Marketing: Former MDec food brand consultant'],
    ['Year 1: RM2.4M revenue (2 outlets)', 'Year 2: RM6M revenue (5 outlets)', 'Year 3: RM15M revenue (12 outlets)', 'Group EBITDA margin: 20%+'],
    ['Seeking: RM500K for 2 franchise outlets', 'Use: Franchise fee + renovation + working capital', 'Return: 25-35% annual ROI per outlet', 'Expansion rights available for additional territory'],
    ['Thank you for your interest!', 'Email: [email]', 'Website: [url]', 'Food tasting session available']
  ]),
  mk('telemedicine-pitch', 'Telemedicine Pitch', 'Pitch for a digital health platform in Malaysia', 'Healthcare & Technology', 'Heart', 'advanced', 'Healthcare VCs, pharmaceutical companies, MOH', [
    ['[Platform Name]', 'Accessible Healthcare for Every Malaysian', 'MOH Compliant | MDA Registered', 'Tagline: Health at Your Fingertips'],
    ['30% of Malaysians in rural areas lack specialist access', 'Average wait time: 3 hours at government clinics', 'Chronic disease patients need regular follow-ups', 'Mental health: 1 psychiatrist per 100K population'],
    ['Video consultations with licensed doctors (RM50-150)', 'E-prescriptions delivered to your door', 'AI symptom checker for triage', 'Chronic disease management with remote monitoring'],
    ['Malaysia healthcare: RM60+ billion annually', 'Telemedicine: Post-pandemic 300% growth', 'Digital health TAM: RM5 billion in Malaysia', 'ASEAN digital health: USD 10B by 2027'],
    ['Consultation fees: RM50-150 per session', 'Subscription: RM29-79/month (unlimited GP)', 'E-prescription delivery: RM10-15 per order', 'Corporate plans: RM20-50/employee/month'],
    ['200+ licensed doctors on platform', '5,000+ consultations completed', '4.8 star patient satisfaction rating', 'Partnership with 3 major pharmacy chains'],
    ['Corporate partnerships for employee health benefits', 'Insurance panel integration (Prudential, AIA)', 'SEO + content marketing on health topics', 'Community health webinars and free screenings'],
    ['DoctorOnCall: General telemedicine, limited specializations', 'Hospitals: High cost, long wait times', 'Our edge: Specialist focus + AI triage + medicine delivery', 'Price: 50-70% cheaper than physical specialist visits'],
    ['CEO: Medical doctor + MBA, 10 years clinical practice', 'CTO: Ex-Philips Healthcare tech lead', 'CMO: Former MOH public health director', 'Advisory: 3 specialist doctors (cardiology, psych, GP)'],
    ['Year 1: RM3M revenue, 10K consultations', 'Year 2: RM12M revenue, 50K consultations', 'Year 3: RM30M revenue, 150K consultations', 'Path to profitability: Month 24'],
    ['Seeking: RM5M Series A', 'Use: Doctor acquisition, tech development, marketing', 'Equity: 15-20%', 'MOH digital health grants available as co-investment'],
    ['Thank you for caring about Malaysian healthcare!', 'Email: [email]', 'Website: [url]', 'Free health screening for interested investors']
  ]),
  mk('edtech-pitch', 'EdTech Platform Pitch', 'Pitch for an online education platform for Malaysian students', 'Education & Technology', 'GraduationCap', 'intermediate', 'EdTech VCs, education ministry, angel investors', [
    ['[Platform Name]', 'Learn Smarter, Score Better', 'SPM-Focused | MOE Aligned', 'Tagline: Every Student Deserves Quality Education'],
    ['School tuition costs RM200-500/month per subject', 'Rural students: No access to quality tutors', 'SPM format changes confuse students and parents', 'One-size-fits-all learning does not work for everyone'],
    ['AI-personalized learning paths for SPM students', 'Live + on-demand classes by top Malaysian teachers', 'SPM question bank with AI-powered analysis', 'Affordable: RM49-99/month vs RM200-500 for tuition'],
    ['Malaysia education spending: RM60+ billion', 'Private tuition market: RM4+ billion annually', '5M+ students in primary and secondary school', 'Online learning adoption: 80% post-pandemic'],
    ['Freemium: Basic content free', 'Student Plan: RM49/month', 'Premium Plan: RM99/month (live classes + mentoring)', 'School License: RM5,000-15,000/year per school'],
    ['10,000 registered students', '2,000 paying subscribers', 'RM100K MRR', 'MOE-approved content for SPM subjects'],
    ['School partnerships for bulk licensing', 'Social media: TikTok study tips + YouTube tutorials', 'Parent WhatsApp groups and referrals', 'SPM results marketing: Showcase top student improvements'],
    ['Traditional tuition centers: Expensive, fixed schedule', 'YouTube: Free but unstructured, no accountability', 'Our moat: MOE-aligned curriculum + AI personalization + affordable', 'Local content: BM, English, Mandarin, Tamil'],
    ['CEO: Former teacher, 10 years in education', 'CTO: Built learning platforms, AI/ML specialist', 'Content Head: Ex-MOE curriculum developer', 'Advisors: 3 former school principals, 1 UMN education professor'],
    ['Year 1: RM1.2M revenue, 5K subscribers', 'Year 2: RM4.8M revenue, 20K subscribers', 'Year 3: RM12M revenue, 50K subscribers', 'Break-even: Month 18, then 30%+ margins'],
    ['Seeking: RM2M seed round', 'Use: Content creation, AI development, school partnerships', 'Equity: 15-20%', 'MDEC and MOE grants available for EdTech'],
    ['Terima kasih!', 'Email: [email]', 'Website: [url]', 'Free trial available for all investors']
  ]),
  mk('property-pitch', 'Property Development Pitch', 'Pitch for a property development project in Malaysia', 'Real Estate', 'Building2', 'advanced', 'REITs, property funds, HNWI investors', [
    ['[Project Name]', 'Prime Development in [Location]', 'CIDB G7 | REHDA Member', 'Tagline: Building Malaysia Future'],
    ['Housing shortage: 1 million units deficit in Malaysia', 'Young professionals priced out of urban homeownership', 'Commercial space demand growing in tier-2 cities', 'Sustainable building requirements increasing costs'],
    ['Mixed-use development: Affordable residential + commercial', 'Green building certification (GBI) for sustainability', 'Smart home features as standard', 'Community-centric design with amenities'],
    ['Malaysia property market: RM300+ billion annually', 'Affordable housing demand: 1 million units', '[Location] property prices growing 5-8% annually', 'Commercial rental yield: 6-8% in prime areas'],
    ['Residential sales: RM300K-800K per unit', 'Commercial rental: RM5-15/sqft/month', 'Property management fees: 5-8% of rental', 'Facilities management: Recurring revenue stream'],
    ['Land acquisition completed', 'Planning approval from local council', 'Pre-launch: 30% units reserved', 'Project financing from [bank] secured'],
    ['REHDA and property expo participation', 'Digital marketing: PropertyGuru, iProperty listings', 'Showroom and virtual tour experience', 'Bank panel partnerships for mortgage financing'],
    ['Other developers: Higher pricing, less value', 'Subsale market: Older properties, no smart features', 'Our edge: Affordable + sustainable + smart home', 'Location advantage: Near MRT/LRT and amenities'],
    ['Managing Director: 20 years property development, CIDB G7', 'Project Director: Ex-SP Setia, 15 projects delivered', 'Architect: Award-winning, GBI certified designer', 'Finance: Former Maybank property finance head'],
    ['GDV: RM200 million', 'Phase 1: RM80M (Year 1-2)', 'Phase 2: RM120M (Year 3-4)', 'Projected IRR: 18-25%'],
    ['Seeking: RM20M equity participation', 'Use: Land payment + construction + marketing', 'Return: 18-25% IRR over 4 years', 'Security: Land collateral + bank guarantee'],
    ['Thank you!', 'Email: [email]', 'Showroom: [address]', 'Site visit available upon request']
  ]),
  mk('logistics-pitch', 'Last-Mile Delivery Pitch', 'Pitch for a logistics and last-mile delivery startup in Malaysia', 'Logistics & Transportation', 'Truck', 'intermediate', 'Logistics VCs, e-commerce companies', [
    ['[Company Name]', 'Fast, Reliable Last-Mile Delivery Across Malaysia', 'LPKP Licensed | Integrated with Shopee/Lazada', 'Tagline: Delivering Malaysia, One Package at a Time'],
    ['Last-mile delivery: 40% of total logistics cost', 'East Malaysia: 5-7 day delivery vs 1-2 in Peninsular', 'E-commerce sellers struggle with fulfillment reliability', 'No affordable same-day delivery option for SME sellers'],
    ['Same-day delivery in Klang Valley (RM8-15)', '2-day delivery to major cities nationwide', 'Affordable East Malaysia coverage (3-4 days)', 'API integration with Shopee, Lazada, and custom stores'],
    ['Malaysia logistics: RM80+ billion market', 'Last-mile segment: RM8 billion growing 20% annually', 'E-commerce parcel volume: 500M+ annually', 'Same-day delivery market: RM1.5 billion opportunity'],
    ['Per-parcel delivery fee: RM5-15', 'Monthly subscription: RM299 (up to 50 parcels)', 'Enterprise custom pricing for high-volume sellers', 'Value-added: COD handling, returns management, insurance'],
    ['500+ daily parcels delivered', '98.5% on-time delivery rate', 'Integrated with 2,000+ sellers', 'Coverage: Peninsular Malaysia + Sabah/Sarawak major cities'],
    ['Shopee/Lazada seller onboarding program', 'API integration for e-commerce platforms', 'Agent network for parcel drop-off points', 'Corporate partnerships for bulk shipping'],
    ['PosLaju: Slow, inconsistent tracking', 'J&T: Volume-focused, limited same-day', 'Ninjavan: Higher pricing, limited SME focus', 'Our edge: SME-focused, same-day, affordable East MY coverage'],
    ['CEO: 12 years logistics, ex-DHL Malaysia', 'COO: Former J&T operations director', 'CTO: Built tracking systems for 3 logistics companies', 'Head of Network: Ex-PosLaju regional manager'],
    ['Year 1: RM5M revenue, 1K daily parcels', 'Year 2: RM15M revenue, 5K daily parcels', 'Year 3: RM40M revenue, 15K daily parcels', 'Break-even: Month 15'],
    ['Seeking: RM3M Series A', 'Use: Fleet expansion, technology, hub development', 'Equity: 15-20%', 'MIDA logistics incentive available'],
    ['Thank you!', 'Email: [email]', 'Website: [url]', 'Free pilot for 100 parcels for interested partners']
  ]),
  mk('halal-mfg-pitch', 'Halal Manufacturing Pitch', 'Pitch for a halal food manufacturing business in Malaysia', 'Manufacturing', 'Factory', 'advanced', 'Manufacturing investors, halal industry funds', [
    ['[Company Name]', 'Premium Halal Manufacturing for Global Markets', 'JAKIM Certified | HACCP | GMP', 'Tagline: Halal Excellence, Global Standard'],
    ['Global halal food market: USD 2 trillion, growing 10% annually', 'Malaysia halal exports: Only 5% of global share despite leadership', 'SME manufacturers lack JAKIM certification expertise', 'Quality inconsistency damages Malaysia halal brand reputation'],
    ['JAKIM-certified manufacturing with full traceability', 'HACCP + GMP + ISO 22000 certified processes', 'Export-ready packaging for 50+ countries', 'R&D for innovative halal product development'],
    ['Global halal market: USD 2 trillion by 2027', 'Malaysia halal export: RM50+ billion target', 'OIC countries: 1.8 billion Muslim consumers', 'Non-OIC demand: Growing 15% annually (Europe, China, India)'],
    ['Contract manufacturing: RM5-15/unit depending on product', 'Own-brand products: 40-60% gross margin', 'Export premium: 20-40% above domestic pricing', 'Annual contracts with minimum order commitments'],
    ['JAKIM Halal certification obtained', 'HACCP and GMP certified facility', '5 export contracts signed (Middle East, Singapore)', 'Annual production capacity: 5 million units'],
    ['MIHAS and MIHAS Connect participation', 'HDC (Halal Development Corporation) partnership', 'Trade missions to OIC countries', 'B2B digital marketplace listings'],
    ['Other halal manufacturers: Limited scale, inconsistent quality', 'Multinational halal: Higher cost, less flexibility', 'Our edge: Scale + quality + certification expertise + export network', 'Price: 20-30% below multinational competitors'],
    ['CEO: 20 years food manufacturing, ex-Nestle', 'Head of Quality: JAKIM panel member, 15 years certification', 'Export Director: Former MATRADE trade commissioner', 'R&D: Food scientist with 5 patents'],
    ['Year 1: RM10M revenue, domestic focus', 'Year 2: RM25M revenue, 5 export markets', 'Year 3: RM60M revenue, 15 export markets', 'Net margin: 12-18%'],
    ['Seeking: RM8M for factory expansion and export', 'Use: Production line upgrade + halal park facility + export marketing', 'Equity: 20-25%', 'MIDA manufacturing incentive + HDC grants available'],
    ['Thank you!', 'Email: [email]', 'Factory visit: [address]', 'Product samples available for tasting']
  ]),
  mk('solar-pitch', 'Solar Energy Pitch', 'Pitch for a solar energy and renewable solutions company in Malaysia', 'Energy & Sustainability', 'Sun', 'advanced', 'Green energy funds, MIDA, institutional investors', [
    ['[Company Name]', 'Powering Malaysia with Clean Solar Energy', 'SEDA Registered | MIDA Green Tech Certified', 'Tagline: Sunshine into Savings'],
    ['Malaysia electricity tariff rising 10-15% annually for commercial', 'TNB grid dependency: No energy security', 'Corporate ESG commitments require renewable energy adoption', 'SEDA NEM 3.0 quota filling fast - urgency to act now'],
    ['Rooftop solar installation with zero upfront cost (PPA model)', '25-year performance guarantee', 'Smart monitoring system with real-time ROI tracking', 'Battery storage solutions for energy independence'],
    ['Malaysia solar market: RM8+ billion by 2026', 'NEM program: 1,800 MW allocated capacity', 'Commercial solar: 50,000+ eligible buildings', 'LSS (Large Scale Solar): RM5 billion in government tenders'],
    ['PPA: RM0.25-0.35/kWh (vs TNB RM0.40-0.55)', 'Direct sales: RM3-5/watt installed capacity', 'O&M contracts: RM0.05/kWh annually', 'Carbon credit revenue: RM20-50/tonne CO2'],
    ['50+ installations completed (15MW total)', 'RM2M annual recurring PPA revenue', 'Average customer savings: 25-35% on electricity', '0 equipment failures in 24 months'],
    ['SEDA registered installer network', 'Partnership with TNB for grid connection', 'Corporate ESG consulting as lead-in', 'Industry associations: MPIA, REHDA, FGCC'],
    ['Other solar installers: Small scale, no financing options', 'Self-install: Complex permitting and grid connection', 'Our edge: Zero upfront PPA + guaranteed savings + monitoring', 'Scale advantage: Better panel pricing from bulk procurement'],
    ['CEO: 15 years energy sector, ex-TNB engineering', 'CTO: Solar engineer, NABCEP certified', 'Finance: Structured RM100M+ in green financing', 'Operations: 50+ certified installation teams'],
    ['Year 1: RM15M revenue, 20MW installed', 'Year 2: RM40M revenue, 50MW installed', 'Year 3: RM80M revenue, 100MW installed', 'PPA portfolio value: RM200M+ by Year 5'],
    ['Seeking: RM10M growth equity', 'Use: PPA project financing + team + warehouse', 'Equity: 15-20%', 'Green tech tax incentives from MIDA available'],
    ['Thank you for supporting green energy!', 'Email: [email]', 'Website: [url]', 'Free solar ROI assessment for interested investors']
  ]),
  mk('aquaculture-pitch', 'Aquaculture Pitch', 'Pitch for an aquaculture and seafood farming business in Malaysia', 'Agriculture & Technology', 'Fish', 'intermediate', 'AgriTech investors, seafood industry', [
    ['[Company Name]', 'Sustainable Seafood Farming for Malaysia', 'DOF Licensed | MyGAP Certified', 'Tagline: Farming the Future of Seafood'],
    ['Malaysia imports 60% of seafood consumption', 'Wild catch declining 5% annually due to overfishing', 'Seafood prices rising 10-15% yearly', 'Food security: Aquaculture must fill the 400K tonne gap'],
    ['Recirculating Aquaculture System (RAS) technology', 'Sustainable farming with 95% water recycling', 'Traceable from farm to table with blockchain', 'MyGAP certified for quality assurance'],
    ['Malaysia seafood market: RM20+ billion', 'Aquaculture: RM6 billion growing 12% annually', 'Import substitution: 400K tonnes opportunity', 'Premium market: Organic/sustainable seafood 30% price premium'],
    ['Wholesale: RM15-30/kg depending on species', 'Retail/premium: RM35-80/kg for sustainable certified', 'Export (Singapore, Hong Kong): 40-60% premium', 'By-products: Fish meal, fertilizer (RM2-5/kg)'],
    ['100 tonnes annual production', 'MyGAP certification obtained', 'Supply agreements with 5 restaurant chains', 'RAS system operating at 95% water recycling'],
    ['Direct supply to restaurants and hotels', 'Online D2C: Fresh seafood delivery', 'Export through MATRADE channels', 'Supermarket partnerships (Jaya Grocer, Village Grocer)'],
    ['Traditional pond farming: Low yield, environmental damage', 'Imported seafood: Quality concerns, no traceability', 'Our edge: RAS technology + sustainability + traceability', 'Price: Competitive with imports, premium over pond-farmed'],
    ['Founder: Marine biology PhD, 15 years aquaculture', 'Operations: Former DOF aquaculture officer', 'Tech: RAS system designer, 3 installations', 'Sales: 10 years seafood industry, ex-Tsukiji Market buyer'],
    ['Year 1: RM3M revenue, 100 tonnes', 'Year 2: RM8M revenue, 300 tonnes', 'Year 3: RM20M revenue, 800 tonnes', 'Net margin: 20-25%'],
    ['Seeking: RM5M for farm expansion', 'Use: RAS system expansion + cold chain + export', 'Equity: 15-20%', 'DOF and MIDA incentives for aquaculture available'],
    ['Thank you!', 'Email: [email]', 'Farm visit available in [location]', 'Fresh seafood tasting for interested investors']
  ]),
  mk('creative-pitch', 'Creative Content Studio Pitch', 'Pitch for a creative content and production studio in Malaysia', 'Marketing & Media', 'Palette', 'intermediate', 'Media investors, advertising agencies, brands', [
    ['[Studio Name]', 'Stories That Move Malaysia', 'FINAS Licensed | MDEC Creative Certified', 'Tagline: Create. Captivate. Convert.'],
    ['Brands struggle to create consistent, quality content', 'Social media demands 20+ pieces of content monthly', 'Malaysian content needs cultural sensitivity across races', 'Video production costs RM10K-50K per project, unaffordable for SMEs'],
    ['End-to-end content creation: Strategy to production', 'Multilingual content in BM, English, Mandarin, Tamil', 'AI-enhanced production for faster, affordable output', 'Monthly retainer model: Predictable cost for brands'],
    ['Malaysia creative industry: RM30+ billion', 'Digital content market: RM5 billion growing 25%', 'Social media ad spend: RM3.5 billion annually', 'Video content demand: 80% of internet traffic'],
    ['Content retainer: RM3,000-15,000/month', 'Project-based: RM5,000-50,000 per production', 'Licensing and royalties: Recurring revenue', 'Training workshops: RM500-2,000 per participant'],
    ['20 active retainer clients', '100+ videos produced', '2 Kancil Awards nominations', 'RM200K monthly revenue'],
    ['Social media showcase of portfolio', 'Partnerships with advertising agencies', 'MDEC creative industry programs', 'Brand ambassador and influencer collaborations'],
    ['Traditional agencies: Expensive, slow turnaround', 'Freelancers: Inconsistent quality and availability', 'Our edge: Speed + quality + multilingual + affordable', 'AI tools: 50% faster production than traditional studios'],
    ['Creative Director: 15 years, ex-Ogilvy Creative', 'Head of Production: FINAS certified, 200+ productions', 'AI Lead: Specialized in AI video and image generation', 'Accounts: Former advertising agency account director'],
    ['Year 1: RM2.4M revenue', 'Year 2: RM6M revenue', 'Year 3: RM12M revenue', 'EBITDA margin: 20-25%'],
    ['Seeking: RM1M growth capital', 'Use: Studio expansion + AI tools + team', 'Equity: 15-20%', 'MDEC creative industry grants available'],
    ['Thank you!', 'Email: [email]', 'Portfolio: [url]', 'Live demo of AI content creation available']
  ]),
  mk('coworking-pitch', 'Coworking Space Pitch', 'Pitch for a coworking space business in Malaysia', 'Real Estate', 'Users', 'intermediate', 'Property investors, REITs, startup ecosystem', [
    ['[Space Name]', 'Where Malaysia Innovators Connect', 'MDEC Partner | 99% Occupancy Rate', 'Tagline: Your Office, Your Community'],
    ['Startups and freelancers pay RM2-5K/month for traditional offices', 'Remote workers lack professional meeting spaces', 'Isolation kills productivity and networking for solopreneurs', 'Flexible workspace needed as hybrid work becomes permanent'],
    ['Flexible coworking from RM199/month', 'Community events and networking programs', 'MDEC partnership for tech startup perks', 'Premium amenities: High-speed WiFi, meeting rooms, pantry'],
    ['Malaysia flexible workspace: RM500M+ market', 'Coworking growing 15% annually', '500K+ freelancers and solopreneurs in Malaysia', 'Hybrid work: 60% of companies adopt flexible policies'],
    ['Hot desk: RM199-399/month', 'Dedicated desk: RM499-799/month', 'Private office: RM1,500-5,000/month', 'Virtual office: RM99-199/month'],
    ['99% occupancy rate at flagship location', '500+ active members', '50+ events hosted annually', 'RM300K monthly revenue'],
    ['MDEC startup ecosystem partnerships', 'Community events and workshops', 'Corporate flex-work partnerships', 'University entrepreneurship programs'],
    ['Common Ground, WORQ: Established but premium pricing', 'Home office: Free but unprofessional', 'Our edge: Community-first + affordable + MDEC perks', 'Price: 30-40% below premium competitors'],
    ['Founder: Former WeWork community manager', 'Operations: 10 years commercial real estate', 'Community: Startup ecosystem builder, ex-MAGIC', 'Tech: PropTech developer for space management'],
    ['Year 1: RM3.6M revenue, 1 location', 'Year 2: RM9M revenue, 3 locations', 'Year 3: RM20M revenue, 6 locations', 'Net yield: 12-15% on property investment'],
    ['Seeking: RM3M for 2 new locations', 'Use: Fit-out, deposit, initial operations', 'Equity: 15-20%', 'Expected return: 15-20% annual yield'],
    ['Thank you!', 'Email: [email]', 'Website: [url]', 'Free day pass available for interested investors']
  ]),
  mk('rubber-pitch', 'Rubber Products Pitch', 'Pitch for a rubber and latex products manufacturing business in Malaysia', 'Manufacturing', 'Circle', 'intermediate', 'Manufacturing investors, medical industry', [
    ['[Company Name]', 'World-Class Rubber Products from Malaysia', 'MRB Licensed | ISO 13485 | FDA Registered', 'Tagline: Malaysia Rubber, Global Standard'],
    ['Malaysia is 5th largest natural rubber producer but exports mostly raw material', 'Global glove market: USD 30B+ post-pandemic', 'Medical device demand growing 12% annually', 'Sustainable rubber: EUDR and ESG compliance requirements'],
    ['Value-added rubber products (gloves, condoms, medical devices)', 'MRB-certified sustainable rubber sourcing', 'ISO 13485 medical device manufacturing', 'FDA and CE certified for export markets'],
    ['Global rubber product market: USD 100+ billion', 'Malaysia rubber export: RM30+ billion', 'Medical gloves: USD 30 billion growing 8% annually', 'Condom market: USD 10 billion, 6% annual growth'],
    ['Medical gloves: RM0.10-0.20/piece', 'Condoms: RM0.30-0.80/piece', 'Industrial rubber: RM5-50/kg', 'Surgical products: RM1-10/piece'],
    ['2 production lines operational', 'MRB and ISO 13485 certified', 'Export to 15 countries', 'Monthly capacity: 50 million pieces'],
    ['MRB industry network and trade missions', 'MREPC (Malaysian Rubber Export Promotion Council)', 'Medical device exhibitions (FMM, ARAB HEALTH)', 'Distributors in 15 countries'],
    ['Top Glove, Hartalega: Scale advantage but commodity focus', 'Chinese manufacturers: Lower quality, ESG concerns', 'Our edge: Specialty products + sustainability + medical grade', 'Price premium: 15-25% for sustainable certified products'],
    ['CEO: 20 years rubber industry, ex-Top Glove senior manager', 'Quality: ISO 13485 lead auditor certified', 'Export: Former MATRADE trade commissioner', 'R&D: Rubber technologist, 3 patents'],
    ['Year 1: RM15M revenue', 'Year 2: RM40M revenue', 'Year 3: RM80M revenue', 'Net margin: 12-18%'],
    ['Seeking: RM10M for production expansion', 'Use: New production lines + certifications + export expansion', 'Equity: 15-20%', 'MIDA manufacturing incentive + MRB grants available'],
    ['Thank you!', 'Email: [email]', 'Factory: [address]', 'Product samples available for quality review']
  ]),
  mk('smart-mfg-pitch', 'Smart Manufacturing Pitch', 'Pitch for an Industry 4.0 smart manufacturing company in Malaysia', 'Manufacturing', 'Cpu', 'advanced', 'Industry 4.0 VCs, MIDA, manufacturing conglomerates', [
    ['[Company Name]', 'Industry 4.0 Solutions for Malaysian Manufacturers', 'MIDA Industry4WRD | MARii Certified', 'Tagline: Smart Manufacturing, Smarter Malaysia'],
    ['Malaysian manufacturers lag in Industry 4.0 adoption (< 20%)', 'Manual processes cause 15-25% production waste', 'Skills gap: 60% of factory workers need upskilling', 'Global competition: ASEAN neighbors investing heavily in automation'],
    ['IoT-enabled factory monitoring and analytics', 'AI-powered predictive maintenance (reduce downtime 30%)', 'Digital twin technology for process optimization', 'Modular solutions: Start small, scale as ROI proves out'],
    ['Malaysia manufacturing: RM300+ billion GDP contribution', 'Industry 4.0 market: RM5 billion in Malaysia', 'MIDA Industry4WRD fund: RM500M available', 'ASEAN smart manufacturing: USD 15B by 2027'],
    ['Implementation fee: RM100K-500K per factory', 'SaaS monitoring: RM2,000-10,000/month per site', 'Consulting and training: RM50K-200K per engagement', 'Government co-funding: Up to 50% via Industry4WRD'],
    ['5 factories implemented', 'Average downtime reduction: 30%', 'Average efficiency gain: 20%', 'MIDA Industry4WRD approved vendor'],
    ['MIDA and MARii partnership programs', 'Industry4WRD awareness workshops', 'Factory automation exhibitions (MITI, FMM)', 'Pilot program with subsidized first implementation'],
    ['Global Industry 4.0 vendors: Too expensive for Malaysian SMEs', 'Local IT companies: No manufacturing domain expertise', 'Our edge: Malaysia-specific + affordable + modular + government co-funding', 'ROI: 6-12 month payback vs 2-3 years for global solutions'],
    ['CEO: 15 years manufacturing, ex-Intel Malaysia', 'CTO: IoT and AI specialist, 4 Industry 4.0 patents', 'Head of Delivery: Certified Siemens and Rockwell integrator', 'Advisory: Former MITI deputy secretary general'],
    ['Year 1: RM5M revenue, 10 factories', 'Year 2: RM15M revenue, 40 factories', 'Year 3: RM40M revenue, 100 factories', 'Recurring revenue: 50% by Year 3'],
    ['Seeking: RM5M Series A', 'Use: Product development, team expansion, MIDA partnerships', 'Equity: 15-20%', 'MIDA Industry4WRD matching grants available'],
    ['Thank you!', 'Email: [email]', 'Website: [url]', 'Factory demo available at our pilot site']
  ])
];
