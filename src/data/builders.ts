import { cache } from "@solidjs/router";

export interface Builder {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
  category: string[];
  stage: string;
  country: string[];
  yearFounded: number | null;
  published: boolean;
  order: number;
}

async function loadBuilders(): Promise<Builder[]> {
  "use server";

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_BUILDERS_DB_ID;

  if (!token || !dbId) {
    console.warn("Notion credentials not found, using cached platforms data if available.");
    return loadFromCache();
  }

  try {
    // Dynamic import to keep Notion SDK server-side only
    const { Client } = await import("@notionhq/client");
    const { createRequire } = await import("module");
    const { readFileSync, existsSync, mkdirSync, writeFileSync } = await import("fs");
    const { join } = await import("path");
    const { fileURLToPath } = await import("url");

    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const CACHE_FILE = join(__dirname, "../../.cache/builders.json");

    const notion = new Client({ auth: token });

    const database = await notion.databases.retrieve({ database_id: dbId });
    const dataSourceId = (database as any).data_sources?.[0]?.id;

    if (!dataSourceId) {
      throw new Error("No data source found in database");
    }

    let allResults: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const queryOptions: any = {
        data_source_id: dataSourceId,
        filter: { property: "PUBLISHED?", checkbox: { equals: true } },
        page_size: 100,
      };
      if (startCursor) queryOptions.start_cursor = startCursor;

      const response = await (notion as any).dataSources.query(queryOptions);
      allResults = allResults.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    console.log(`  Retrieved ${allResults.length} platforms.`);

    const data: Builder[] = allResults.map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title[0]?.plain_text || "Untitled",
      description: page.properties.DESCRIPTION?.rich_text[0]?.plain_text || "",
      imageUrl:
        page.properties.Image?.files[0]?.file?.url ||
        page.properties.Image?.files[0]?.external?.url ||
        "",
      link: page.properties.WEBSITE?.url || "",
      tags: page.properties.TAGS?.multi_select?.map((t: any) => t.name) || [],
      category: page.properties.CATEGORY?.multi_select?.map((t: any) => t.name) || [],
      stage: page.properties.STAGE?.select?.name || "",
      country: page.properties.COUNTRY?.multi_select?.map((t: any) => t.name) || [],
      yearFounded: page.properties["YEAR FOUNDED"]?.number || null,
      published: page.properties["PUBLISHED?"]?.checkbox || false,
      order: page.properties.Order?.number || 999,
    }));

    const shuffled = data.sort(() => Math.random() - 0.5);

    // Cache for fallback
    try {
      mkdirSync(join(__dirname, "../../.cache"), { recursive: true });
      writeFileSync(CACHE_FILE, JSON.stringify(shuffled, null, 2));
    } catch (e) {
      console.warn("Could not write cache file:", e);
    }

    console.log(`✓ Fetched ${data.length} platforms from the directory.`);
    return shuffled;
  } catch (error: any) {
    console.error("✗ Notion API failed:", error.message);
    return loadFromCache();
  }
}

async function loadFromCache(): Promise<Builder[]> {
  "use server";
  try {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const CACHE_FILE = join(__dirname, "../../.cache/builders.json");

    if (existsSync(CACHE_FILE)) {
      console.log("Using cached builders data");
      return JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Could not read cache:", e);
  }
  console.log("No cached data available, returning empty array.");
  return [];
}

export const getBuilders = cache(loadBuilders, "builders");
