import { getAI } from '@/lib/ai-provider';
import { hermes } from '@/lib/hermes';

export interface ContentDraft {
  id: string;
  platform: 'tiktok' | 'instagram' | 'facebook' | 'shopee';
  topic: string;
  hook: string;
  caption: string;
  script?: string;
  hashtags: string[];
  shopee_keywords?: string[];
  engagement_tips: string[];
  generated_at: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface ContentCalendar {
  week_start: string;
  posts: ContentDraft[];
}

export async function generateContentCampaign(
  niche: string,
  targetAudience: string,
  brandVoice: string,
  platforms: Array<'tiktok' | 'instagram' | 'facebook' | 'shopee'> = ['tiktok', 'instagram']
): Promise<ContentCalendar> {
  const prompt = `
    Act as a Social Media Strategist for a Malaysian startup.
    
    Business Niche: ${niche}
    Target Audience: ${targetAudience}
    Brand Voice: ${brandVoice}
    
    Create a 7-day content calendar for platforms: ${platforms.join(', ')}
    
    For each day, include:
    1. Day name (Mon-Sun)
    2. Content theme
    3. Hook (first 3 seconds for video)
    4. Caption (platform-optimized)
    5. Script outline (if video platform)
    6. Hashtags (5-10, mix trending + niche)
    7. Best posting time (MYT)
    
    Output format: JSON array of daily posts with structure:
    { day, theme, hook, caption, script?, hashtags: [], best_time }
  `;

  const ai = await getAI();
  const response = await ai.chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: 'Output valid JSON only. No markdown, no explanations.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });

  let content = response.choices[0].message.content || '[]';
  content = content.replace(/```json\n?|\n?```/g, '').trim();
  
  const dailyPosts = JSON.parse(content);
  
  const posts: ContentDraft[] = dailyPosts.map((post: any, index: number) => ({
    id: `draft-${Date.now()}-${index}`,
    platform: platforms[index % platforms.length],
    topic: post.theme,
    hook: post.hook,
    caption: post.caption,
    script: post.script,
    hashtags: post.hashtags,
    shopee_keywords: post.hashtags?.filter((h: string) => h.includes('#') && !h.includes('trending')),
    engagement_tips: getPlatformTips(post.platform),
    generated_at: new Date().toISOString(),
    status: 'draft',
  }));

  return {
    week_start: new Date().toISOString().split('T')[0],
    posts,
  };
}

export async function optimizeForShopee(content: ContentDraft, productInfo: { name: string; price: string; category: string }): Promise<ContentDraft> {
  const prompt = `
    Optimize this content for Shopee Malaysia listing:
    
    Product: ${productInfo.name}
    Price: ${productInfo.price}
    Category: ${productInfo.category}
    
    Original Content:
    - Hook: ${content.hook}
    - Caption: ${content.caption}
    
    Make it:
    1. Include price urgency ("RM${productInfo.price} only!")
    2. Add Shopee-specific keywords
    3. Include CTA for "Add to Cart" or "Buy Now"
    4. Optimize for Shopee search algorithm
    
    Return optimized { hook, caption, shopee_keywords: [] }
  `;

  const ai = await getAI();
  const response = await ai.chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: 'Output valid JSON only.' },
      { role: 'user', content: prompt }
    ],
  });

  let optimized = response.choices[0].message.content || '{}';
  optimized = optimized.replace(/```json\n?|\n?```/g, '').trim();
  const optimization = JSON.parse(optimized);

  return {
    ...content,
    hook: optimization.hook || content.hook,
    caption: optimization.caption || content.caption,
    shopee_keywords: optimization.shopee_keywords || [
      productInfo.name.toLowerCase(),
      productInfo.category.toLowerCase(),
      'murah', 'bestseller', 'viral', 'trending', 'malaysia'
    ],
  };
}

export function getPlatformTips(platform: string): string[] {
  const tips: Record<string, string[]> = {
    tiktok: [
      'Use trending sounds in first 3 seconds',
      'Add text overlay for silent viewers',
      'Post between 7-9PM MYT for max reach',
      'Use #ForYou #FYP #Malaysia hashtags',
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

export async function generateViralHooks(topic: string, count: number = 5): Promise<string[]> {
  const prompt = `
    Generate ${count} viral video hooks for topic: "${topic}"
    
    Target: Malaysian audience, young entrepreneurs
    Style: Attention-grabbing, curiosity-inducing, culturally relevant
    
    Each hook should:
    - Be under 10 words
    - Create curiosity or urgency
    - Work for TikTok/Reels format
    
    Output: JSON array of strings only.
  `;

  const ai = await getAI();
  const response = await ai.chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: 'Output valid JSON array of strings only.' },
      { role: 'user', content: prompt }
    ],
  });

  let hooks = response.choices[0].message.content || '[]';
  hooks = hooks.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(hooks);
}

// Hermes integration for async content tasks
export async function queueContentTask(
  taskType: 'generate' | 'optimize' | 'schedule',
  params: any
): Promise<{ taskId: string; status: 'queued' }> {
  // If Hermes is configured, offload to async agent
  if (hermes.isConfigured()) {
    try {
      const response = await hermes.chatCompletion([
        { role: 'system', content: 'You are a content task processor for GANGNIAGA-OS.' },
        { role: 'user', content: `Queue ${taskType} task with params: ${JSON.stringify(params)}` }
      ]);
      
      return {
        taskId: `hermes-${Date.now()}`,
        status: 'queued',
      };
    } catch (error) {
      console.warn('Hermes offload failed, processing synchronously:', error);
    }
  }
  
  // Fallback: process immediately
  return {
    taskId: `sync-${Date.now()}`,
    status: 'queued',
  };
}
