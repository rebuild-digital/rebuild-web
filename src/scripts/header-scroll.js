// Header scroll handler for transparent to solid transition
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  const heroSplash = document.getElementById('hero-splash') || document.getElementById('hero-splash-alt');

  if (!header || !heroSplash) return;

  function handleScroll() {
    const heroBottom = heroSplash.offsetTop + heroSplash.offsetHeight;
    const scrollPosition = window.scrollY + header.offsetHeight;

    if (scrollPosition >= heroBottom) {
      header.classList.remove('transparent');
    } else {
      header.classList.add('transparent');
    }
  }

  // Handle scroll events with throttling for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check - run on load and after a short delay to ensure layout is ready
  handleScroll();
  setTimeout(handleScroll, 100);
});
