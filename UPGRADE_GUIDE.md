# GANGNIAGA-OS V0.4.0 Advanced Upgrade Guide 🚀

> Transform your business OS into the ultimate tool for **Founders**, **Content Creators**, and **Solo Coders** in ASEAN.

---

## 📦 What's New in V0.4.0

### ✨ New Features

| Feature | Persona | Description |
|---------|---------|-------------|
| 🔌 **MCP Server** | All | Expose GANGNIAGA tools to Hermes Agent & AI IDEs |
| 🎬 **Content Studio** | Creator | AI-powered TikTok/IG/FB/Shopee content generation |
| 🦄 **Investor CRM** | Founder | Track fundraising pipeline with stage management |
| 💰 **Burn Rate Alerts** | Founder | Auto-calculate runway + WhatsApp alerts |
| 🤖 **Hermes Integration** | All | Two-way sync with Hermes autonomous agent |
| 🛠 **Dev Agent Helpers** | Coder | Boilerplate generation + GitHub sync prep |

---

## 🚀 Quick Start (5 Minutes)

### 1. Install New Dependencies
```bash
cd /path/to/GANGNIAGA-OS
npm install @modelcontextprotocol/sdk ai @ai-sdk/openai
```

### 2. Run Database Migration (if needed)
```bash
npm run db:migrate
```

### 3. Start the MCP Server (for Hermes)
```bash
npm run mcp
# Keep this running in a separate terminal
```

### 4. Configure Hermes Agent
```bash
bash scripts/setup-hermes-mcp.sh
hermes restart
```

### 5. Test Integration
```bash
# Ask Hermes about your business
hermes ask "What's my burn rate?"
hermes ask "Generate TikTok script about AI tools for SMEs"
hermes ask "Update investor 'MY Ventures' to meeting stage"
```

---

## 🎯 Persona-Specific Guides

### 👨‍💼 For Founders / Entrepreneurs

#### Investor CRM Workflow
1. Go to `/dashboard/investors` in your app
2. Add investors with firm, email, investment range
3. Track stages: `researching → contacted → meeting → due_diligence → term_sheet → closed`
4. Toggle "Data Room Access" to share sensitive docs securely

#### Burn Rate Monitoring
```typescript
// Auto-alerts when runway < 3 months
import { check_burn_rate } from '@/lib/mcp-server';

const alert = await check_burn_rate();
// Returns: "🚨 CRITICAL: Runway < 3 months!" + metrics
```

#### Lean Canvas Mode
- Access quick 1-page view at `/canvas`
- Perfect for rapid iteration before full business plan

---

### 🎬 For Content Creators (FB, TikTok, IG, Shopee)

#### Generate Content in 3 Ways:

**A. Via API (Programmatic)**
```bash
curl -X POST http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "tiktok",
    "topic": "AI tools for small business",
    "brandVoice": "Casual, helpful, Malaysian English"
  }'
```

**B. Via Hermes Agent (Conversational)**
```bash
hermes ask "Create 3 TikTok hooks about dropshipping in Malaysia"
hermes ask "Optimize this caption for Shopee: [your caption]"
```

**C. Via Content Studio UI**
1. Navigate to `/content/studio`
2. Select platform + enter topic
3. Click "Generate" → Review → "Publish/Schedule"

#### Platform-Specific Optimizations

| Platform | Best Practices | GANGNIAGA Auto-Adds |
|----------|---------------|---------------------|
| TikTok | Trending sounds, text overlay | #FYP #Malaysia hashtags, hook templates |
| Instagram | Carousel posts, 20-30 hashtags | Location tags, engagement tips |
| Facebook | Questions, emotional hooks | Group sharing suggestions |
| Shopee | Price urgency, flash sale badges | SEO keywords, "Add to Cart" CTAs |

#### Shopee Integration Prep
```typescript
// In your Shopee API integration file:
import { optimizeForShopee } from '@/lib/content-studio';

const optimized = await optimizeForShopee(draft, {
  name: "AI Content Planner Pro",
  price: "RM49.90",
  category: "Software & Apps"
});
// Returns content with Shopee-optimized keywords + CTAs
```

---

### 💻 For Solo Vibe Coders

#### Dev Agent Helpers
```typescript
// Generate boilerplate for new features
import { generateFeatureSpec } from '@/lib/dev-agent';

const spec = await generateFeatureSpec("User authentication with NextAuth");
// Returns: PRD + file structure + code snippets + SQL migration
```

#### GitHub Sync (Coming Soon)
```typescript
// Future: Sync tasks to GitHub Issues
import { syncToGitHub } from '@/lib/github-integration';

await syncToGitHub({
  title: "Implement burn rate alert",
  labels: ["feature", "founder"],
  assignee: "bo"
});
```

#### One-Click Deploy Prep
1. Generate landing page in GANGNIAGA
2. Click "Deploy to Vercel" button
3. Auto-configures env vars + domain

---

## 🔌 MCP Server Deep Dive

### What is MCP?
**Model Context Protocol** lets AI agents (like Hermes) "plug into" your app to read/write data securely.

### Available Tools

| Tool | Purpose | Example Query |
|------|---------|--------------|
| `get_business_strategy` | Retrieve lean canvas | "What's my target audience?" |
| `check_burn_rate` | Financial health check | "Am I running out of money?" |
| `create_content_draft` | Generate social content | "Make a TikTok script about SaaS" |
| `update_investor_stage` | CRM updates | "Move ABC Capital to term_sheet" |
| `get_content_calendar` | View scheduled posts | "What's posting tomorrow?" |
| `get_business_health` | One-command summary | "How's my business doing?" |

### Configure Hermes Agent

Edit `~/.hermes-agent/config.yaml`:
```yaml
mcp_servers:
  gangniaga:
    command: "npm"
    args: ["run", "mcp", "--prefix", "/path/to/GANGNIAGA-OS"]
    env:
      DATABASE_URL: "your-supabase-url"
      AI_MODEL: "gpt-4o"
```

### Security Notes
- MCP server runs locally - no data leaves your machine
- Use environment variables for sensitive config
- Hermes only accesses tools you explicitly expose

---

## 🛠 Advanced Customization

### Add New MCP Tools
```typescript
// src/lib/mcp-server.ts

server.tool(
  'your_new_tool',
  'Description of what it does',
  {
    param1: z.string().describe('What this param does'),
    param2: z.number().optional(),
  },
  async ({ param1, param2 }) => {
    // Your logic here
    return {
      content: [{ type: 'text', text: 'Result message' }],
    };
  }
);
```

### Customize Content Generation
```typescript
// src/lib/content-studio.ts

// Add your brand voice presets
export const BRAND_VOICES = {
  'gangniaga': 'Friendly, Bahasa Rojak, hustle culture',
  'corporate': 'Professional, data-driven, formal',
  'gen-z': 'Casual, emoji-heavy, trending slang',
};

// Add platform-specific templates
export const CONTENT_TEMPLATES = {
  tiktok: {
    hook_formulas: [
      "Stop doing [X]! Do this instead...",
      "I tried [Y] for 30 days, here's what happened...",
    ],
  },
  // ... other platforms
};
```

### Extend Investor CRM
```tsx
// src/components/InvestorCRM.tsx

// Add custom fields
interface Investor {
  // ... existing fields
  referral_source?: string;
  meeting_notes?: string[];
  follow_up_date?: string;
}

// Add new actions
const handleScheduleFollowUp = (investorId: string) => {
  // Integrate with calendar API
};
```

---

## 🐛 Troubleshooting

### MCP Server Won't Start
```bash
# Check if dependencies installed
npm list @modelcontextprotocol/sdk

# Run manually to see errors
npx tsx src/lib/mcp-server.ts

# Verify Node/Bun version
node -v  # Should be 18+
```

### Hermes Can't Connect
```bash
# Test MCP server directly
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  npm run mcp

# Check Hermes logs
hermes logs | grep gangniaga

# Verify config path
cat ~/.hermes-agent/config.yaml | grep gangniaga
```

### Content Generation Returns Errors
```bash
# Check AI provider config
cat .env | grep AI_

# Test API directly
curl http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"platform":"tiktok","topic":"test"}'

# Verify Zod schema validation
# Check browser console for frontend errors
```

### Investor CRM Not Saving
```bash
# Check localStorage (demo mode)
# Or verify Supabase connection:
npx supabase status

# Check browser network tab for API errors
```

---

## 🔐 Security Checklist

- [ ] **Rotate GitHub token** (you shared one earlier - revoke it!)
- [ ] Set `.env` variables for production
- [ ] Enable NextAuth for user authentication
- [ ] Add rate limiting to `/api/content/generate`
- [ ] Sanitize all user inputs (Zod helps!)
- [ ] Use Supabase RLS for data isolation
- [ ] Never commit `.env` or secrets to git

### Environment Variables Template
```bash
# .env.local
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# AI Providers
OPENAI_API_KEY="sk-..."
AI_MODEL="gpt-4o"

# Hermes Integration
HERMES_AGENT_URL=""  # Optional: fallback if MCP not used
HERMES_API_KEY=""

# Content Generation
CONTENT_MAX_REQUESTS_PER_HOUR=50

# Investor CRM
DATA_ROOM_SECRET="generate-secure-uuid"
```

---

## 📈 Performance Tips

1. **Cache AI Responses**: Store generated content to avoid re-generating
2. **Lazy-Load Components**: InvestorCRM is heavy - use dynamic imports
3. **Debounce Search**: In CRM search, debounce by 300ms
4. **Optimize Images**: Use Next.js Image component for creator thumbnails
5. **Batch Database Calls**: Use Promise.all for parallel queries

---

## 🔄 Migration from V0.3.0

### Breaking Changes
- None! V0.4.0 is fully backward compatible

### Recommended Updates
1. Update `package.json` with new dependencies
2. Add `npm run mcp` script
3. Copy new files from this guide to your repo
4. Run `npm run db:migrate` if using new database features

### Optional Enhancements
- Enable NextAuth for multi-user support
- Add WhatsApp alerts via OpenClaw for burn rate warnings
- Integrate Shopee Open API for real inventory sync

---

## 🤝 Contributing

Found a bug or have a feature idea?

1. Fork the repo
2. Create feature branch: `git checkout -b feat/your-idea`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-idea`
5. Open PR with description

### Code Standards
- TypeScript strict mode ✅
- ESLint + Prettier configured ✅
- Test critical paths with Vitest ✅
- Document new MCP tools in this guide ✅

---

## 📞 Support & Community

- **Docs**: https://github.com/thisisniagahub/GANGNIAGA-OS/wiki
- **Discord**: [Join ASEAN Builders](https://discord.gg/...)
- **Issues**: https://github.com/thisisniagahub/GANGNIAGA-OS/issues
- **Hermes Agent**: https://hermes-agent.nousresearch.com/docs

---

> 🇲🇾 **Built for ASEAN, by ASEAN**  
> GangNiaga OS v0.4.0 • Empowering founders, creators & coders  
> *Niaga = Business (Malay) • OS = Operating System*

**Happy Building! 🚀**
