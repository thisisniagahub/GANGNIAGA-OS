// Hermes Agent Client - NO FALLBACK TO OPENAI
// Uses direct HTTP to Hermes Agent API only

export interface HermesMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface HermesConfig {
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
}

export class HermesClient {
  private config: HermesConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_HERMES_AGENT_URL || '',
      apiKey: process.env.HERMES_API_KEY || '',
      defaultModel: process.env.HERMES_MODEL || 'openrouter/owl-alpha',
    };
  }

  isConfigured(): boolean {
    return !!this.config.baseUrl;
  }

  async chatCompletion(messages: HermesMessage[], model?: string): Promise<any> {
    const activeModel = model || this.config.defaultModel;

    // Fallback detection if Hermes is not configured
    if (!this.isConfigured()) {
      console.warn('Hermes Agent URL is not configured. Falling back to active AI Provider.');
      return this.fallbackCompletion(messages, activeModel);
    }

    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            messages,
            model: activeModel,
          }),
        });

        if (!response.ok) {
          throw new Error(`Hermes API error: ${response.status} ${await response.text()}`);
        }

        return await response.json();
      } catch (error: any) {
        attempt++;
        console.error(`Hermes connection attempt ${attempt} failed: ${error.message}`);
        if (attempt > maxRetries) {
          console.warn('Hermes Max Retries Exceeded. Initiating provider fallback...');
          return this.fallbackCompletion(messages, activeModel);
        }
        // Small delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  private async fallbackCompletion(messages: HermesMessage[], model: string): Promise<any> {
    // NO OPENAI FALLBACK - Return error message instead
    console.warn('Hermes Agent not reachable. No OpenAI fallback allowed.');
    return {
      choices: [{
        message: {
          role: 'assistant',
          content: '⚠️ Hermes Agent connection failed. Please ensure HERMES_API_URL is configured in Vercel environment variables. OpenAI fallback is disabled per project requirements.'
        }
      }]
    };
  }
}

export const hermes = new HermesClient();
