# Task 6: Upgrade OpenClaw Gateway Tab to Connect to Real AI Gateway Backend

## Agent: Subagent (full-stack-developer)

## Work Log:

### Gateway Tab Upgrades

1. **AI Gateway Always Active (Serverless)**
   - Updated `handleGatewayAction` to reflect that the AI Gateway runs via Vercel serverless functions (always available, no start/stop needed)
   - "Stop" button now shows info toast explaining serverless nature
   - "Start" button confirms the gateway is always active
   - "Restart" now triggers a health check refresh instead

2. **Real Health Check via `/api/gateway/status`**
   - `handleHealthCheck` now calls `GET /api/gateway/status` to fetch real gateway data
   - Updates `gatewayApiStatus` state with channels, totalMessages, todayStats, activeSessions
   - Falls back to local status on API error
   - Stats grid now shows: Active Channels, Total Messages, Today Inbound, Today Outbound, Active Sessions, Version, Last Health Check

3. **AI Capabilities Panel** (new section in Gateway tab)
   - Added 7 AI capabilities with icons, descriptions, and "Test" buttons:
     - LLM Chat → `/api/ai/chat`
     - Image Generation → `/api/ai/image`
     - Text-to-Speech → `/api/ai/tts`
     - Speech-to-Text → `/api/ai/asr`
     - Web Search → `/api/ai/search`
     - Web Page Reader → `/api/ai/read`
     - Vision Analysis → `/api/ai/vision`
   - Each Test button shows loading spinner during API call
   - Results displayed inline (✅ Working, ⚠️ error, ❌ failed)
   - `handleTestCapability` sends appropriate test payload to each endpoint

4. **Test AI Gateway** (new section)
   - "Test AI" button sends test message to `/api/ai/chat`
   - Displays AI response in a bordered panel below the button
   - Shows loading spinner during request

5. **useEffect on mount** — fetches initial gateway status and loads skills

### Channels Tab Upgrades

6. **Telegram Setup**
   - New "Setup Telegram" button in channel header
   - Dialog with Bot Token input (password type)
   - On save, calls `POST /api/gateway/telegram/setup` with the bot token
   - Shows success message with bot username and webhook URL
   - Copy webhook URL button
   - Automatically adds/updates Telegram channel in Zustand store

7. **WhatsApp Setup**
   - New "Setup WhatsApp" button in channel header
   - Dialog with 3 inputs: Phone Number ID, Access Token (password), Verify Token
   - Helper text for each field explaining where to get the values
   - On save, calls `POST /api/gateway/whatsapp/setup` with all 3 fields
   - Shows success message with business name and webhook URL
   - Copy webhook URL button
   - Note about subscribing webhook URL in Meta Business Suite
   - Automatically adds/updates WhatsApp channel in Zustand store

8. **Channel Status** — Gateway status loaded from `/api/gateway/status` on mount

### Plugins Tab Upgrades

9. **AI Skills as Plugins**
   - Skills loaded from `GET /api/skills` on mount
   - Skills badge showing count in header
   - "Refresh Skills" button to reload
   - Each skill shows: name, description, category badge, usage count, trigger phrase (slash command)
   - "Execute" button opens a dialog

10. **Skill Execute Dialog**
    - Opens with skill name and slug
    - Textarea for user input
    - "Run Skill" button calls `POST /api/skills/execute` with `{ skillSlug, input }`
    - Response displayed in scrollable panel below
    - Loading spinner during execution

11. **Existing Plugins** section now separated with "Installed Plugins" header and separator

### New State Variables Added
- `gatewayApiStatus`, `aiTestLoading`, `aiTestResponse`
- `capabilityTests` — Record<string, { loading, result }>
- `telegramSetupOpen`, `telegramBotToken`, `telegramSetupLoading`, `telegramWebhookUrl`, `telegramBotInfo`
- `whatsappSetupOpen`, `whatsappPhoneNumberId`, `whatsappAccessToken`, `whatsappVerifyToken`, `whatsappSetupLoading`, `whatsappWebhookUrl`, `whatsappBusinessName`
- `skills`, `skillsLoading`, `skillExecuteOpen`, `skillExecuteSlug`, `skillExecuteName`, `skillExecuteInput`, `skillExecuteLoading`, `skillExecuteResponse`

### New Lucide Icons Added
- `Mic`, `ImageIcon`, `Search`, `BookOpen`, `Volume2`, `Brain`, `Wrench`, `PlayCircle`, `Copy`

### Code Quality
- Fixed `handleHealthCheck` / `handleGatewayAction` ordering to avoid forward reference
- Added `handleHealthCheck` to `handleGatewayAction` dependency array
- All new API calls use proper error handling with try/catch
- Loading states with spinners on all interactive buttons
- Toast notifications for success/error feedback
- Lint passes clean with no errors
- Dev server compiling and serving 200s

## Stage Summary:
- Gateway tab now shows real API-driven status with always-active serverless badge
- 7 AI capabilities with testable endpoints
- Test AI button with live response display
- Telegram and WhatsApp setup dialogs with real API integration and webhook URL display
- AI Skills loaded from API and executable with input dialog
- All changes follow existing emerald/teal/amber color scheme and animation patterns
- No lint errors, no regressions
