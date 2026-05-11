# OpenClaw Integration — GangNiaga AI OS

## What is OpenClaw?

OpenClaw is an open-source multi-channel AI gateway that connects autonomous AI agents to messaging platforms, voice systems, and automation workflows. It acts as a unified communication layer between your AI agents and the channels your business operates on — WhatsApp, Telegram, Discord, Slack, Signal, web chat, and more.

GangNiaga AI OS integrates with OpenClaw to provide **24/7 autonomous business assistance** across all customer touchpoints. Instead of building separate integrations for each messaging platform, OpenClaw provides a single gateway that routes conversations to the right AI specialist agent.

## Key Features

### Multi-Channel Gateway
Connect GangNiaga AI to every channel your business uses:
- **WhatsApp** — Primary channel for ASEAN SME communication
- **Telegram** — Secure messaging for investor and partner communications
- **Discord** — Community and team collaboration
- **Slack** — Internal team workflows
- **Signal** — Private, encrypted business discussions
- **WebChat** — Embedded website chat widget
- And 14+ more channels (LINE, WeChat, MS Teams, Matrix, etc.)

### Plugin System
Extend GangNiaga AI's capabilities through OpenClaw plugins:
- **Web Search** — Real-time market research and data retrieval
- **Memory Wiki** — Persistent knowledge base across conversations
- **Webhooks** — Push and pull data from external services (CRM, ERP, analytics)
- **PDF Tool** — Generate and parse business documents
- **Code Execution** — Run financial calculations and data analysis
- **Voice Call** — Voice-based business consultations (optional)
- Install plugins from **ClawHub** (plugin marketplace) or create your own

### Delegates
Empower team members to act through the AI:
- **Tier 1 (Read Only)** — Support agents can read knowledge base and respond to FAQs
- **Tier 2 (Send on Behalf)** — Finance Bot can send financial summaries and schedule reviews on behalf of the CFO
- **Tier 3 (Proactive)** — Senior delegates can initiate conversations and take autonomous actions

### Webhooks
Connect GangNiaga AI to your existing tech stack:
- **Inbound webhooks** — Receive events from external services (CRM updates, payment notifications)
- **Outbound webhooks** — Push AI-generated insights to your tools (Slack notifications, analytics tracking, CRM sync)
- **Event-driven triggers** — Automatically respond to agent completions, new messages, or workflow events

### Automation
Schedule recurring AI-powered tasks:
- Daily KPI summaries delivered to Telegram every morning
- Weekly investor reports compiled and sent via WhatsApp
- Competitor price checks every 6 hours
- Monthly financial reviews with variance analysis
- Custom cron-based scheduling for any workflow

### SOUL.md Personality
Define GangNiaga AI's personality, tone, language preferences, and behavioral rules in a simple Markdown file. SOUL.md ensures consistent, on-brand communication across all channels — whether it's a formal bank proposal or a quick WhatsApp check-in.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GangNiaga AI OS                       │
│                  (Next.js Application)                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │Dashboard │  │ Business │  │Financial │  │  Pitch │ │
│  │          │  │  Plans   │  │  Engine  │  │  Deck  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Idea    │  │  Plan    │  │ Research │  │ Plan   │ │
│  │ Canvas   │  │  Review  │  │  Agent   │  │Actuals │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│         │                                    │          │
│         │    ┌───────────────────────┐       │          │
│         └───►│   REST API Routes     │◄──────┘          │
│              │  /api/business-plan   │                  │
│              │  /api/forecast        │                  │
│              │  /api/idea-canvas     │                  │
│              │  /api/plan-review     │                  │
│              │  /api/pitch-deck      │                  │
│              └───────────┬───────────┘                  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │ HTTP / WebSocket
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   OpenClaw Gateway                       │
│                 (127.0.0.1:18789)                        │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ SOUL.md │  │AGENTS.md │  │  Plugin  │  │Delegate │ │
│  │Person.  │  │ Routing  │  │ Runtime  │  │ Manager │ │
│  └─────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │ Channel Manager  │  │    Automation Scheduler      │ │
│  └────────┬────────┘  └──────────────────────────────┘ │
│           │                                             │
└───────────┼─────────────────────────────────────────────┘
            │
   ┌────────┼────────┬──────────┬──────────┬──────────┐
   ▼        ▼        ▼          ▼          ▼          ▼
┌──────┐┌──────┐┌─────────┐┌──────┐┌──────┐┌──────────┐
│WhatsApp││Telegram││ Discord ││ Slack││Signal││ WebChat │
└──────┘└──────┘└─────────┘└──────┘└──────┘└──────────┘
```

### How It Works

1. **Inbound Message**: A user sends a message on any connected channel (e.g., WhatsApp)
2. **Channel Routing**: OpenClaw receives the message and routes it to the appropriate channel adapter
3. **Agent Selection**: The AGENTS.md configuration determines which specialist agent should handle the request (Business Analyst, Financial Advisor, Research Agent, etc.)
4. **Personality Application**: SOUL.md rules are applied — tone, language (EN/MS), business context, and behavioral constraints
5. **Tool Invocation**: The agent may call GangNiaga's API routes (business plan generation, financial forecasting, etc.) via the plugin system
6. **Response Delivery**: The agent's response is sent back through the same channel, maintaining conversation context
7. **Automation**: Scheduled tasks run independently via cron, pushing proactive insights to configured channels

## Setup Instructions

### 1. Install OpenClaw Gateway

```bash
# Install OpenClaw (follow official documentation)
# Clone or install the OpenClaw gateway binary
```

### 2. Configure the Gateway

Edit `openclaw.json` to match your environment:

```bash
# Set environment variables for channel tokens
export TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
export DISCORD_BOT_TOKEN="your-discord-bot-token"
export DISCORD_GUILD_ID="your-discord-guild-id"
export SLACK_BOT_TOKEN="your-slack-bot-token"
```

### 3. Connect Channels

#### WhatsApp
1. Set `channels.whatsapp.enabled` to `true` in `openclaw.json`
2. Configure the WhatsApp Business API phone number
3. Scan the QR code when the gateway starts to pair your device

#### Telegram
1. Create a bot via [@BotFather](https://t.me/botfather)
2. Copy the bot token to the `TELEGRAM_BOT_TOKEN` environment variable
3. Set `channels.telegram.enabled` to `true`

#### Discord
1. Create a Discord Application and Bot in the [Developer Portal](https://discord.com/developers/applications)
2. Enable the Message Content Intent in bot settings
3. Copy the bot token and guild ID to environment variables
4. Set `channels.discord.enabled` to `true`

#### WebChat
1. Set `channels.webchat.enabled` to `true`
2. Add your application's origin to `corsOrigins` (e.g., `http://localhost:3000`)
3. Embed the WebChat widget in your Next.js application

#### Slack
1. Create a Slack App in the [API Console](https://api.slack.com/apps)
2. Enable Socket Mode and copy the bot token
3. Set `channels.slack.enabled` to `true`

### 4. Start the Gateway

```bash
# Start OpenClaw gateway with the GangNiaga configuration
openclaw start --config ./openclaw/openclaw.json
```

### 5. Verify Connection

Check the Gateway tab in the GangNiaga AI OS application (OpenClaw module) to confirm:
- Gateway status shows "Running"
- Connected channels appear with "Connected" status
- Sessions are being created for incoming messages

## File Structure

```
openclaw/
├── SOUL.md                # Agent personality configuration
│                          # Defines tone, language, specialty, rules
│
├── AGENTS.md              # Multi-agent routing configuration
│                          # Defines specialist lanes and delegates
│
├── openclaw.json          # Gateway configuration
│                          # Channel settings, plugins, automation, sessions
│
├── plugin-manifest.json   # ClawHub plugin manifest
│                          # Tool definitions, capabilities, entry points
│
└── README.md              # This documentation file
```

### File Descriptions

| File | Purpose |
|------|---------|
| `SOUL.md` | Defines GangNiaga AI's personality, tone, language preferences, specialty areas, greeting message, and behavioral rules. Applied to all conversations across all channels. |
| `AGENTS.md` | Configures the multi-agent routing system. Defines which specialist agent (Business Analyst, Financial Advisor, Research Agent, Plan Review Agent, Support Delegate) handles each type of request. Also defines delegate tiers and their permissions. |
| `openclaw.json` | Main gateway configuration. Specifies the bind address, authentication mode, channel connections (WhatsApp, Telegram, Discord, etc.), agent model settings, enabled plugins, and scheduled automation tasks. |
| `plugin-manifest.json` | ClawHub plugin manifest that registers GangNiaga as an OpenClaw plugin. Declares 6 tools (generate_business_plan, validate_idea, review_plan, generate_pitch_deck, financial_forecast, research_market), capabilities, entry points, and configuration schema. |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | If Telegram enabled | Bot token from @BotFather |
| `DISCORD_BOT_TOKEN` | If Discord enabled | Bot token from Discord Developer Portal |
| `DISCORD_GUILD_ID` | If Discord enabled | Server/Guild ID for the bot |
| `SLACK_BOT_TOKEN` | If Slack enabled | Bot token from Slack API Console |

## Support

For issues or questions about the OpenClaw integration:
- Check the **OpenClaw** tab in the GangNiaga AI OS application
- Review the gateway logs for error messages
- Consult the [OpenClaw documentation](https://github.com/openclaw) for advanced configuration
