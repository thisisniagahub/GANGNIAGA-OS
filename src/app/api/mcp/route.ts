import { NextRequest, NextResponse } from 'next/server';
import { mcpManager } from '@/lib/mcp';

// GET: List all configured MCP servers and their statuses
export async function GET() {
  try {
    const servers = mcpManager.getServers();
    return NextResponse.json({ success: true, servers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Manage connections and execute tool calls
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, serverName, toolName, arguments: toolArgs } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required ('connect' | 'list_tools' | 'call_tool')" }, { status: 400 });
    }

    if (!serverName) {
      return NextResponse.json({ success: false, error: "Server name is required" }, { status: 400 });
    }

    switch (action) {
      case 'connect': {
        await mcpManager.connect(serverName);
        const servers = mcpManager.getServers();
        return NextResponse.json({ success: true, message: `Connected to ${serverName}`, servers });
      }

      case 'list_tools': {
        // Ensure connected
        await mcpManager.connect(serverName);
        const tools = await mcpManager.listTools(serverName);
        return NextResponse.json({ success: true, tools });
      }

      case 'call_tool': {
        if (!toolName) {
          return NextResponse.json({ success: false, error: "Tool name is required for call_tool action" }, { status: 400 });
        }
        // Ensure connected
        await mcpManager.connect(serverName);
        const result = await mcpManager.callTool(serverName, toolName, toolArgs || {});
        return NextResponse.json({ success: true, result });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
