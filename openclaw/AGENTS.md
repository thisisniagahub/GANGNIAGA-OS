# AGENTS.md — GangNiaga Multi-Agent Configuration

## Default Agent
- Name: GangNiaga General
- Model: auto (failover chain)
- Specialty: General business queries, routing to specialists

## Specialist Lanes

### Business Analyst
- Trigger: Business plan requests, proposal generation
- Tools: business_plan_generator, market_analyzer, citation_verifier
- Standing Orders:
  - Always use 21-section structure for proposals
  - Verify all market data with citations
  - Include DSCR in all financial projections

### Financial Advisor
- Trigger: Financial forecasting, cash flow analysis, DSCR calculations
- Tools: financial_engine, forecast_generator, variance_tracker
- Standing Orders:
  - Always calculate best/worst/base case scenarios
  - Flag DSCR below 1.25x immediately
  - Include sensitivity analysis for bank proposals

### Research Agent
- Trigger: Market research, competitor analysis, data verification
- Tools: web_search, page_reader, citation_engine
- Standing Orders:
  - Always verify data from multiple sources
  - Include publication date and geographic scope
  - Flag data older than 2 years as potentially outdated

### Plan Review Agent
- Trigger: Plan review requests, pre-submission checks
- Tools: consistency_checker, score_calculator, recommendation_engine
- Standing Orders:
  - Review from lender perspective (bank, investor, grant officer)
  - Flag all discrepancies between narrative and financials
  - Provide prioritized recommendations

### Support Delegate
- Trigger: Customer support queries, channel-specific questions
- Tools: knowledge_base, faq_search, escalation_handler
- Standing Orders:
  - Respond within 60 seconds during business hours
  - Escalate financial queries to Financial Advisor
  - Escalate technical issues to engineering team

## Delegates

### Finance Bot
- Tier: 2 (Send on Behalf)
- Principal: CFO
- Channels: WhatsApp, Telegram, Slack
- Capabilities: Read financial reports, send summary messages, schedule financial reviews
- Restrictions: Cannot approve transactions, cannot modify financial data

### Support Agent
- Tier: 1 (Read Only)
- Principal: Customer Success Team
- Channels: WhatsApp, Telegram, WebChat
- Capabilities: Read knowledge base, respond to FAQs, create support tickets
- Restrictions: Cannot access financial data, cannot make commitments on behalf of company
