# 🛠️ Vercel Deployment Fix Summary - V0.4.0-Hermes

## ✅ Issues Fixed

### 1. Vercel Build Crash (MCP Server)
- **Problem**: `mcp-server.ts` uses `StdioServerTransport` which cannot be bundled for Vercel serverless
- **Fix**: Added webpack `ignoreWarnings` in `next.config.ts` to exclude MCP files from build

### 2. OpenAI Dependency Removed
- **Problem**: User requested NO OpenAI, only Hermes Agent
- **Fix**: Updated all AI calls to use `hermes.ts` client exclusively:
  - `src/lib/content-studio.ts` → Uses `hermes.chatCompletion()` instead of `getAI()`
  - `src/app/api/content/generate/route.ts` → Uses Hermes directly
  - `src/lib/hermes.ts` → Removed OpenAI fallback, returns helpful error instead

### 3. Environment Variables Updated
- **Fix**: Added Hermes-specific env vars to `.env.example`:
  ```bash
  NEXT_PUBLIC_HERMES_AGENT_URL=https://hermes-agent.nousresearch.com/api/v1
  HERMES_API_KEY=your_hermes_api_key_here
  HERMES_MODEL=owl-alpha
  ```

## 🚀 Deployment Instructions (Vercel)

### Step 1: Set Environment Variables in Vercel Dashboard
Go to: https://vercel.com/thisisniagahub/gangniaga-ai-os/settings/environment-variables

Add these:
```
NEXT_PUBLIC_HERMES_AGENT_URL = https://hermes-agent.nousresearch.com/api/v1
HERMES_API_KEY = [your actual key]
HERMES_MODEL = owl-alpha
```

### Step 2: Redeploy
1. Push this commit: `git push origin main`
2. Vercel will auto-detect and rebuild
3. Build should now pass ✅

### Step 3: Test
```bash
# Test Content API
curl -X POST https://your-vercel-url/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{"platform":"tiktok","topic":"AI for SMEs"}'
```

## 📁 Files Modified

| File | Change |
|------|--------|
| `next.config.ts` | Added webpack ignore for MCP server |
| `src/lib/hermes.ts` | Removed OpenAI fallback |
| `src/lib/content-studio.ts` | Switched from `getAI()` to `hermes.chatCompletion()` |
| `src/app/api/content/generate/route.ts` | Switched to Hermes client |
| `.env.example` | Added Hermes env vars documentation |

## ⚠️ Important Notes

1. **NO OpenAI fallback**: If Hermes is unreachable, the app will return an error message instead of falling back to OpenAI (per user requirements).

2. **Hermes URL must be accessible**: Ensure `NEXT_PUBLIC_HERMES_AGENT_URL` points to a reachable endpoint (public API or properly proxied).

3. **MCP Server runs locally only**: The MCP server (`npm run mcp`) is for local development with Hermes desktop app. It does NOT run on Vercel.

## 🔐 Security Reminder

If you used a GitHub token for this push, **revoke it immediately** after:
👉 https://github.com/settings/tokens

---

*Generated: $(date)*
*Fix applied by: GANGNIAGA-OS Auto-Fix Script*
