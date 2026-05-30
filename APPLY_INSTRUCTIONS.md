# ⚡ GANGNIAGA-OS V0.4.0 - Apply Instructions

> Follow these exact steps to implement all advanced features in <5 minutes.

---

## ⚠️ URGENT: Security First

**If you shared a GitHub token in chat, REVOKE IT NOW:**
1. Go to https://github.com/settings/tokens
2. Find token starting with `ghp_`
3. Click **Revoke**
4. Generate new token with minimal scopes: `repo`, `workflow` (if needed)

---

## 📋 Prerequisites

- Node.js 18+ or Bun 1.0+
- Existing GANGNIAGA-OS repo cloned locally
- Terminal with bash/PowerShell

---

## 🚀 Step-by-Step Apply

### Step 1: Install New Dependencies
```bash
cd /path/to/GANGNIAGA-OS

# Using npm
npm install @modelcontextprotocol/sdk ai @ai-sdk/openai

# OR using bun
bun add @modelcontextprotocol/sdk ai @ai-sdk/openai
```

### Step 2: Verify Files Exist
Check these files were created:
```bash
ls -la src/lib/mcp-server.ts
ls -la src/lib/content-studio.ts
ls -la src/components/InvestorCRM.tsx
ls -la src/app/api/content/generate/route.ts
ls -la scripts/setup-hermes-mcp.sh
ls -la UPGRADE_GUIDE.md
```

### Step 3: Update package.json (Already Done ✅)
The `package.json` should now include:
```json
{
  "scripts": {
    "mcp": "tsx src/lib/mcp-server.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "ai": "^4.0.0",
    "@ai-sdk/openai": "^1.0.0"
  }
}
```

### Step 4: Run Database Migration (If Using Prisma)
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes (if any)
npm run db:push

# Seed if needed
npm run seed
```

### Step 5: Test the API Endpoint
```bash
# Start dev server
npm run dev

# In another terminal, test content generation:
curl -X POST http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "tiktok",
    "topic": "AI tools for Malaysian SMEs",
    "brandVoice": "Casual, friendly, Bahasa Rojak"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "hook": "...",
    "caption": "...",
    "hashtags": ["#GANGNIAGA", "#StartupMY", "..."],
    "engagement_tips": ["...", "..."]
  }
}
```

### Step 6: Test MCP Server (For Hermes)
```bash
# Start MCP server in separate terminal
npm run mcp

# In another terminal, test with echo:
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  npm run mcp 2>/dev/null | grep -A 20 '"result"'
```

Expected: List of available tools (`get_business_strategy`, `check_burn_rate`, etc.)

### Step 7: Configure Hermes Agent (Optional)
```bash
# Run setup script
bash scripts/setup-hermes-mcp.sh

# Restart Hermes
hermes restart

# Test queries:
hermes ask "What is my business niche?"
hermes ask "Check my burn rate"
hermes ask "Generate TikTok script about dropshipping"
```

---

## 🎯 Quick Feature Tests

### Content Studio
```bash
# Visit in browser:
http://localhost:3000/content/studio

# Or API test:
curl http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"platform":"shopee","topic":"wireless earbuds"}'
```

### Investor CRM
```bash
# Visit in browser:
http://localhost:3000/dashboard/investors

# Test adding investor via API (when backend ready):
curl -X POST /api/investors \
  -H "Content-Type: application/json" \
  -d '{"name":"Test VC","email":"test@vc.com","stage":"researching"}'
```

### MCP Tools via Hermes
```bash
# After Hermes config:
hermes ask "get_business_strategy"
hermes ask "create_content_draft platform=tiktok topic=AI"
hermes ask "update_investor_stage investor_name='Test Fund' stage=meeting"
```

---

## 🐛 If Something Breaks

### "Module not found: @modelcontextprotocol/sdk"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "MCP Server handshake timeout"
```bash
# Check if server starts manually
npx tsx src/lib/mcp-server.ts

# Verify Node version
node -v  # Should be 18+

# Check for port conflicts
lsof -i :3000  # Or whatever port MCP uses
```

### "Content generation returns 500"
```bash
# Check AI provider config
cat .env | grep OPENAI

# Test AI directly
node -e "require('openai').OpenAI({apiKey:'...'}).chat.completions.create(...)"

# Check server logs
tail -f dev.log | grep content
```

### "Investor CRM not saving"
```bash
# Check browser console for errors
# Verify localStorage (demo mode) or Supabase connection
npx supabase status

# Check network tab for failed API calls
```

---

## ✅ Post-Apply Checklist

- [ ] Dependencies installed successfully
- [ ] `npm run dev` starts without errors
- [ ] Content API endpoint responds with JSON
- [ ] MCP server starts with `npm run mcp`
- [ ] Hermes integration works (if configured)
- [ ] Investor CRM component renders at `/dashboard/investors`
- [ ] All new files committed to git
- [ ] GitHub token rotated (if previously exposed)

---

## 🔄 Rollback Instructions

If you need to revert:
```bash
# 1. Reset git changes
git reset --hard HEAD

# 2. Remove new dependencies
npm uninstall @modelcontextprotocol/sdk ai @ai-sdk/openai

# 3. Remove new files
rm -rf src/lib/mcp-server.ts \
       src/lib/content-studio.ts \
       src/components/InvestorCRM.tsx \
       src/app/api/content/ \
       scripts/setup-hermes-mcp.sh \
       UPGRADE_GUIDE.md

# 4. Revert package.json
git checkout package.json

# 5. Restart dev server
npm run dev
```

---

## 📞 Need Help?

1. Check `UPGRADE_GUIDE.md` for detailed docs
2. Review browser console + server logs
3. Test each feature individually
4. Open issue: https://github.com/thisisniagahub/GANGNIAGA-OS/issues

> 🇲🇾 **You got this, Bo!**  
> V0.4.0 is now live in your repo. Time to build something amazing. 🚀
