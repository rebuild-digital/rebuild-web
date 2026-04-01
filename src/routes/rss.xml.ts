import { getAllInsights } from "~/lib/collections";

export async function GET() {
  "use server";

  const siteUrl = import.meta.env.VITE_SITE_URL || "https://www.rebuild.net";
  const insights = getAllInsights();

  const items = insights
    .map((insight) => {
      const url = `${siteUrl}/insights/${insight.slug}`;
      const pubDate = new Date(insight.frontmatter.date).toUTCString();
      const title = insight.frontmatter.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const excerpt = (insight.frontmatter.excerpt || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${excerpt}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rebuild Insights</title>
    <link>${siteUrl}/insights</link>
    <description>Insights from Rebuild — twelve months to rebuild European social platforms.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
