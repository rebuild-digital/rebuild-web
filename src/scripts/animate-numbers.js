document.addEventListener("DOMContentLoaded", function () {
  var elements = document.querySelectorAll("[data-animate-number]");
  if (!elements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.dataset.animated) return;
        el.dataset.animated = "true";
        animateValue(el);
        observer.unobserve(el);
      });
    },
    { threshold: 0.2 },
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
});

function animateValue(el) {
  var raw = el.dataset.animateNumber;
  var prefix = raw.match(/^[^\d]*/)[0] || "";
  var suffix = raw.match(/[^\d]*$/)[0] || "";
  var numStr = raw.replace(prefix, "").replace(suffix, "");
  var target = parseFloat(numStr);
  if (isNaN(target)) {
    el.textContent = raw;
    return;
  }

  var decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  var duration = 2400;
  var startTime = null;

  el.textContent = prefix + "0" + suffix;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = (eased * target).toFixed(decimals);
    el.textContent = prefix + current + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = raw;
    }
  }

  requestAnimationFrame(step);
}
