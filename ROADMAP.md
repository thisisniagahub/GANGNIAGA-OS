# 🗺️ GangNiaga AI OS — Product Roadmap

> Strategic development roadmap from current state to enterprise-grade platform

---

## Current State: v0.3.0 (Intelligence & Gateway)

### ✅ What's Built

| Module | Status | Capability |
|--------|--------|-----------|
| Dashboard | ✅ Complete | 6 KPI cards, 3 chart types, AI Insights, Quick Actions |
| Business Plans | ✅ Complete | 21-section builder, 6 proposal types, AI generation, bulk gen, inline edit |
| Financials | ✅ Complete | 6 tabs — Revenue, Expenses, Bank Metrics (DSCR), Statements, Advisor |
| Idea Canvas | ✅ Complete | 5-dimension validation, benchmark comparison, red flag detection |
| Plan Review | ✅ Complete | 3 lender personas, narrative vs financial consistency, discrepancy detection |
| Research Agent | ✅ Complete | 10 citations, source verification, geography filtering |
| Agent Console | ✅ Complete | 8 AI agents, task management, status tracking |
| Workflows | ✅ Complete | Multi-step orchestration, 3 trigger types, agent assignment |
| Memory Engine | ✅ Complete | 5 memory types, persistent context, category organization |
| Pitch Deck | ✅ Complete | 3 template types, AI slide generation, anticipated questions |
| Reports | ✅ Complete | 5 report types, multi-format, AI generation |
| Plan vs Actuals | ✅ Complete | Variance tracking, 3 alert levels, QB/Xero integration stub |
| AI Copilot | ✅ Complete | Context-aware chat, business intelligence |
| Settings | ✅ Complete | Organization config, integration management |
| OpenClaw Multi-Channel Gateway | ✅ Complete | WhatsApp, Telegram, Discord, WebChat, Signal, Slack — webhook integration |
| Skills System | ✅ Complete | 30+ built-in skills, auto-learn, execution engine |
| Multi-Provider AI Adapter | ✅ Complete | ZAI/OpenAI/OpenRouter with round-robin key rotation |
| Real Messaging Gateway | ✅ Complete | Telegram/WhatsApp webhook integration, conversation persistence |
| Supabase PostgreSQL Integration | ✅ Complete | Dual-database pattern (SQLite local + Supabase production), 27 tables |
| AI Vision, ASR, TTS, Image Gen | ✅ Complete | Full multimodal AI routes via multi-provider adapter |
| SOUL.md AI Personality System | ✅ Complete | Configurable AI personality and behavior definitions |
| Gateway Conversation Persistence | ✅ Complete | Conversations from messaging channels stored in database |
| OpenClaw Plugin & Delegate System | ✅ Complete | Plugin architecture for extending gateway capabilities |

### 📊 Project Scale

| Metric | Count |
|--------|-------|
| API Routes | 41 |
| Prisma Models | 27 |
| Modules | 15 |
| Built-in Skills | 30+ |
| AI Providers | 3 (ZAI, OpenAI, OpenRouter) |
| Messaging Channels | 6 (WhatsApp, Telegram, Discord, WebChat, Signal, Slack) |

### ⚠️ Known Limitations

- **No real authentication** — Single-user mode, no login/signup
- **No PPTX/PDF export** — Pitch deck and reports are view-only
- **No WebSocket real-time** — Agent status is simulated, not live
- **No vector search** — Memory is text-based, no semantic retrieval
- **No automated testing** — Zero test coverage
- **OpenClaw gateway channels are configured but messaging is API-only** — No persistent bot connections (channels respond via webhook, not long-lived bot sessions)
- **No real API integrations** — QuickBooks/Xero are stubs, not connected
- **No multi-tenancy** — Single organization assumption

---

## Phase 1: Production Readiness (v0.3.x) — Q2 2025

> **Goal**: Make the platform usable by real users with real data

### ✅ Already Completed

| Task | Status |
|------|--------|
| Supabase PostgreSQL integration (dual-database pattern) | ✅ Done |
| AI Provider abstraction (ZAI/OpenAI/OpenRouter multi-provider) | ✅ Done |
| Skills system (30+ built-in skills, auto-learn, execution engine) | ✅ Done |
| OpenClaw Multi-Channel Gateway | ✅ Done |
| Messaging Gateway (Telegram/WhatsApp webhook) | ✅ Done |
| Gateway Conversation Persistence | ✅ Done |
| AI Vision, ASR, TTS, Image Gen routes | ✅ Done |
| SOUL.md AI Personality System | ✅ Done |
| Partial data persistence via Supabase | ✅ Done |

### 🔐 Authentication & Authorization (Still Needed)
| Task | Priority | Effort |
|------|----------|--------|
| NextAuth.js v4 setup with email/password | P0 | 2 days |
| Google OAuth integration | P1 | 1 day |
| Role-based access control (owner, admin, member, viewer) | P0 | 3 days |
| Session management & token refresh | P0 | 1 day |
| Invite system for team members | P1 | 2 days |

### 💾 Data Persistence (Remaining Work)
| Task | Priority | Effort |
|------|----------|--------|
| Connect remaining Zustand stores → Supabase API for all CRUD | P0 | 3 days |
| Business Plan save/load via Supabase | P0 | 1 day |
| Financial assumptions persistence | P1 | 1 day |
| Idea Canvas save with validation reports | P1 | 1 day |
| Plan Review history storage | P1 | 1 day |
| Pitch Deck save with slide data | P1 | 1 day |

### 📄 Export & Download
| Task | Priority | Effort |
|------|----------|--------|
| PDF export for Business Plans (full 21 sections) | P0 | 3 days |
| PDF export for Reports | P0 | 2 days |
| PPTX export for Pitch Decks | P1 | 3 days |
| DOCX export for Business Plans | P1 | 2 days |
| XLSX export for Financial Statements | P1 | 2 days |
| CSV export for Plan vs Actuals data | P2 | 1 day |

### 🎨 UX Polish
| Task | Priority | Effort |
|------|----------|--------|
| Onboarding wizard for new users | P1 | 3 days |
| Toast notifications for all CRUD operations | P1 | 1 day |
| Keyboard shortcuts for power users | P2 | 2 days |
| Undo/redo for section editing | P2 | 2 days |
| Auto-save with conflict resolution | P1 | 2 days |

### Success Metrics (v0.3.x)
- [ ] User can sign up, log in, and persist data across sessions
- [ ] All 15 modules save and load from Supabase
- [ ] PDF/PPTX export works for at least 3 document types
- [ ] Zero data loss on page refresh
- [x] AI providers work via OpenRouter/OpenAI on Vercel
- [x] Messaging gateway receives and processes webhooks

---

## Phase 2: Intelligence Upgrade (v0.4.0) — Q3 2025

> **Goal**: Make AI agents truly autonomous and intelligent

### 🧠 Advanced AI Agent System
| Task | Priority | Effort |
|------|----------|--------|
| Multi-agent coordination (agents collaborate on tasks) | P0 | 5 days |
| Agent chain execution (output of Agent A → input of Agent B) | P0 | 3 days |
| Autonomous workflow triggers (agent decides when to run) | P1 | 3 days |
| Agent progress streaming (real-time task updates) | P1 | 2 days |
| Custom agent creation (user defines agent config) | P2 | 3 days |
| AI Provider streaming support | P0 | 3 days |

### 🔍 Semantic Memory & Search
| Task | Priority | Effort |
|------|----------|--------|
| Text embedding generation for memory entries | P0 | 3 days |
| Similarity search across memory store | P0 | 2 days |
| Auto-categorization of new memories | P1 | 2 days |
| Memory deduplication and consolidation | P1 | 2 days |
| Context injection from memory into AI prompts | P0 | 2 days |

### 📊 Enhanced Financial Intelligence
| Task | Priority | Effort |
|------|----------|--------|
| Sensitivity analysis (what-if scenarios) | P0 | 3 days |
| Monte Carlo simulation for forecasts | P1 | 3 days |
| Connected financial model (change assumption → all projections update) | P0 | 5 days |
| Break-even analysis with dynamic charts | P1 | 2 days |
| Cash flow stress testing | P1 | 2 days |

### 🏦 Bank-Grade Research
| Task | Priority | Effort |
|------|----------|--------|
| Web search integration for real-time market data | P0 | 3 days |
| Automated citation verification pipeline | P0 | 2 days |
| Industry benchmark database (ASEAN focus) | P1 | 5 days |
| Government data source integration (DOSM, BNM, SME Corp) | P1 | 3 days |
| 50+ verified source library | P2 | 3 days |

### 🤖 OpenClaw Persistent Bot Connections
| Task | Priority | Effort |
|------|----------|--------|
| Persistent Telegram bot connection (long-lived polling/webhook) | P0 | 2 days |
| Persistent WhatsApp Business API connection | P0 | 3 days |
| Discord bot with presence and real-time events | P1 | 2 days |
| Slack bot with Socket Mode | P1 | 2 days |
| Signal bot integration | P2 | 3 days |

### Success Metrics (v0.4.0)
- [ ] Agents can chain tasks autonomously without user intervention
- [ ] Memory search returns semantically relevant results
- [ ] Financial model changes propagate to all related views
- [ ] Research agent provides 20+ verified citations per plan
- [ ] OpenClaw channels maintain persistent bot connections
- [ ] AI provider supports streaming responses

---

## Phase 3: Integration & Automation (v0.5.0) — Q4 2025

> **Goal**: Connect to real business tools and automate workflows

### 🔌 Accounting Integrations
| Task | Priority | Effort |
|------|----------|--------|
| QuickBooks Online OAuth + API | P0 | 5 days |
| Xero OAuth + API | P0 | 5 days |
| Auto-sync actuals from accounting → Plan vs Actuals | P0 | 3 days |
| Chart of accounts mapping | P1 | 2 days |
| Transaction categorization with AI | P1 | 3 days |
| Sync conflict resolution | P1 | 2 days |

### 📧 Communication Integrations
| Task | Priority | Effort |
|------|----------|--------|
| Email notifications (report ready, alert triggered) | P1 | 2 days |
| Slack integration (KPI alerts, workflow updates) | P1 | 3 days |
| WhatsApp Business API (ASEAN preference) | P2 | 3 days |
| Calendar integration (report deadlines, review schedules) | P2 | 2 days |

### ⚡ Advanced Workflow Automation
| Task | Priority | Effort |
|------|----------|--------|
| Visual workflow builder (drag & drop) | P0 | 7 days |
| Conditional branching in workflows | P1 | 3 days |
| Scheduled workflow execution (cron) | P1 | 2 days |
| Webhook triggers (external events) | P1 | 2 days |
| Workflow templates library | P2 | 2 days |

### 🤖 Real-Time Agent Updates
| Task | Priority | Effort |
|------|----------|--------|
| WebSocket server for agent status streaming | P0 | 3 days |
| Real-time task progress updates | P0 | 2 days |
| Live agent logs viewer | P1 | 2 days |
| Agent notification system | P1 | 1 day |

### Success Metrics (v0.5.0)
- [ ] QuickBooks/Xero sync works with real accounts
- [ ] Workflows can be built visually and execute reliably
- [ ] Agent status updates in real-time via WebSocket
- [ ] Users receive notifications for critical events

---

## Phase 4: Scale & Collaborate (v0.6.0) — Q1 2026

> **Goal**: Multi-tenant, team collaboration, and API access

### 👥 Multi-Tenancy & Collaboration
| Task | Priority | Effort |
|------|----------|--------|
| Organization isolation (data, agents, memory) | P0 | 5 days |
| Team collaboration on business plans (real-time) | P0 | 7 days |
| Comments and mentions in sections | P1 | 3 days |
| Activity feed and audit log | P1 | 3 days |
| Role-based permissions per module | P0 | 3 days |

### 🔓 API Access
| Task | Priority | Effort |
|------|----------|--------|
| Public REST API for all CRUD operations | P1 | 5 days |
| API key management | P1 | 2 days |
| Rate limiting and usage tracking | P1 | 2 days |
| API documentation (OpenAPI/Swagger) | P1 | 3 days |
| Webhook outgoing notifications | P2 | 2 days |

### 📱 Mobile Responsiveness
| Task | Priority | Effort |
|------|----------|--------|
| Mobile-optimized layouts for all 15 modules | P0 | 5 days |
| Touch-friendly interactions | P1 | 2 days |
| PWA support (offline mode) | P2 | 3 days |
| Mobile navigation redesign | P1 | 2 days |

### 🌏 Localization (ASEAN)
| Task | Priority | Effort |
|------|----------|--------|
| Bahasa Melayu translation | P1 | 3 days |
| Indonesian Bahasa translation | P1 | 3 days |
| Multi-currency support (MYR, IDR, THB, SGD, PHP, VND) | P0 | 5 days |
| Regional compliance templates (per country) | P2 | 5 days |

### Success Metrics (v0.6.0)
- [ ] Multiple organizations use the platform simultaneously
- [ ] Real-time collaboration works on business plans
- [ ] Public API has 50+ daily active integrations
- [ ] Platform available in 3 ASEAN languages

---

## Phase 5: Enterprise (v1.0.0) — Q2 2026

> **Goal**: Enterprise-grade, compliant, white-label ready

### 🔒 Enterprise Security
| Task | Priority | Effort |
|------|----------|--------|
| SOC 2 Type II compliance | P0 | 30 days |
| SAML/SSO integration | P0 | 5 days |
| Data encryption at rest | P0 | 3 days |
| Audit trail with immutable logs | P0 | 5 days |
| GDPR/PDPA data handling | P0 | 5 days |
| Penetration testing & vulnerability scanning | P0 | 10 days |

### 🏢 Enterprise Features
| Task | Priority | Effort |
|------|----------|--------|
| White-label customization | P1 | 10 days |
| Custom branding (logos, colors, domain) | P1 | 5 days |
| Advanced analytics dashboard | P1 | 5 days |
| Custom report builder | P2 | 7 days |
| Data warehouse export | P2 | 3 days |

### 📈 Platform & Infrastructure
| Task | Priority | Effort |
|------|----------|--------|
| pgvector for semantic search (on Supabase) | P0 | 3 days |
| Redis caching layer | P1 | 3 days |
| CDN for static assets | P1 | 2 days |
| Auto-scaling infrastructure | P1 | 5 days |
| 99.9% uptime SLA | P0 | ongoing |

### 🎓 Customer Success
| Task | Priority | Effort |
|------|----------|--------|
| In-app onboarding tours | P1 | 3 days |
| Knowledge base & documentation | P1 | 10 days |
| Video tutorials | P2 | 10 days |
| Customer support chat | P1 | 5 days |
| Community forum | P2 | 5 days |

### Success Metrics (v1.0.0)
- [ ] SOC 2 Type II certified
- [ ] 99.9% uptime achieved
- [ ] 100+ paying organizations
- [ ] Available as white-label solution

---

## Long-Term Vision (2027+)

### 🌐 GangNiaga Marketplace
- Third-party agent marketplace (like GPT Store for business agents)
- Custom agent builder with no-code interface
- Template marketplace for business plans and pitch decks
- Integration marketplace (CRM, ERP, banking)

### 📱 Native Mobile App
- iOS and Android native apps
- Offline-first architecture
- Push notifications for agent alerts
- Camera integration for document scanning

### 🏦 GangNiaga Banking
- Direct bank submission (SME loan applications)
- Lender matching algorithm
- Real-time loan status tracking
- Integrated digital signing

### 🌍 Regional Expansion
- Indonesia (64M MSMEs — largest ASEAN market)
- Thailand (3.1M SMEs)
- Philippines (1M+ SMEs)
- Vietnam (700K+ SMEs)
- Singapore (275K SMEs)

### 🤖 AGI Business Partner
- Autonomous business decision-making agent
- Proactive opportunity identification
- Competitive moat construction
- Strategic partnership recommendations

---

## Priority Matrix

| Priority | Label | Criteria |
|----------|-------|----------|
| **P0** | Must Have | Blocks core user value or enterprise readiness |
| **P1** | Should Have | Significant value add, expected by users |
| **P2** | Could Have | Nice to have, differentiating feature |
| **P3** | Won't Have (Yet) | Deferred to future phase |

## Technical Debt Register

| Item | Impact | Phase to Address |
|------|--------|-----------------|
| Zustand mock data → real DB persistence (partially done via Supabase) | Some data loss on refresh | Phase 1 |
| Chart colors duplicated across modules | Inconsistent theming | Phase 1 |
| No error boundaries in modules | Full page crash on error | Phase 1 |
| No automated tests | Regression risk | Phase 1 |
| OpenClaw channels need persistent bot connections | Channels are API/webhook-only, no long-lived sessions | Phase 2 |
| Skills system needs more documentation | Undocumented capabilities, hard to extend | Phase 2 |
| AI Provider needs streaming support | No real-time token streaming, blocking responses | Phase 2 |
| No rate limiting on AI API calls | Cost runaway risk | Phase 2 |
| Agent status is simulated | No real task execution | Phase 3 |
| No content versioning | No undo/audit on plans | Phase 4 |

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| AI API costs exceed budget | Medium | High | Rate limiting, caching, token budgets, round-robin keys |
| Supabase free tier limits reached | Medium | Medium | Monitor usage, upgrade to Pro when needed |
| User adoption below targets | Medium | High | Free tier, onboarding optimization |
| Competitive pressure from LivePlan/Notion | Medium | Medium | AI differentiation, ASEAN focus |
| Data security breach | Low | Critical | SOC 2, encryption, penetration testing |
| AI regulation changes | Medium | Medium | Compliance monitoring, modular AI layer |
| OpenRouter/OpenAI API changes | Medium | Medium | Multi-provider adapter, fallback routing |

---

*Last updated: March 2025 | Version: v0.3.0*
