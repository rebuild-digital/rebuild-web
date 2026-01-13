/**
 * Directory page filtering functionality
 * Allows filtering builders by multiple categories
 */

class DirectoryFilter {
  constructor() {
    this.builderRows = Array.from(document.querySelectorAll(".builder-row"));
    this.filterContainer = document.getElementById("category-filters");
    this.activeFilters = new Set();

    // Category color mapping
    this.categoryColors = {
      Bundled: { bg: "bg-red-tint", text: "text-dark" },
      Community: { bg: "bg-blue-tint", text: "text-dark" },
      Groups: { bg: "bg-green-tint", text: "text-dark" },
      Networking: { bg: "bg-orange-tint", text: "text-dark" },
      Messaging: { bg: "bg-blue-tint", text: "text-dark" },
      Microblogging: { bg: "bg-red-tint", text: "text-dark" },
      Forum: { bg: "bg-red-tint", text: "text-dark" },
      Dating: { bg: "bg-blush-tint", text: "text-dark" },
      Events: { bg: "bg-orange-tint", text: "text-dark" },
      Location: { bg: "bg-green-tint", text: "text-dark" },
      "Resource sharing": { bg: "bg-blonde-tint", text: "text-dark" },
      "Photo sharing": { bg: "bg-blush-tint", text: "text-dark" },
      "Video sharing": { bg: "bg-blonde-tint", text: "text-dark" },
      "Creator platform": { bg: "bg-blue-tint", text: "text-dark" },
      "Social marketplace": { bg: "bg-orange-tint", text: "text-dark" },
      Other: { bg: "bg-blonde-tint", text: "text-dark" },
    };

    this.init();
  }

  /**
   * Get color classes for a category
   */
  getCategoryColors(category) {
    return this.categoryColors[category] || this.categoryColors["Other"];
  }

  init() {
    if (!this.filterContainer || this.builderRows.length === 0) return;

    // Collect all unique categories
    this.categories = this.collectCategories();

    // Render filter buttons
    this.renderFilters();

    // Initial render
    this.render();
  }

  /**
   * Collect all unique categories from builder data
   */
  collectCategories() {
    const categoriesSet = new Set();

    this.builderRows.forEach((row) => {
      const categories = row.dataset.categories;
      if (categories) {
        categories.split(",").forEach((cat) => {
          const trimmed = cat.trim();
          if (trimmed) categoriesSet.add(trimmed);
        });
      }
    });

    // Define custom order matching screenshot layout
    const customOrder = [
      "Bundled",
      "Social marketplace",
      "Creator platform",
      "Location",
      "Resource sharing",
      "Dating",
      "Networking",
      "Forum",
      "Messaging",
      "Groups",
      "Video sharing",
      "Photo sharing",
      "Microblogging",
      "Community",
      "Events",
      "Other",
    ];

    // Get all categories from the set
    const allCategories = Array.from(categoriesSet);

    // Sort according to custom order, put unmatched categories at the end
    return allCategories.sort((a, b) => {
      const indexA = customOrder.indexOf(a);
      const indexB = customOrder.indexOf(b);

      // If both are in custom order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only A is in custom order, A comes first
      if (indexA !== -1) return -1;

      // If only B is in custom order, B comes first
      if (indexB !== -1) return 1;

      // If neither is in custom order, sort alphabetically
      return a.localeCompare(b);
    });
  }

  /**
   * Render filter buttons
   */
  renderFilters() {
    this.filterContainer.innerHTML = "";

    this.categories.forEach((category) => {
      const button = this.createFilterButton(category);
      this.filterContainer.appendChild(button);
    });
  }

  /**
   * Create a filter button element
   */
  createFilterButton(category) {
    const button = document.createElement("button");
    const colors = this.getCategoryColors(category);

    // Base classes
    button.className = "filter-button";
    button.dataset.category = category;

    // Add text content
    const textSpan = document.createElement("span");
    textSpan.textContent = category;
    button.appendChild(textSpan);

    // Add X icon (hidden by default, shown when active)
    const xIcon = document.createElement("span");
    xIcon.className = "filter-x hidden";
    xIcon.innerHTML = "&times;";
    button.appendChild(xIcon);

    // Store color info for active states
    button.dataset.bgColor = colors.bg;
    button.dataset.textColor = colors.text;

    // Add event listener
    button.addEventListener("click", () =>
      this.handleFilterClick(category, button)
    );

    return button;
  }

  /**
   * Handle filter button click
   */
  handleFilterClick(category, button) {
    if (this.activeFilters.has(category)) {
      // Deactivate filter
      this.activeFilters.delete(category);
      this.updateButtonState(button, false);
    } else {
      // Activate filter
      this.activeFilters.add(category);
      this.updateButtonState(button, true);
    }

    this.render();
  }

  /**
   * Update button visual state
   */
  updateButtonState(button, isActive) {
    const xIcon = button.querySelector(".filter-x");

    if (isActive) {
      // Active state - solid color with X icon
      const bgColor = button.dataset.bgColor;
      const textColor = button.dataset.textColor;
      button.className = `filter-button ${bgColor} ${textColor}`;
      if (xIcon) xIcon.classList.remove("hidden");
    } else {
      // Inactive state - light background, no X
      button.className = "filter-button";
      if (xIcon) xIcon.classList.add("hidden");
    }
  }

  /**
   * Filter builders based on active filters
   */
  filterBuilders() {
    return this.builderRows.filter((row) => {
      // If no filters active, show all
      if (this.activeFilters.size === 0) return true;

      // Get builder categories
      const builderCategories = row.dataset.categories
        ? row.dataset.categories.split(",").map((c) => c.trim())
        : [];

      // Check if builder has ANY of the active filters
      return Array.from(this.activeFilters).some((filter) =>
        builderCategories.includes(filter)
      );
    });
  }

  /**
   * Render visible builders
   */
  render() {
    const visibleBuilders = this.filterBuilders();

    // Hide all builders first
    this.builderRows.forEach((row) => {
      row.style.display = "none";
      row.style.order = ""; // Reset order
    });

    // Get all column containers
    const desktopColumns = document.querySelectorAll(".builders-column");

    if (desktopColumns.length >= 2) {
      // Tablet/Desktop: Redistribute visible builders evenly across columns
      const numColumns = desktopColumns.length;

      visibleBuilders.forEach((row, index) => {
        row.style.display = "block";

        // Determine which column this should go in (round-robin)
        const columnIndex = index % numColumns;
        row.style.order = Math.floor(index / numColumns);

        // Move to appropriate column if not already there
        const targetColumn = desktopColumns[columnIndex];
        if (row.parentElement !== targetColumn) {
          targetColumn.appendChild(row);
        }
      });
    } else {
      // Mobile: Just show filtered builders
      visibleBuilders.forEach((row) => {
        row.style.display = "block";
      });
    }

    // Update filter button states
    const buttons = this.filterContainer.querySelectorAll(".filter-button");
    buttons.forEach((button) => {
      const isActive = this.activeFilters.has(button.dataset.category);
      this.updateButtonState(button, isActive);
    });
  }
}

/**
 * Info tooltip toggle functionality
 */
function initInfoTooltip() {
  const trigger = document.getElementById("info-tooltip-trigger");
  const tooltip = document.getElementById("info-tooltip");

  if (!trigger || !tooltip) return;

  // Toggle tooltip on click
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    tooltip.classList.toggle("hidden");
  });

  // Close tooltip when clicking outside
  document.addEventListener("click", (e) => {
    if (!tooltip.contains(e.target) && !trigger.contains(e.target)) {
      tooltip.classList.add("hidden");
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !tooltip.classList.contains("hidden")) {
      tooltip.classList.add("hidden");
      trigger.focus();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new DirectoryFilter();
    initInfoTooltip();
  });
} else {
  new DirectoryFilter();
  initInfoTooltip();
}
