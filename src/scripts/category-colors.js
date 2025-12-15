/**
 * Category Color System
 * Maps social platform categories to consistent color combinations
 * Uses existing color palette from main.css
 */

const categoryColors = {
  // Social & Community
  'Community': { bg: 'bg-blue', text: 'text-dark' },
  'Community of interest': { bg: 'bg-blue-tint', text: 'text-dark' },
  'Groups': { bg: 'bg-blue-shade', text: 'text-light' },
  'Networking': { bg: 'bg-blush', text: 'text-dark' },

  // Content Sharing
  'Media sharing': { bg: 'bg-green', text: 'text-dark' },
  'Photo sharing': { bg: 'bg-green-tint', text: 'text-dark' },
  'Video sharing': { bg: 'bg-green-shade', text: 'text-light' },
  'Creator Platform': { bg: 'bg-blonde', text: 'text-dark' },

  // Communication
  'Messaging': { bg: 'bg-orange', text: 'text-light' },
  'Microblogging': { bg: 'bg-orange-tint', text: 'text-dark' },
  'Forum': { bg: 'bg-orange-shade', text: 'text-light' },

  // Specialized
  'Dating': { bg: 'bg-red', text: 'text-light' },
  'Events': { bg: 'bg-red-tint', text: 'text-dark' },
  'Location': { bg: 'bg-blush-tint', text: 'text-dark' },
  'Marketplace': { bg: 'bg-blonde-shade', text: 'text-dark' },

  // Technical
  'Infrastructure': { bg: 'bg-muted', text: 'text-light' },
  'Bundled': { bg: 'bg-darker', text: 'text-light' },

  // Fallback
  'Other': { bg: 'bg-light', text: 'text-dark' }
};

/**
 * Get color classes for a category
 * @param {string} category - The category name
 * @returns {object} Object with bg and text color classes
 */
function getCategoryColors(category) {
  return categoryColors[category] || categoryColors['Other'];
}

/**
 * Get color classes for multiple categories (uses first category)
 * @param {string[]} categories - Array of category names
 * @returns {object} Object with bg and text color classes
 */
function getMultipleCategoryColors(categories) {
  if (!categories || categories.length === 0) {
    return categoryColors['Other'];
  }
  return getCategoryColors(categories[0]);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    categoryColors,
    getCategoryColors,
    getMultipleCategoryColors
  };
}
