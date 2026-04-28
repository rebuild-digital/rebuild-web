function initializeCharCounters(form) {
  form.querySelectorAll("textarea[data-char-limit]").forEach((textarea) => {
    const limit = parseInt(textarea.dataset.charLimit, 10);
    const counter = form.querySelector(`[data-char-counter="${textarea.id}"]`);
    if (!counter) return;

    const update = () => {
      const used = textarea.value.length;
      counter.textContent = `${used} / ${limit}`;
      counter.classList.toggle("text-red", used > limit);
      counter.classList.toggle("text-muted", used <= limit);
    };

    textarea.addEventListener("input", update);
    update();
  });
}

// Form submission handler
function initializeFormHandler(form) {
  const formId = form.id;

  // Skip if form already has our handler
  if (form.dataset.handlerInitialized === "true") {
    console.log("Form handler already initialized for:", formId);
    return;
  }

  console.log("Form handler initialized for:", formId);
  form.dataset.handlerInitialized = "true";
  initializeCharCounters(form);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submitting via JavaScript");

    // Normalize URL fields - add https:// if missing protocol
    const urlInputs = form.querySelectorAll('input[type="url"]');
    urlInputs.forEach((input) => {
      const value = input.value.trim();
      if (value && !value.match(/^https?:\/\//i)) {
        input.value = "https://" + value;
      }
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById(formId + "-success");
    const errorEl = document.getElementById(formId + "-error");

    // Hide previous messages
    if (successEl) successEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");

    // Disable submit button
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        if (successEl) {
          successEl.classList.remove("hidden");
          successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        form.reset();
      } else {
        if (errorEl) {
          // Show error message with details if available
          if (data.details) {
            const errorMsg = errorEl.querySelector("p");
            if (errorMsg) {
              errorMsg.textContent = data.details.join(", ");
            }
          }
          errorEl.classList.remove("hidden");
          errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (errorEl) {
        errorEl.classList.remove("hidden");
        errorEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Expose globally for dynamic forms
window.initializeFormHandler = initializeFormHandler;

// Initialize all forms on page load
document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form[data-ajax-form]");
  forms.forEach(initializeFormHandler);
});
