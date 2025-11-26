/**
 * Insights page filtering and sorting functionality
 */

class InsightsFilter {
  constructor() {
    this.grid = document.querySelector('[data-insights-grid]');
    this.cards = Array.from(document.querySelectorAll('[data-insight-card]'));
    this.sortButtons = document.querySelectorAll('[data-sort]');
    this.tagButtons = document.querySelectorAll('[data-tag-filter]');
    this.activeTag = null;
    this.activeSort = 'recency'; // default sort

    // Define tag color palette (using your brand colors)
    this.tagColors = [
      { bg: 'bg-rb-yellow', border: 'border-dark', text: 'text-dark' },
      { bg: 'bg-rb-mint', border: 'border-dark', text: 'text-dark' },
      { bg: 'bg-rb-blue-tint', border: 'border-dark', text: 'text-dark' },
      { bg: 'bg-rb-red-tint', border: 'border-dark', text: 'text-dark' },
      { bg: 'bg-rb-magenta', border: 'border-dark', text: 'text-dark' },
      { bg: 'bg-off-white', border: 'border-rb-blue', text: 'text-rb-blue' },
    ];

    this.init();
  }

  init() {
    if (!this.grid || this.cards.length === 0) return;

    // Apply colors to all tags
    this.applyTagColors();

    // Setup sort button listeners
    this.sortButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleSort(e));
    });

    // Setup tag filter button listeners
    this.tagButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleTagFilter(e));
    });

    // Initial render
    this.render();
  }

  /**
   * Simple string hash function for consistent color assignment
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get consistent color for a tag based on its name
   */
  getTagColor(tagName) {
    const hash = this.hashString(tagName.toLowerCase());
    const colorIndex = hash % this.tagColors.length;
    return this.tagColors[colorIndex];
  }

  /**
   * Apply colors to all tag elements (only in cards, not filter buttons)
   */
  applyTagColors() {
    // Color tags in cards - select spans within the tags container
    this.cards.forEach(card => {
      const tagSpans = card.querySelectorAll('span');
      tagSpans.forEach(tagElement => {
        const tagName = tagElement.textContent.trim();
        const colors = this.getTagColor(tagName);

        // Apply color classes to existing styled tag
        tagElement.className = `inline-block px-sm py-xs border ${colors.bg} ${colors.border} ${colors.text} text-xs font-semibold`;
      });
    });
  }

  handleSort(e) {
    const sortType = e.currentTarget.dataset.sort;

    // Update active sort
    this.activeSort = sortType;

    // Update button states
    this.sortButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sort === sortType);
    });

    this.render();
  }

  handleTagFilter(e) {
    const tag = e.currentTarget.dataset.tagFilter;

    // Toggle tag filter (clicking same tag deactivates it)
    if (this.activeTag === tag) {
      this.activeTag = null;
      e.currentTarget.classList.remove('active');
    } else {
      this.activeTag = tag;

      // Update button states
      this.tagButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tagFilter === tag);
      });
    }

    this.render();
  }

  filterCards() {
    return this.cards.filter(card => {
      // Apply tag filter
      if (this.activeTag) {
        const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
        return cardTags.includes(this.activeTag);
      }

      return true;
    });
  }

  sortCards(cards) {
    const sorted = [...cards];

    if (this.activeSort === 'alphabetical') {
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
    // Filter cards
    let visibleCards = this.filterCards();

    // Sort cards - featured posts are now treated like regular posts
    visibleCards = this.sortCards(visibleCards);

    // Hide all cards first
    this.cards.forEach(card => {
      card.style.display = 'none';
    });

    // Show and reorder visible cards
    visibleCards.forEach((card, index) => {
      card.style.display = 'block';
      card.style.order = index;
    });

    // Show empty state if no cards
    const emptyState = document.querySelector('[data-empty-state]');
    if (emptyState) {
      emptyState.style.display = visibleCards.length === 0 ? 'block' : 'none';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new InsightsFilter();
  });
} else {
  new InsightsFilter();
}
