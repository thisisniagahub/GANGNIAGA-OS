#!/bin/bash
# GANGNIAGA-OS: Hermes MCP Integration Setup
# Run this script to configure Hermes Agent to use GANGNIAGA-OS as an MCP server

set -e

echo "🔧 GANGNIAGA-OS Hermes MCP Setup"
echo "================================"

# Check if Hermes config directory exists
HERMES_CONFIG_DIR="$HOME/.hermes-agent"
if [ ! -d "$HERMES_CONFIG_DIR" ]; then
  echo "⚠️  Hermes config directory not found: $HERMES_CONFIG_DIR"
  echo "📝 Please install Hermes Agent first: https://hermes-agent.nousresearch.com/docs"
  exit 1
fi

# Get the absolute path to GANGNIAGA-OS
GANGNIAGA_PATH="$(cd "$(dirname "$0")/.." && pwd)"
echo "📁 GANGNIAGA-OS path: $GANGNIAGA_PATH"

# Backup existing config
if [ -f "$HERMES_CONFIG_DIR/config.yaml" ]; then
  cp "$HERMES_CONFIG_DIR/config.yaml" "$HERMES_CONFIG_DIR/config.yaml.bak.$(date +%Y%m%d%H%M%S)"
  echo "💾 Backed up existing config"
fi

# Append MCP server config to Hermes config
cat >> "$HERMES_CONFIG_DIR/config.yaml" << EOF

# GANGNIAGA-OS MCP Integration (added $(date))
mcp_servers:
  gangniaga:
    command: "npm"
    args:
      - "run"
      - "mcp"
      - "--prefix"
      - "$GANGNIAGA_PATH"
    env:
      DATABASE_URL: "\${DATABASE_URL}"
      SUPABASE_URL: "\${SUPABASE_URL}"
      SUPABASE_ANON_KEY: "\${SUPABASE_ANON_KEY}"
      AI_MODEL: "\${AI_MODEL}"
EOF

echo "✅ Added GANGNIAGA-OS MCP server to Hermes config"
echo ""
echo "🚀 Next steps:"
echo "1. Restart Hermes: hermes restart"
echo "2. Test integration:"
echo "   hermes ask 'What is my business niche?'"
echo "   hermes ask 'Check my burn rate'"
echo "   hermes ask 'Generate TikTok script about AI tools'"
echo ""
echo "📚 Available GANGNIAGA MCP tools:"
echo "   • get_business_strategy - Get lean canvas & target audience"
echo "   • check_burn_rate - Financial health & runway alert"
echo "   • create_content_draft - AI content for TikTok/IG/FB/Shopee"
echo "   • update_investor_stage - Track investor pipeline"
echo "   • get_content_calendar - View scheduled posts"
echo "   • get_business_health - One-command business summary"
echo ""
echo "🔐 Note: Ensure your .env variables are set for GANGNIAGA-OS"
echo "🐛 Troubleshooting: Check logs with 'npm run mcp' directly"
