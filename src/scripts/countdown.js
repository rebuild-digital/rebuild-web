// Countdown timer functionality
(function () {
  "use strict";

  function initCountdown(element) {
    const targetDate = new Date(element.dataset.targetDate).getTime();

    const daysEl = element.querySelector("[data-days]");
    const hoursEl = element.querySelector("[data-hours]");
    const minutesEl = element.querySelector("[data-minutes]");
    const secondsEl = element.querySelector("[data-seconds]");

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "0";
        minutesEl.textContent = "0";
        secondsEl.textContent = "0";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = days;
      hoursEl.textContent = hours.toString().padStart(2, "0");
      minutesEl.textContent = minutes.toString().padStart(2, "0");
      secondsEl.textContent = seconds.toString().padStart(2, "0");
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Initialize all countdown elements on the page
  document.addEventListener("DOMContentLoaded", function () {
    const countdownElements = document.querySelectorAll(".countdown");
    countdownElements.forEach(initCountdown);
  });
})();
