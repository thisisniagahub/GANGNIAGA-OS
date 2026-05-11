import { NextResponse } from 'next/server';
import { getProviderType, getProviderDescription } from '@/lib/ai-provider';

/**
 * GET /api/ai/status
 * Returns the current AI provider status and capabilities.
 */
export async function GET() {
  try {
    const providerType = getProviderType();
    const providerDescription = getProviderDescription();

    const capabilities = {
      chat: providerType !== 'none',
      imageGeneration: providerType !== 'none',
      textToSpeech: providerType !== 'none',
      speechToText: providerType !== 'none',
      webSearch: providerType !== 'none',
      vision: providerType !== 'none',
    };

    // Count how many capabilities are available
    const capabilityCount = Object.values(capabilities).filter(Boolean).length;

    return NextResponse.json({
      provider: providerType,
      description: providerDescription,
      capabilities,
      capabilityCount,
      totalCapabilities: Object.keys(capabilities).length,
      isConfigured: providerType !== 'none',
      setupInstructions: providerType === 'none'
        ? 'Set OPENAI_API_KEY environment variable for production, or ensure z-ai-web-dev-sdk is available for development.'
        : null,
    });
  } catch (error) {
    console.error('[/api/ai/status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI status' },
      { status: 500 }
    );
  }
}
