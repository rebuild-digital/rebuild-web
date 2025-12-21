# Sidebar Form System

## Overview

The sidebar form system provides a modern UX pattern where forms slide in from the right on desktop (pushing the page content left) and appear as full-screen modals on mobile.

## How It Works

### Desktop (≥768px)

- Form slides in from right as a 500-600px sidebar
- Main page content slides left to make room
- Click X or ESC to close

### Mobile (<768px)

- Form appears as full-screen modal
- Dark overlay behind form
- Click overlay, X, or ESC to close

## Usage

### Simple - Add data-form attribute

```html
<button data-form="builder-promo">Nominate a Builder</button>
<button data-form="builder-application">Apply Now</button>
<button data-form="newsletter">Subscribe</button>
```

Works on any clickable element:

```html
<a href="#" data-form="builder-promo">Nominate someone</a>
```

### Available Forms

- **builder-promo** - Nominate a builder for the directory
- **builder-application** - Apply to join the directory
- **newsletter** - Newsletter signup

### JavaScript API

You can also trigger forms programmatically:

```javascript
// Load and open a form
window.loadForm('builder-promo');

// Close the sidebar
window.closeFormSidebar();
```

## File Structure

```code
src/
├── _includes/
│   └── components/
│       ├── form-sidebar.njk                  # Main sidebar component
│       └── forms/
│           ├── builder-promo-form.njk        # Form components
│           ├── builder-application-form.njk
│           ├── newsletter-form.njk
│           └── gathering-invitation-form.njk
├── forms/
│   ├── builder-promo.html                    # Rendered HTML endpoints
│   ├── builder-application.html
│   ├── newsletter.html
│   └── gathering-invitation.html
└── scripts/
    └── form-triggers.js                      # Click handler setup
```

## Adding New Forms

1. **Create form component** in `src/_includes/components/forms/your-form.njk`:

```njk
{# Your actual form HTML #}
<form action="..." method="POST">
  <!-- form fields -->
</form>
```

2. **Create HTML endpoint** in `src/forms/your-form.html`:

```njk
---
permalink: /forms/your-form.html
layout: false
---
<div class="form-sidebar-content">
  <h2 class="text-3xl mb-md">Your Form Title</h2>
  <p class="text-dark mb-lg">Description</p>
  {% include "components/forms/your-form.njk" %}
</div>
```

3. **Register in form-triggers.js**:

```javascript
const formUrls = {
  'builder-promo': '/forms/builder-promo.html',
  'builder-application': '/forms/builder-application.html',
  'newsletter': '/forms/newsletter.html',
  'your-form': '/forms/your-form.html'  // Add this
};
```

4. **Use it**:

```html
<button data-form="your-form">Open Your Form</button>
```

## Styling

The sidebar uses these key classes:
- `fixed top-0 right-0` - Position
- `transform translate-x-full` - Hidden state (off-screen right)
- `transition-transform duration-300` - Slide animation
- `w-full md:w-[500px] lg:w-[600px]` - Responsive width

Customize widths in [form-sidebar.njk](src/_includes/components/form-sidebar.njk).

## Keyboard & Accessibility

- **ESC key** closes the sidebar
- **Focus trap** keeps keyboard navigation inside modal (mobile)
- **Close button** has aria-label
- All forms maintain proper focus states

## Demo

Visit `/form-demo/` to see all forms in action and test the responsive behavior.
