const { Client } = require("@notionhq/client");
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../../.cache/builders.json');

module.exports = async function() {
  // Check if we have Notion credentials
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_BUILDERS_DB_ID) {
    console.warn('Notion credentials not found, using cached or empty builders data');

    // Try to use cached data
    if (fs.existsSync(CACHE_FILE)) {
      console.log('Using cached builders data');
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }

    // Return empty array if no cache exists
    console.log('No cached data available, returning empty builders array');
    return [];
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BUILDERS_DB_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" }
      },
      sorts: [
        {
          property: "Order",
          direction: "ascending"
        }
      ]
    });

    const data = response.results.map(page => ({
      id: page.id,
      name: page.properties.Name?.title[0]?.plain_text || "Untitled",
      description: page.properties.Description?.rich_text[0]?.plain_text || "",
      imageUrl: page.properties.Image?.files[0]?.file?.url || page.properties.Image?.files[0]?.external?.url || "",
      link: page.properties.Link?.url || "",
      tags: page.properties.Tags?.multi_select?.map(tag => tag.name) || [],
      order: page.properties.Order?.number || 999
    }));

    // Cache the data for future builds if Notion API fails
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));

    console.log(`Fetched ${data.length} builders from Notion`);
    return data;
  } catch (error) {
    console.warn('Notion API failed, using cached data:', error.message);

    // Fall back to cached data if API fails
    if (fs.existsSync(CACHE_FILE)) {
      console.log('Using cached builders data');
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }

    console.error('No cached data available, returning empty builders array');
    return [];
  }
};
