/**
 * Mobile Menu Toggle
 * Handles opening and closing the mobile navigation menu
 */

(function () {
  "use strict";

  // Get elements
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const menuClose = document.getElementById("mobile-menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const body = document.body;

  // Check if elements exist
  if (!menuToggle || !menuClose || !mobileMenu) {
    console.warn("Mobile menu elements not found");
    return;
  }

  /**
   * Open the mobile menu
   */
  function openMenu() {
    mobileMenu.classList.remove("hidden");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    body.style.overflow = "hidden"; // Prevent scrolling when menu is open
  }

  /**
   * Close the mobile menu
   */
  function closeMenu() {
    mobileMenu.classList.add("hidden");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    body.style.overflow = ""; // Restore scrolling
  }

  /**
   * Toggle the mobile menu
   */
  function toggleMenu() {
    const isHidden = mobileMenu.classList.contains("hidden");
    if (isHidden) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  // Event listeners
  menuToggle.addEventListener("click", toggleMenu);
  menuClose.addEventListener("click", closeMenu);

  // Close menu when clicking on a navigation link
  const mobileNavLinks = mobileMenu.querySelectorAll("a");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
      closeMenu();
      menuToggle.focus(); // Return focus to toggle button
    }
  });

  // Trap focus within menu when open
  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab" && !mobileMenu.classList.contains("hidden")) {
      const focusableElements = mobileMenu.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Close menu on window resize if desktop size
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= 768 && !mobileMenu.classList.contains("hidden")) {
        closeMenu();
      }
    }, 250);
  });
})();
