/**
 * Category Color System
 * Maps social platform categories to consistent color combinations
 * Uses existing color palette from main.css
 */

const categoryColors = {
  // Social & Community
  Bundled: { bg: "bg-red-tint", text: "text-dark" },
  Community: { bg: "bg-blue-tint", text: "text-dark" },
  Groups: { bg: "bg-green-tint", text: "text-dark" },
  Networking: { bg: "bg-orange-tint", text: "text-dark" },

  // Communication
  Messaging: { bg: "bg-blue-tint", text: "text-dark" },
  Microblogging: { bg: "bg-red-tint", text: "text-dark" },
  Forum: { bg: "bg-red-tint", text: "text-dark" },

  // Specialized
  Dating: { bg: "bg-blush-tint", text: "text-dark" },
  Events: { bg: "bg-orange-tint", text: "text-dark" },
  Location: { bg: "bg-green-tint", text: "text-dark" },

  // Content Sharing
  "Resource sharing": { bg: "bg-blonde-tint", text: "text-dark" },
  "Photo sharing": { bg: "bg-blush-tint", text: "text-dark" },
  "Video sharing": { bg: "bg-blonde-tint", text: "text-dark" },
  "Creator Platform": { bg: "bg-blue-tint", text: "text-dark" },
  "Social marketplace": { bg: "bg-orange-tint", text: "text-dark" },

  // Fallback
  Other: { bg: "bg-blonde-tint", text: "text-dark" },
};

/**
 * Get color classes for a category
 * @param {string} category - The category name
 * @returns {object} Object with bg and text color classes
 */
function getCategoryColors(category) {
  return categoryColors[category] || categoryColors["Other"];
}

/**
 * Get color classes for multiple categories (uses first category)
 * @param {string[]} categories - Array of category names
 * @returns {object} Object with bg and text color classes
 */
function getMultipleCategoryColors(categories) {
  if (!categories || categories.length === 0) {
    return categoryColors["Other"];
  }
  return getCategoryColors(categories[0]);
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    categoryColors,
    getCategoryColors,
    getMultipleCategoryColors,
  };
}
