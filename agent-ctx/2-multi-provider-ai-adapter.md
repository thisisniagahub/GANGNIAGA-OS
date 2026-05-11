# Task ID: 2 — Multi-Provider AI Adapter

## Agent: Multi-Provider AI Adapter Agent

## Summary
Created a multi-provider AI adapter that allows GangNiaga AI OS to work with both the Z AI SDK (dev/sandbox) and OpenAI-compatible APIs (production/Vercel), with graceful degradation when no provider is configured.

## Files Modified
- **Created**: `/home/z/my-project/src/lib/ai-provider.ts` (~440 lines)
- **Modified**: `/home/z/my-project/src/lib/zai.ts` (simplified to delegate to ai-provider.ts)

## Key Decisions
1. **No `openai` npm package** — used raw `fetch` calls to keep the bundle small
2. **Dynamic import** of `z-ai-web-dev-sdk` in ZAI provider to avoid bundling when not needed
3. **Response compatibility** — OpenAI TTS returns audio as `Response` with `arrayBuffer()`, ASR returns `Response` with `json()`, matching ZAI SDK behavior so existing API routes don't need changes
4. **Image response mapping** — OpenAI returns `b64_json` while ZAI returns `base64`; adapter maps between them
5. **Web search / page reader fallback** — Uses chat completions with specialized system prompts since OpenAI has no direct equivalents

## Provider Detection Priority
1. `ZAI_BASE_URL` env var set → ZAI SDK
2. `z-ai-web-dev-sdk` package resolvable → ZAI SDK  
3. `OPENAI_API_KEY` env var set → OpenAI-compatible
4. Neither → No-op with helpful errors

## Environment Variables (new)
- `OPENAI_API_KEY` — Required for OpenAI mode
- `OPENAI_BASE_URL` — Custom base URL (default: https://api.openai.com/v1)
- `OPENAI_CHAT_MODEL` — Default: gpt-4o
- `OPENAI_VISION_MODEL` — Default: gpt-4o
- `OPENAI_IMAGE_MODEL` — Default: dall-e-3
- `OPENAI_TTS_MODEL` — Default: tts-1
- `OPENAI_ASR_MODEL` — Default: whisper-1

## Verification
- `bun run lint` passes clean
- Dev server running and serving 200s
- All existing API routes that import `getZAI` from `@/lib/zai` continue to work unchanged
