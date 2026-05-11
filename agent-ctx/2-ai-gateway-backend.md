# Task 2 - AI Gateway Backend Agent

## Task: Build Real AI Gateway Backend APIs

### Work Log

- Created shared ZAI SDK helper at `src/lib/zai.ts`:
  - Singleton `getZAI()` function that reuses one ZAI instance across all API routes
  - `SOUL_PROMPT` export containing the full GangNiaga AI personality from SOUL.md (15 behavioral rules, tone, language, specialty)

- Created 7 AI Gateway API routes under `src/app/api/ai/`:

1. **`/api/ai/chat/route.ts`** — Full LLM chat with SOUL.md personality injection
   - Accepts: `{ message, history?, systemPrompt? }`
   - Uses SOUL_PROMPT as default system prompt, overridable via systemPrompt param
   - Supports conversation history (last 20 messages) for multi-turn chat
   - Returns: `{ response, usage }`

2. **`/api/ai/image/route.ts`** — Image generation endpoint
   - Accepts: `{ prompt, size? }` (size: 1024x1024 | 1344x768 | 768x1344, default 1024x1024)
   - Validates size against allowed values, falls back to default
   - Returns: `{ image (base64), size, prompt }`

3. **`/api/ai/tts/route.ts`** — Text-to-speech endpoint
   - Accepts: `{ text, voice? }` (10 voices: alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer)
   - Validates text length (max 4096 chars)
   - Returns audio/mpeg binary response with proper Content-Type and Cache-Control headers

4. **`/api/ai/asr/route.ts`** — Speech-to-text (audio transcription) endpoint
   - Accepts: `{ audio (base64), format? }` (wav, mp3, ogg, flac, m4a, webm)
   - Returns: `{ transcription, format }`

5. **`/api/ai/search/route.ts`** — Web search endpoint
   - Accepts: `{ query }` (max 500 chars)
   - Uses `zai.functions.invoke('web_search', { query })` under the hood
   - Returns: `{ results, query }`

6. **`/api/ai/read/route.ts`** — Web page reader endpoint
   - Accepts: `{ url }` with URL format validation
   - Uses `zai.functions.invoke('page_reader', { url })` under the hood
   - Returns: `{ title, html, publishedTime, url }`

7. **`/api/ai/vision/route.ts`** — Vision/image analysis endpoint
   - Accepts: `{ image (base64), prompt? }` with auto data URI prefix handling
   - Uses `zai.chat.completions.createVision()` with multimodal message content
   - Default prompt: detailed image description for business context
   - Returns: `{ analysis, prompt, usage }`

### Implementation Details
- All routes use singleton `getZAI()` from shared helper — no new ZAI instance per request
- All routes export `async function POST` for Next.js App Router compatibility
- All routes validate required params and return 400 for missing/invalid input
- All routes include try/catch error handling with console.error logging
- All routes return proper NextResponse.json() with appropriate HTTP status codes (200, 400, 500)
- Total: 8 files created (1 shared helper + 7 route files), 451 lines of code
- `bun run lint` passes clean with no errors
- Dev server compiling and serving 200s

### Stage Summary
- All 7 AI Gateway API routes fully implemented with z-ai-web-dev-sdk
- Shared singleton helper prevents redundant ZAI instance creation
- SOUL.md personality injected by default into all chat interactions
- Input validation, error handling, and proper HTTP status codes throughout
- No existing files modified — all new code in isolated /api/ai/ directory
- Lint passes clean, dev server running successfully
