/**
 * Alternative Splash Image Rotation
 *
 * Handles automatic rotation of background images in the splash-alt component
 * with smooth fade transitions.
 *
 * Features:
 * - Configurable interval via data-interval attribute (default: 5000ms)
 * - Smooth fade-in/out transitions between images
 * - Pauses on user interaction (hover/focus)
 * - Accessible (respects prefers-reduced-motion)
 * - Automatic cleanup on component removal
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Get the splash component
  const splashElement = document.getElementById("hero-splash-alt");

  // Exit if component doesn't exist or user prefers reduced motion
  if (!splashElement || prefersReducedMotion) {
    return;
  }

  // Get all image elements
  const allImages = splashElement.querySelectorAll(".splash-image");

  // Function to get active images based on screen size
  function getActiveImages() {
    const isMobile = window.innerWidth < 768; // md breakpoint
    if (isMobile) {
      return Array.from(allImages).filter(
        (img) => img.getAttribute("data-show-mobile") === "true"
      );
    }
    return Array.from(allImages);
  }

  let images = getActiveImages();

  // Exit if there are fewer than 2 images
  if (images.length < 2) {
    return;
  }

  // Get interval from data attribute, default to 5000ms
  const interval = parseInt(
    splashElement.getAttribute("data-interval") || "5000",
    10
  );

  let currentIndex = 0;
  let rotationTimer = null;
  let isPaused = false;
  let lastRotationTime = Date.now();

  /**
   * Show the image at the specified index
   * @param {number} index - Index of the image to show
   */
  function showImage(index) {
    // Remove active class from all images
    allImages.forEach((img) => img.classList.remove("active"));

    // Add active class to current image
    images[index].classList.add("active");

    currentIndex = index;
    lastRotationTime = Date.now();
  }

  /**
   * Advance to the next image
   */
  function nextImage() {
    const nextIndex = (currentIndex + 1) % images.length;
    showImage(nextIndex);
  }

  /**
   * Update active images on resize
   */
  function handleResize() {
    const newImages = getActiveImages();

    // Only update if the set of active images changed
    if (newImages.length !== images.length) {
      stopRotation();
      images = newImages;

      // Reset to first image in the new set
      if (images.length >= 2) {
        currentIndex = 0;
        showImage(0);
        if (!isPaused) {
          startRotation();
        }
      }
    }
  }

  /**
   * Start the rotation timer
   */
  function startRotation() {
    if (isPaused) return;

    // Calculate remaining time if resuming
    const elapsed = Date.now() - lastRotationTime;
    const remaining = Math.max(0, interval - elapsed);

    // If enough time has passed, show next image immediately
    if (remaining === 0) {
      nextImage();
    }

    // Set up the interval timer
    rotationTimer = setInterval(() => {
      nextImage();
    }, interval);
  }

  /**
   * Stop the rotation timer
   */
  function stopRotation() {
    if (rotationTimer) {
      clearInterval(rotationTimer);
      rotationTimer = null;
    }
  }

  /**
   * Pause rotation (on hover/focus)
   */
  function pauseRotation() {
    isPaused = true;
    stopRotation();
  }

  /**
   * Resume rotation (on hover/focus end)
   */
  function resumeRotation() {
    isPaused = false;
    startRotation();
  }

  // Pause on hover
  splashElement.addEventListener("mouseenter", pauseRotation);
  splashElement.addEventListener("mouseleave", resumeRotation);

  // Pause on focus within (for keyboard navigation)
  splashElement.addEventListener("focusin", pauseRotation);
  splashElement.addEventListener("focusout", resumeRotation);

  // Handle visibility change (pause when tab is hidden)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRotation();
    } else if (!isPaused && !rotationTimer) {
      // Only start if not already running
      startRotation();
    }
  });

  // Handle window resize to update active images
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // Start the rotation
  startRotation();

  // Cleanup function for when the page unloads
  window.addEventListener("beforeunload", stopRotation);
});
