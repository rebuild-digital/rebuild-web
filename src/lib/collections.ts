export interface InsightFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  featured_image?: string;
  featured?: boolean;
  published?: boolean;
}

export interface Insight {
  slug: string;
  frontmatter: InsightFrontmatter;
  // Component is the MDX default export - typed as any for flexibility
  content: any;
}

// Load all MDX insight files at build time using Vite's glob import
const insightModules = import.meta.glob<{
  default: any;
  frontmatter: InsightFrontmatter;
}>("../content/insights/*.mdx", { eager: true });

export function getAllInsights(): Insight[] {
  return Object.entries(insightModules)
    .map(([filePath, module]) => {
      const slug = filePath
        .replace("../content/insights/", "")
        .replace(".mdx", "");

      return {
        slug,
        frontmatter: module.frontmatter,
        content: module.default,
      };
    })
    .filter((insight) => insight.frontmatter?.published !== false)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getInsightBySlug(slug: string): Insight | undefined {
  return getAllInsights().find((i) => i.slug === slug);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getAllInsights().forEach((insight) => {
    insight.frontmatter.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
