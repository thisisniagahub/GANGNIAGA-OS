import { NextResponse } from 'next/server';
import { getAI } from '@/lib/ai-provider';
import { z } from 'zod';

const ContentSchema = z.object({
  platform: z.enum(['tiktok', 'instagram', 'facebook', 'shopee']),
  topic: z.string().min(5).max(500),
  brandVoice: z.string().optional(),
  targetAudience: z.string().optional(),
  includeHashtags: z.boolean().default(true),
  includeScript: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ContentSchema.parse(body);

    const { platform, topic, brandVoice, targetAudience, includeHashtags, includeScript } = validated;

    const prompt = `
      You are a Social Media Expert for a Malaysian startup.
      
      Platform: ${platform.toUpperCase()}
      Topic: ${topic}
      Brand Voice: ${brandVoice || 'Friendly, authentic, Bahasa Rojak style'}
      Target Audience: ${targetAudience || 'Young Malaysian entrepreneurs, 18-35'}
      
      Generate content that is:
      - Engaging and viral-worthy
      - Culturally relevant to SEA/Malaysia
      - Optimized for ${platform} algorithm
      
      ${includeScript ? `- Include a short video script (hook + body + CTA)` : ''}
      ${includeHashtags ? `- Include 5-10 relevant hashtags (mix of trending + niche)` : ''}
      
      Output format: JSON with { hook, caption, script?, hashtags, shopee_keywords? }
    `;

    const ai = await getAI();
    const response = await ai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a content creation expert for ASEAN startups. Output valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    let content = response.choices[0].message.content || '{}';
    
    try {
      content = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsedContent = JSON.parse(content);
      
      const optimized = {
        ...parsedContent,
        platform,
        generated_at: new Date().toISOString(),
        shopee_keywords: platform === 'shopee' 
          ? [topic, 'viral', 'trending', 'murah', 'bestseller'] 
          : undefined,
        engagement_tips: getEngagementTips(platform, topic),
      };

      return NextResponse.json({ success: true, data: optimized });
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate content. Please try again.',
        raw_response: content.substring(0, 200)
      }, { status: 500 });
    }

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input', 
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error('Content generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to generate content' 
    }, { status: 500 });
  }
}

function getEngagementTips(platform: string, topic: string): string[] {
  const tips: Record<string, string[]> = {
    tiktok: [
      'Use trending sounds in first 3 seconds',
      'Add text overlay for silent viewers',
      'Post between 7-9PM MYT for max reach',
      `Use #${topic.replace(/\s+/g, '')}My hashtag`,
    ],
    instagram: [
      'Post carousel with 5-7 slides for higher engagement',
      'Use 20-30 hashtags (mix of broad + niche)',
      'Add location tag for local discovery',
      'Engage with comments in first hour',
    ],
    facebook: [
      'Ask a question to boost comments',
      'Use emotional hook in first line',
      'Post with image/video gets 2.3x more engagement',
      'Share in relevant Malaysian entrepreneur groups',
    ],
    shopee: [
      'Use "Flash Sale" or "Limited Stock" urgency',
      'Include price comparison (before/after)',
      'Add free shipping badge in thumbnail',
      'Use Shopee Live for product demo',
    ],
  };
  return tips[platform] || [];
}

export async function GET() {
  return NextResponse.json({
    message: 'Content Generation API - POST with { platform, topic, brandVoice? }',
    supported_platforms: ['tiktok', 'instagram', 'facebook', 'shopee'],
    example_request: {
      platform: 'tiktok',
      topic: 'AI tools for small business',
      brandVoice: 'Casual, helpful, Malaysian English',
      includeHashtags: true,
      includeScript: true
    }
  });
}
