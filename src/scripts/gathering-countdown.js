(function() {
  function updateCountdowns() {
    const countdownElements = document.querySelectorAll('[data-countdown]');

    countdownElements.forEach(function(element) {
      const targetDateStr = element.getAttribute('data-countdown');
      const targetDate = new Date(targetDateStr).getTime();
      const textElement = element.querySelector('[data-countdown-text]');

      if (!textElement) return;

      function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
          textElement.textContent = 'Event has started!';
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        textElement.textContent = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes';
      }

      // Update immediately
      update();

      // Then update every minute
      setInterval(update, 60000);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCountdowns);
  } else {
    updateCountdowns();
  }
})();
