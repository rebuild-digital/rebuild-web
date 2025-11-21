const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");

module.exports = async function(eleventyConfig) {

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight); // Code syntax highlighting
  eleventyConfig.addPlugin(rss); // RSS feed generation

  // PostCSS plugin (ES module)
  const postcss = await import("eleventy-plugin-postcss");
  eleventyConfig.addPlugin(postcss.default); // PostCSS processing for Tailwind

  // Collections
  eleventyConfig.addCollection("journal", collection => {
    return collection.getFilteredByGlob("src/journal/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("featuredJournal", collection => {
    return collection.getFilteredByGlob("src/journal/**/*.md")
      .filter(post => post.data.featured === true)
      .sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter("dateFormat", (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  });

  eleventyConfig.addFilter("excerpt", (content, length = 150) => {
    if (!content) return "";
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > length ? text.substring(0, length) + "..." : text;
  });

  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  // Image shortcode using Eleventy Image
  eleventyConfig.addShortcode("image", async function(src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [300, 600, 1200],
      formats: ["webp", "jpeg"],
      outputDir: "./dist/assets/images/",
      urlPath: "/assets/images/"
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async"
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Pass-through copy
  // Note: src/styles is processed by PostCSS plugin, not copied
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy({"src/public": "/"});

  // Ignore files
  eleventyConfig.ignores.add("src/public/assets/images/README.md");

  // Watch targets
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
