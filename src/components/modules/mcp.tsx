'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Cpu, Play, Power, AlertTriangle, CheckCircle, RefreshCw, ChevronDown, ChevronRight, Terminal } from 'lucide-react';

interface McpServer {
  name: string;
  command: string;
  args: string[];
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}

interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  serverName: string;
}

export default function McpModule() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [tools, setTools] = useState<Record<string, McpTool[]>>({});
  const [expandedServer, setExpandedServer] = useState<string | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedTool, setSelectedTool] = useState<McpTool | null>(null);
  const [toolArgs, setToolArgs] = useState<string>('{}');
  const [toolResult, setToolResult] = useState<any>(null);
  const [executing, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/mcp');
      const data = await res.json();
      if (data.success) {
        setServers(data.servers);
        
        // Fetch tools for already connected servers
        for (const server of data.servers) {
          if (server.status === 'connected') {
            fetchTools(server.name);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load MCP servers', err);
    }
  };

  const fetchTools = async (serverName: string) => {
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_tools', serverName }),
      });
      const data = await res.json();
      if (data.success) {
        setTools(prev => ({ ...prev, [serverName]: data.tools }));
      }
    } catch (err) {
      console.error(`Failed to load tools for ${serverName}`, err);
    }
  };

  const handleConnect = async (serverName: string) => {
    setLoading(prev => ({ ...prev, [serverName]: true }));
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', serverName }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchServers();
      }
    } catch (err) {
      console.error(`Failed to connect ${serverName}`, err);
    } finally {
      setLoading(prev => ({ ...prev, [serverName]: false }));
    }
  };

  const handleExecuteTool = async () => {
    if (!selectedTool) return;
    setExecuting(true);
    setToolResult(null);
    try {
      const parsedArgs = JSON.parse(toolArgs);
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'call_tool',
          serverName: selectedTool.serverName,
          toolName: selectedTool.name,
          arguments: parsedArgs
        }),
      });
      const data = await res.json();
      setToolResult(data.success ? data.result : { error: data.error });
    } catch (err: any) {
      setToolResult({ error: `JSON Parse or Network Error: ${err.message}` });
    } finally {
      setExecuting(false);
    }
  };

  const toggleExpand = (serverName: string) => {
    if (expandedServer === serverName) {
      setExpandedServer(null);
    } else {
      setExpandedServer(serverName);
      if (!tools[serverName]) {
        fetchTools(serverName);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto main-content">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Model Context Protocol (MCP)
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect external context servers, discover tools, and delegate execution tasks safely.
          </p>
        </div>
        <Button onClick={fetchServers} size="sm" variant="outline" className="gap-2 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10">
          <RefreshCw className="size-4 animate-spin-slow" />
          Sync Servers
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Server Configuration List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="text-indigo-400 size-5" /> Configured MCP Servers
          </h2>

          {servers.map((server) => (
            <Card key={server.name} className="glass-panel border-border/40 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {server.name}
                    {server.status === 'connected' && (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Connected</Badge>
                    )}
                    {server.status === 'disconnected' && (
                      <Badge variant="secondary" className="text-muted-foreground">Disconnected</Badge>
                    )}
                    {server.status === 'error' && (
                      <Badge variant="destructive" className="bg-rose-500/15 text-rose-400 border-rose-500/20">Error</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-muted-foreground bg-black/30 p-2 rounded border border-white/5 inline-block">
                    {server.command} {server.args.join(' ')}
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={server.status === 'connected' ? 'outline' : 'default'}
                    onClick={() => handleConnect(server.name)}
                    disabled={loading[server.name]}
                    className={server.status !== 'connected' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
                  >
                    {loading[server.name] ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : server.status === 'connected' ? (
                      <Power className="size-4 text-rose-500 mr-1" />
                    ) : (
                      <Play className="size-4 mr-1" />
                    )}
                    {server.status === 'connected' ? 'Reconnect' : 'Connect'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleExpand(server.name)}>
                    {expandedServer === server.name ? <ChevronDown /> : <ChevronRight />}
                  </Button>
                </div>
              </CardHeader>

              {expandedServer === server.name && (
                <CardContent className="border-t border-border/20 pt-4 space-y-3">
                  {server.error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                      <AlertTriangle className="size-4 flex-shrink-0" />
                      <span>{server.error}</span>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Exposed Tools</h4>
                    {!tools[server.name] ? (
                      <p className="text-sm text-muted-foreground">Loading tools...</p>
                    ) : tools[server.name].length === 0 ? (
                      <p className="text-sm text-muted-foreground">No tools exposed by this server.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tools[server.name].map(t => (
                          <div
                            key={t.name}
                            onClick={() => {
                              setSelectedTool(t);
                              // Auto populate schema format
                              setToolArgs(JSON.stringify(
                                Object.keys(t.inputSchema?.properties || {}).reduce((acc, k) => ({ ...acc, [k]: "" }), {}),
                                null,
                                2
                              ));
                              setToolResult(null);
                            }}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                              selectedTool?.name === t.name
                                ? 'bg-indigo-500/10 border-indigo-500/50'
                                : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/35'
                            }`}
                          >
                            <div className="font-semibold text-sm text-indigo-300 font-mono">{t.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{t.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Right Side: Tool Execution Playground */}
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Terminal className="text-indigo-400 size-5" /> Tool Executor Playground
          </h2>

          <Card className="glass-panel border-border/40 h-[calc(100vh-230px)] flex flex-col">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-base">
                {selectedTool ? (
                  <span className="font-mono text-indigo-300">{selectedTool.name}</span>
                ) : (
                  <span className="text-muted-foreground">Select a tool to test</span>
                )}
              </CardTitle>
              {selectedTool && (
                <CardDescription className="text-xs">{selectedTool.description}</CardDescription>
              )}
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTool ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Arguments (JSON format)</label>
                    <Textarea
                      value={toolArgs}
                      onChange={(e) => setToolArgs(e.target.value)}
                      className="font-mono text-xs h-36 bg-black/40 border-white/10 focus:border-indigo-500/50"
                    />
                  </div>

                  <Button
                    onClick={handleExecuteTool}
                    disabled={executing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                  >
                    {executing ? <RefreshCw className="size-4 animate-spin" /> : <Play className="size-4" />}
                    Execute Tool
                  </Button>

                  {toolResult && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground">Execution Result</label>
                      <pre className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-xs overflow-auto max-h-60 text-emerald-400">
                        {JSON.stringify(toolResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-12">
                  <Terminal className="size-12 opacity-20" />
                  <p className="text-sm">Exposed server tools will appear here for interactive testing.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
