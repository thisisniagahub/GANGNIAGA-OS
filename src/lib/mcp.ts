import { spawn, ChildProcess } from 'child_process';

export interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  serverName: string;
}

class McpManager {
  private activeProcesses: Map<string, { process: ChildProcess; idCounter: number; pendingRequests: Map<number, (res: any) => void> }> = new Map();
  private servers: McpServerConfig[] = [
    {
      name: 'filesystem',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', 'C:\\projects\\PROJECT-GANGNIAGA'],
      status: 'disconnected',
    },
    {
      name: 'fetch',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-fetch'],
      status: 'disconnected',
    }
  ];

  getServers(): McpServerConfig[] {
    return this.servers;
  }

  async connectAll(): Promise<void> {
    for (const server of this.servers) {
      if (server.status !== 'connected') {
        try {
          await this.connect(server.name);
        } catch (err: any) {
          console.error(`Failed to auto-connect to MCP server ${server.name}: ${err.message}`);
        }
      }
    }
  }

  async connect(name: string): Promise<boolean> {
    const config = this.servers.find(s => s.name === name);
    if (!config) throw new Error(`MCP Server ${name} not found in configuration.`);

    if (this.activeProcesses.has(name)) {
      return true;
    }

    return new Promise((resolve, reject) => {
      try {
        console.log(`Launching MCP Server: ${name} (${config.command} ${config.args.join(' ')})`);
        
        // Spawn the MCP server process
        const proc = spawn(config.command, config.args, {
          shell: true,
          stdio: ['pipe', 'pipe', 'inherit'] // pipe stdin/stdout, inherit stderr
        });

        const serverSession = {
          process: proc,
          idCounter: 1,
          pendingRequests: new Map<number, (res: any) => void>()
        };

        this.activeProcesses.set(name, serverSession);

        proc.on('error', (err) => {
          config.status = 'error';
          config.error = err.message;
          reject(err);
        });

        // Setup stream reading
        let buffer = '';
        proc.stdout?.on('data', (data) => {
          buffer += data.toString();
          let lineEnd;
          while ((lineEnd = buffer.indexOf('\n')) !== -1) {
            const line = buffer.substring(0, lineEnd).trim();
            buffer = buffer.substring(lineEnd + 1);
            if (line) {
              try {
                const response = JSON.parse(line);
                if (response.id !== undefined) {
                  const resolver = serverSession.pendingRequests.get(response.id);
                  if (resolver) {
                    resolver(response);
                    serverSession.pendingRequests.delete(response.id);
                  }
                }
              } catch (e: any) {
                console.error(`Failed to parse MCP response line: ${line}`, e);
              }
            }
          }
        });

        proc.on('close', (code) => {
          console.log(`MCP Server ${name} exited with code ${code}`);
          config.status = 'disconnected';
          this.activeProcesses.delete(name);
        });

        // Handshake: Initialize request
        const initId = serverSession.idCounter++;
        const initRequest = {
          jsonrpc: '2.0',
          id: initId,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'gangniaga-mcp-client', version: '1.0.0' }
          }
        };

        serverSession.pendingRequests.set(initId, (response) => {
          if (response.error) {
            config.status = 'error';
            config.error = response.error.message;
            reject(new Error(`Handshake error: ${response.error.message}`));
          } else {
            // Handshake completed, send initialized notification
            proc.stdin?.write(JSON.stringify({
              jsonrpc: '2.0',
              method: 'notifications/initialized'
            }) + '\n');

            config.status = 'connected';
            config.error = undefined;
            console.log(`MCP Server ${name} successfully connected!`);
            resolve(true);
          }
        });

        proc.stdin?.write(JSON.stringify(initRequest) + '\n');
        
        // Timeout handshake after 8 seconds
        setTimeout(() => {
          if (config.status !== 'connected') {
            proc.kill();
            config.status = 'error';
            config.error = 'Handshake timeout';
            reject(new Error('MCP server handshake timeout (8s)'));
          }
        }, 8000);

      } catch (err: any) {
        config.status = 'error';
        config.error = err.message;
        reject(err);
      }
    });
  }

  async listTools(name: string): Promise<McpTool[]> {
    const session = this.activeProcesses.get(name);
    if (!session || !session.process.stdin) {
      throw new Error(`MCP Server ${name} is not connected.`);
    }

    return new Promise((resolve, reject) => {
      const id = session.idCounter++;
      const request = {
        jsonrpc: '2.0',
        id,
        method: 'tools/list',
        params: {}
      };

      session.pendingRequests.set(id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          const tools = (response.result?.tools || []).map((t: any) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
            serverName: name
          }));
          resolve(tools);
        }
      });

      session.process.stdin?.write(JSON.stringify(request) + '\n');
    });
  }

  async callTool(serverName: string, toolName: string, args: Record<string, any>): Promise<any> {
    const session = this.activeProcesses.get(serverName);
    if (!session || !session.process.stdin) {
      throw new Error(`MCP Server ${serverName} is not connected.`);
    }

    return new Promise((resolve, reject) => {
      const id = session.idCounter++;
      const request = {
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      };

      session.pendingRequests.set(id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });

      session.process.stdin?.write(JSON.stringify(request) + '\n');
    });
  }

  disconnect(name: string): void {
    const session = this.activeProcesses.get(name);
    if (session) {
      session.process.kill();
      this.activeProcesses.delete(name);
      const config = this.servers.find(s => s.name === name);
      if (config) config.status = 'disconnected';
    }
  }
}

export const mcpManager = new McpManager();
export default mcpManager;
