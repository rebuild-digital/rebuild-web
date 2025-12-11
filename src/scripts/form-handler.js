// Form submission handler
function initializeFormHandler(form) {
  const formId = form.id;
  console.log('Form handler initialized for:', formId);

  // Remove any existing submit listeners to avoid duplicates
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  form = newForm;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('Form submitting via JavaScript');

    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById(formId + '-success');
    const errorEl = document.getElementById(formId + '-error');

    // Hide previous messages
    if (successEl) successEl.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');

    // Disable submit button
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        if (successEl) {
          successEl.classList.remove('hidden');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
      } else {
        if (errorEl) {
          // Show error message with details if available
          if (data.details) {
            const errorMsg = errorEl.querySelector('p');
            if (errorMsg) {
              errorMsg.textContent = data.details.join(', ');
            }
          }
          errorEl.classList.remove('hidden');
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (errorEl) {
        errorEl.classList.remove('hidden');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form[data-ajax-form]');
  forms.forEach(initializeFormHandler);
});
