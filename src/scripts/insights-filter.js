/**
 * Insights page filtering and sorting functionality
 */

class InsightsFilter {
  constructor() {
    this.grid = document.querySelector("[data-insights-grid]");
    this.cards = Array.from(document.querySelectorAll("[data-insight-card]"));
    this.sortButtons = document.querySelectorAll("[data-sort]");
    this.activeSort = "recency"; // default sort

    this.init();
  }

  init() {
    if (!this.grid || this.cards.length === 0) return;

    // Setup sort button listeners
    this.sortButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleSort(e));
    });

    // Initial render
    this.render();
  }

  handleSort(e) {
    const sortType = e.currentTarget.dataset.sort;

    // Update active sort
    this.activeSort = sortType;

    // Update button states
    this.sortButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.sort === sortType);
    });

    this.render();
  }

  sortCards(cards) {
    const sorted = [...cards];

    if (this.activeSort === "alphabetical") {
      sorted.sort((a, b) => {
        const titleA = a.dataset.title.toLowerCase();
        const titleB = b.dataset.title.toLowerCase();
        return titleA.localeCompare(titleB);
      });
    } else {
      // Sort by recency (date)
      sorted.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return dateB - dateA; // newest first
      });
    }

    return sorted;
  }

  render() {
    const visibleCards = this.sortCards(this.cards);

    // Hide all cards first
    this.cards.forEach((card) => {
      card.style.display = "none";
    });

    // Show and reorder visible cards
    visibleCards.forEach((card, index) => {
      card.style.display = "block";
      card.style.order = index;
    });

    // Show empty state if no cards
    const emptyState = document.querySelector("[data-empty-state]");
    if (emptyState) {
      emptyState.style.display = visibleCards.length === 0 ? "block" : "none";
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new InsightsFilter();
  });
} else {
  new InsightsFilter();
}
