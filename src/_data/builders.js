require("dotenv").config();
const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "../../.cache/builders.json");

module.exports = async function () {
  // Check if we have Notion credentials
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_BUILDERS_DB_ID) {
    console.warn("Notion credentials not found, using cached platforms data if available.");

    // Try to use cached data
    if (fs.existsSync(CACHE_FILE)) {
      console.log("Using cached builders data");
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }

    // Return empty array if no cache exists
    console.log("No cached data available, returning empty platforms array.");
    return [];
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    // In Notion SDK v5.x, databases contain data sources
    // First, get the database to find its data source ID
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_BUILDERS_DB_ID,
    });

    // Get the first data source from the database
    const dataSourceId = database.data_sources?.[0]?.id;

    if (!dataSourceId) {
      throw new Error("No data source found in database");
    }

    // Fetch all builders with pagination support
    // Notion API returns max 100 results per request, so we need to paginate
    let allResults = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const queryOptions = {
        data_source_id: dataSourceId,
        // Filter to only show published builders
        filter: {
          property: "PUBLISHED?",
          checkbox: { equals: true },
        },
        page_size: 100,
      };

      // Add cursor for pagination if we have one
      if (startCursor) {
        queryOptions.start_cursor = startCursor;
      }

      const response = await notion.dataSources.query(queryOptions);
      allResults = allResults.concat(response.results);

      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    console.log(
      `  Retrieved ${allResults.length} platforms across ${Math.ceil(
        allResults.length / 100
      )} page(s).`
    );

    const data = allResults.map((page) => ({
      id: page.id,
      name: page.properties.Name?.title[0]?.plain_text || "Untitled",
      description: page.properties.DESCRIPTION?.rich_text[0]?.plain_text || "",
      imageUrl:
        page.properties.Image?.files[0]?.file?.url ||
        page.properties.Image?.files[0]?.external?.url ||
        "",
      link: page.properties.WEBSITE?.url || "",
      tags: page.properties.TAGS?.multi_select?.map((tag) => tag.name) || [],
      category: page.properties.CATEGORY?.multi_select?.map((tag) => tag.name) || [],
      stage: page.properties.STAGE?.select?.name || "",
      country: page.properties.COUNTRY?.multi_select?.map((tag) => tag.name) || [],
      yearFounded: page.properties["YEAR FOUNDED"]?.number || null,
      published: page.properties["PUBLISHED?"]?.checkbox || false,
      order: page.properties.Order?.number || 999,
    }));

    // Shuffle the data randomly for each build
    const shuffledData = data.sort(() => Math.random() - 0.5);

    // Cache the data for future builds if Notion API fails
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(shuffledData, null, 2));

    console.log(`✓ Fetched ${data.length} platforms from the directory.`);
    return shuffledData;
  } catch (error) {
    console.error("✗ Notion API failed:", error.message);

    // Provide helpful error messages
    if (error.message?.includes("Could not find database")) {
      console.error("  → Make sure the database is shared with your Notion integration");
      console.error("  → Go to your Notion database → ••• → Connections → Add your integration");
    } else if (error.message?.includes("unauthorized")) {
      console.error("  → Check that your NOTION_TOKEN is valid");
    }

    console.warn("  → Attempting to use cached data...");

    // Fall back to cached data if API fails
    if (fs.existsSync(CACHE_FILE)) {
      console.log("Using cached platforms data.");
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }

    console.error("No cached data available, returning empty platforms array.");
    return [];
  }
};
