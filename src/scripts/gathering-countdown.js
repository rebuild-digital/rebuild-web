(function () {
  function updateCountdowns() {
    const countdownElements = document.querySelectorAll("[data-countdown]");

    countdownElements.forEach(function (element) {
      const targetDateStr = element.getAttribute("data-countdown");
      const targetDate = new Date(targetDateStr).getTime();
      const textElement = element.querySelector("[data-countdown-text]");
      const daysEl = element.querySelector("[data-countdown-days]");
      const minutesEl = element.querySelector("[data-countdown-minutes]");
      const secondsEl = element.querySelector("[data-countdown-seconds]");
      const isStacked = daysEl && minutesEl && secondsEl;

      if (!isStacked && !textElement) return;

      function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
          if (isStacked) {
            daysEl.textContent = "0";
            minutesEl.textContent = "0";
            secondsEl.textContent = "0";
          } else if (textElement) {
            textElement.textContent = "Event has started!";
          }
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (isStacked) {
          daysEl.textContent = days;
          minutesEl.textContent = minutes;
          secondsEl.textContent = seconds;
        } else if (element.hasAttribute("data-countdown-days-only")) {
          textElement.textContent = days + " days";
        } else {
          const formattedHours = String(hours).padStart(2, "0");
          const formattedMinutes = String(minutes).padStart(2, "0");
          const formattedSeconds = String(seconds).padStart(2, "0");

          textElement.textContent =
            days + "d " + formattedHours + "h " + formattedMinutes + "m " + formattedSeconds + "s";
        }
      }

      // Update immediately
      update();

      // Then update every second
      setInterval(update, 1000);
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCountdowns);
  } else {
    updateCountdowns();
  }
})();
