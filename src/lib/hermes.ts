import { getAI } from './ai-provider';

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
    try {
      const ai = await getAI();
      const response = await ai.chat.completions.create({
        model: model,
        messages: messages
      });
      return response;
    } catch (error: any) {
      throw new Error(`Fallback AI completion failed: ${error.message}`);
    }
  }
}

export const hermes = new HermesClient();
