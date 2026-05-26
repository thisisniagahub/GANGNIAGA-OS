import fs from 'node:fs/promises';
import path from 'node:path';

export interface LocalSkill {
  id: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  category: string;
  content: string;
  triggerPhrase: string | null;
  tags: string[];
  source: string;
  status: string;
  autoLearn: boolean;
}

/**
 * Simple parser to extract yaml front matter from markdown content.
 */
function parseFrontMatter(content: string): { data: Record<string, any>; body: string } {
  const data: Record<string, any> = {};
  let body = content;

  const lines = content.split('\n');
  if (lines[0]?.trim() === '---') {
    const endIdx = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
    if (endIdx > 0) {
      const frontMatterLines = lines.slice(1, endIdx);
      body = lines.slice(endIdx + 1).join('\n');

      for (const line of frontMatterLines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          const key = line.slice(0, colonIdx).trim();
          let val = line.slice(colonIdx + 1).trim();
          
          // Clean quotes
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          
          if (key === 'tags') {
            // Handle simple array parsing if tags: [a, b, c]
            if (val.startsWith('[') && val.endsWith(']')) {
              data[key] = val.slice(1, -1).split(',').map(t => t.trim().replace(/['"]/g, ''));
            } else {
              data[key] = [val];
            }
          } else {
            data[key] = val;
          }
        }
      }
    }
  }

  return { data, body };
}

/**
 * Dynamically load all skills from the local 'skills/' folder on disk.
 */
export async function getLocalSkills(): Promise<LocalSkill[]> {
  const skillsDir = path.join(process.cwd(), 'skills');
  const localSkills: LocalSkill[] = [];

  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
        try {
          const fileContent = await fs.readFile(skillPath, 'utf8');
          const { data, body } = parseFrontMatter(fileContent);

          const name = data.name || entry.name;
          const slug = entry.name;
          const description = data.description || '';
          const version = data.version || '1.0.0';
          const category = data.category || 'general';
          const triggerPhrase = data.triggerPhrase || (name.startsWith('/') ? name : `/${name}`);
          const tags = data.tags || [];

          localSkills.push({
            id: `local-${slug}`,
            name,
            slug,
            description,
            version,
            category,
            content: body.trim(),
            triggerPhrase,
            tags,
            source: 'bundled',
            status: 'active',
            autoLearn: false,
          });
        } catch {
          // If SKILL.md doesn't exist or can't be read, skip this folder
          continue;
        }
      }
    }
  } catch (error) {
    console.error('[getLocalSkills] Error reading skills directory:', error);
  }

  return localSkills;
}

/**
 * Fetch a single local skill in full detail (Level 1 parsing).
 */
export async function getLocalSkillBySlug(slug: string): Promise<LocalSkill | null> {
  const skills = await getLocalSkills();
  return skills.find(s => s.slug === slug) || null;
}
