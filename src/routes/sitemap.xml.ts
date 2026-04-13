import { getAllInsights } from "~/lib/collections";

const staticRoutes = [
  "/",
  "/directory",
  "/insights",
  "/journey",
  "/tools",
  "/people",
  "/about",
  "/get-in-touch",
  "/privacy",
  "/changelog",
  "/open-positions",
  "/apply",
];

export async function GET() {
  "use server";

  const siteUrl = import.meta.env.VITE_SITE_URL || "https://www.rebuild.net";
  const insights = getAllInsights();

  const staticUrls = staticRoutes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("\n");

  const insightUrls = insights
    .map(
      (insight) => `  <url>
    <loc>${siteUrl}/insights/${insight.slug}</loc>
    <lastmod>${new Date(insight.frontmatter.date).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${insightUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
