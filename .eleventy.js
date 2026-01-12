const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");

module.exports = async function(eleventyConfig) {

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight); // Code syntax highlighting
  eleventyConfig.addPlugin(rss); // RSS feed generation

  // Note: CSS is processed separately by Tailwind CLI, not copied here

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

  eleventyConfig.addCollection("insights", collection => {
    return collection.getFilteredByGlob("src/insights/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("featuredInsights", collection => {
    return collection.getFilteredByGlob("src/insights/**/*.md")
      .filter(post => post.data.featured === true)
      .sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter("dateFormat", (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  });

  eleventyConfig.addFilter("shortDate", (date) => {
    const options = { month: 'short', day: 'numeric' };
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

  // Shuffle filter for random ordering
  eleventyConfig.addFilter("shuffle", (array) => {
    if (!Array.isArray(array)) return array;
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Category colors filter
  eleventyConfig.addFilter("categoryColors", (categories) => {
    const categoryColors = {
      // Social & Community
      'Bundled': { bg: 'bg-red-tint', text: 'text-dark' },
      'Community': { bg: 'bg-blue-tint', text: 'text-dark' },
      'Groups': { bg: 'bg-green-tint', text: 'text-dark' },
      'Networking': { bg: 'bg-orange-tint', text: 'text-dark' },

      // Communication
      'Messaging': { bg: 'bg-blue-tint', text: 'text-dark' },
      'Microblogging': { bg: 'bg-red-tint', text: 'text-dark' },
      'Forum': { bg: 'bg-red-tint', text: 'text-dark' },

      // Specialized
      'Dating': { bg: 'bg-blush-tint', text: 'text-dark' },
      'Events': { bg: 'bg-orange-tint', text: 'text-dark' },
      'Location': { bg: 'bg-green-tint', text: 'text-dark' },

      // Content Sharing
      'Resource sharing': { bg: 'bg-blonde-tint', text: 'text-dark' },
      'Photo sharing': { bg: 'bg-blush-tint', text: 'text-dark' },
      'Video sharing': { bg: 'bg-blonde-tint', text: 'text-dark' },
      'Creator Platform': { bg: 'bg-blue-tint', text: 'text-dark' },
      'Social marketplace': { bg: 'bg-orange-tint', text: 'text-dark' },

      // Fallback
      'Other': { bg: 'bg-blonde-tint', text: 'text-dark' }
    };

    if (!categories || categories.length === 0) {
      return categoryColors['Other'];
    }
    return categoryColors[categories[0]] || categoryColors['Other'];
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
