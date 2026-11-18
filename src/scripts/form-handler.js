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

// showWhen: reveal a field only while another field has a given value. Hidden inputs are
// disabled so they are neither validated nor submitted.
// requiredWith: make a field required once another field has a value (e.g. a name + position pair).
function initializeConditionalFields(form) {
  const shown = form.querySelectorAll("[data-show-when-field]");
  const paired = form.querySelectorAll("[data-required-with]");
  if (!shown.length && !paired.length) return;

  const controlValue = (name) => {
    const control = form.elements.namedItem(name);
    return control ? (control.value || "").trim() : "";
  };

  const update = () => {
    shown.forEach((wrapper) => {
      const visible = controlValue(wrapper.dataset.showWhenField) === wrapper.dataset.showWhenValue;
      wrapper.classList.toggle("hidden", !visible);
      wrapper.querySelectorAll("input, select, textarea").forEach((el) => (el.disabled = !visible));
    });
    paired.forEach((wrapper) => {
      const required = controlValue(wrapper.dataset.requiredWith) !== "";
      wrapper.querySelectorAll("input, select, textarea").forEach((el) => (el.required = required));
    });
  };

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  // form.reset() doesn't fire input/change; re-sync once the reset has applied
  form.addEventListener("reset", () => setTimeout(update, 0));
  update();
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
  initializeConditionalFields(form);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submitting via JavaScript");

    // Normalize URL fields - add https:// if missing protocol
    const urlInputs = form.querySelectorAll('input[data-url-field]');
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

    if (!submitBtn) return;

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
