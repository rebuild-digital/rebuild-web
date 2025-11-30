/**
 * Builder Row Toggle Functionality
 * Handles expanding/collapsing builder rows on the catalog page
 */

document.addEventListener('DOMContentLoaded', function() {
  const builderRows = document.querySelectorAll('.builder-row');

  builderRows.forEach(row => {
    const header = row.querySelector('.builder-row-header');
    const content = row.querySelector('.builder-row-content');
    const toggle = row.querySelector('.builder-toggle');
    const iconPlus = row.querySelector('.builder-icon-plus');
    const iconClose = row.querySelector('.builder-icon-close');

    // Only add click handler if toggle button exists (expandable mode)
    if (!toggle) return;

    header.addEventListener('click', function() {
      const isExpanded = !content.classList.contains('hidden');

      if (isExpanded) {
        // Collapse
        content.classList.add('hidden');
        iconPlus.classList.remove('hidden');
        iconClose.classList.add('hidden');
        row.classList.remove('builder-row-expanded');
      } else {
        // Expand
        content.classList.remove('hidden');
        iconPlus.classList.add('hidden');
        iconClose.classList.remove('hidden');
        row.classList.add('builder-row-expanded');
      }
    });
  });
});
