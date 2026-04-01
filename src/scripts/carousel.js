/**
 * Carousel Component JavaScript
 * Handles slide navigation and automatic rotation
 */

document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));

  if (slides.length === 0 || dots.length === 0) return;

  let currentSlide = 0;
  let autoplayInterval = null;
  const autoplayDelay = 7000; // 7 seconds

  /**
   * Update the carousel to show the specified slide
   * @param {number} index - The slide index to show
   */
  function goToSlide(index) {
    // Ensure index is within bounds
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Hide current slide
    slides[currentSlide].classList.remove("opacity-100!", "visible!", "pointer-events-auto!");
    slides[currentSlide].classList.add("opacity-0", "invisible", "pointer-events-none");

    // Update current slide
    currentSlide = index;

    // Show new slide
    slides[currentSlide].classList.remove("opacity-0", "invisible", "pointer-events-none");
    slides[currentSlide].classList.add("opacity-100!", "visible!", "pointer-events-auto!");

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.remove("bg-muted");
        dot.classList.add("bg-dark!", "w-8!");
      } else {
        dot.classList.remove("bg-dark!", "w-8!");
        dot.classList.add("bg-muted");
      }
    });

    // Update announcer
    updateAnnouncer();
  }

  /**
   * Go to the next slide
   */
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  /**
   * Go to the previous slide
   */
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  /**
   * Start automatic slide rotation
   */
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
  }

  /**
   * Stop automatic slide rotation
   */
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  /**
   * Restart autoplay (stop and start)
   */
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Navigation: Dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoplay();
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Only handle keyboard events when carousel is in viewport
    if (slides.length === 0) return;
    const rect = slides[0].parentElement.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isInViewport) return;

    if (e.key === "ArrowLeft") {
      prevSlide();
      restartAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      restartAutoplay();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;
  const carousel = slides[0]?.parentElement?.parentElement;

  if (carousel) {
    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (swipeDistance > 0) {
      // Swipe right - go to previous slide
      prevSlide();
      restartAutoplay();
    } else {
      // Swipe left - go to next slide
      nextSlide();
      restartAutoplay();
    }
  }

  // Pause autoplay when page is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Initialize: Start autoplay
  startAutoplay();

  // Accessibility: Announce slide changes to screen readers
  const announcer = document.createElement("div");
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  announcer.classList.add("sr-only");
  if (carousel) {
    carousel.appendChild(announcer);
  }

  // Update announcer on slide change
  function updateAnnouncer() {
    announcer.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
  }

  // Set initial state
  updateAnnouncer();
});
