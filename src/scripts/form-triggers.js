/**
 * Form Sidebar Triggers
 *
 * This script sets up click handlers for buttons that open forms in the sidebar/modal.
 * Add data-form attribute to any button to trigger the sidebar with that form.
 *
 * Example: <button data-form="builder-promo">Nominate a Builder</button>
 */

(function() {
  // Form URL mappings
  const formUrls = {
    'builder-promo': '/forms/builder-promo.html',
    'builder-application': '/forms/builder-application.html',
    'newsletter': '/forms/newsletter.html',
    'gathering-invitation': '/forms/gathering-invitation.html',
    'application-rebuild1': '/forms/application-rebuild1.html'
  };

  // Function to load and open form
  async function loadForm(formType) {
    const url = formUrls[formType];
    if (!url) {
      console.error(`Unknown form type: ${formType}`);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load form: ${response.status}`);
      }

      const html = await response.text();
      window.openFormSidebar(html);
    } catch (error) {
      console.error('Error loading form:', error);
      // Fallback: show error message in sidebar
      window.openFormSidebar(`
        <div class="p-lg">
          <h2 class="text-2xl mb-md">Error Loading Form</h2>
          <p class="text-dark">Sorry, we couldn't load the form. Please try again or refresh the page.</p>
        </div>
      `);
    }
  }

  // Set up click handlers for all elements with data-form attribute
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-form]');
    if (trigger) {
      e.preventDefault();
      const formType = trigger.getAttribute('data-form');
      loadForm(formType);
    }
  });

  // Expose loadForm globally for manual triggering
  window.loadForm = loadForm;
})();
