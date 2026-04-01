function initMasonry() {
  const grid = document.querySelector("[data-insights-grid]");
  if (!grid) return;

  const cards = Array.from(grid.children);
  const gap = 32; // Adjust to match your gap size (xl = 32px)

  function layout() {
    if (window.innerWidth < 768) {
      // Single column on mobile - reset positioning
      cards.forEach((card) => {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
      });
      grid.style.position = "";
      grid.style.height = "";
      return;
    }

    const columns = 2;
    const columnWidth = (grid.offsetWidth - gap * (columns - 1)) / columns;
    const columnHeights = Array(columns).fill(0);

    grid.style.position = "relative";

    cards.forEach((card) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const x = shortestColumn * (columnWidth + gap);
      const y = columnHeights[shortestColumn];

      card.style.position = "absolute";
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.width = `${columnWidth}px`;

      columnHeights[shortestColumn] += card.offsetHeight + gap;
    });

    grid.style.height = `${Math.max(...columnHeights)}px`;
  }

  // Run on load and resize
  layout();
  window.addEventListener("resize", layout);

  // Re-layout after images load
  grid.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", layout);
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMasonry);
} else {
  initMasonry();
}
