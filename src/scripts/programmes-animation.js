/**
 * Programmes Animation
 * Staggered fade-in animation when programmes enter viewport
 */

document.addEventListener('DOMContentLoaded', () => {
  const programmeItems = document.querySelectorAll('.programme-item');

  if (!programmeItems.length) return;

  // Intersection Observer options
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
  };

  // Callback function for intersection
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the index from the data attribute
        const index = parseInt(entry.target.dataset.index);

        // Add animation class with staggered delay
        setTimeout(() => {
          entry.target.classList.add('programme-item-visible');
        }, index * 100); // 100ms delay between each item

        // Stop observing this element once animated
        observer.unobserve(entry.target);
      }
    });
  };

  // Create observer
  const observer = new IntersectionObserver(callback, options);

  // Observe each programme item
  programmeItems.forEach(item => {
    observer.observe(item);
  });
});
