/**
 * Page Transition Handler
 * Fades body out before navigating to same-origin links.
 * Entry animation is handled in CSS (page-fade-in keyframe on body).
 */
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;

  // Let the browser handle modified clicks (new tab, etc.)
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

  // Only intercept same-origin, non-anchor, non-blank links
  if (link.hostname !== location.hostname) return;
  if (link.target === "_blank") return;
  if (link.hash && link.pathname === location.pathname) return;

  const href = link.href;
  if (href === location.href) return;

  e.preventDefault();
  document.body.classList.add("is-leaving");

  // Match the CSS transition duration (150ms)
  setTimeout(() => {
    location.href = href;
  }, 150);
});
