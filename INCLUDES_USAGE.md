# Dynamic Includes Usage Guide

This guide explains how to use the rebuild.net header and footer includes in external projects like rebuild-letter.

## Overview

The rebuild.net site now exposes two HTML endpoints that can be fetched dynamically:

- `https://rebuild.net/includes/header.html` - Site header with navigation
- `https://rebuild.net/includes/footer.html` - Site footer with newsletter form and links

These endpoints are configured with CORS headers to allow cross-origin requests from `https://letter.rebuild.net`.

## Implementation

### 1. Add Placeholders to Your HTML

Add placeholder divs where you want the header and footer to appear:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Your head content -->
  </head>
  <body>
    <!-- Header placeholder - place at the top of your body -->
    <div id="rebuild-header-placeholder"></div>

    <!-- Your site content -->
    <main>
      <!-- ... -->
    </main>

    <!-- Footer placeholder - place at the bottom of your body -->
    <div id="rebuild-footer-placeholder"></div>

    <!-- Load the includes script before your other scripts -->
    <script src="/js/includes.js"></script>
    <script src="/js/app.js"></script>
  </body>
</html>
```

### 2. Update Your `includes.js` File

Replace the hardcoded HTML in your `includes.js` with dynamic fetching:

```javascript
// includes.js - Dynamic rebuild.net header and footer loader

(async function () {
  const REBUILD_BASE_URL = "https://rebuild.net";

  // Fetch header
  try {
    const headerResponse = await fetch(`${REBUILD_BASE_URL}/includes/header.html`);
    if (headerResponse.ok) {
      const headerHTML = await headerResponse.text();
      const headerPlaceholder = document.getElementById("rebuild-header-placeholder");
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        console.log("✓ Rebuild header loaded");
      }
    }
  } catch (error) {
    console.error("Failed to load rebuild.net header:", error);
  }

  // Fetch footer
  try {
    const footerResponse = await fetch(`${REBUILD_BASE_URL}/includes/footer.html`);
    if (footerResponse.ok) {
      const footerHTML = await footerResponse.text();
      const footerPlaceholder = document.getElementById("rebuild-footer-placeholder");
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
        console.log("✓ Rebuild footer loaded");
      }
    }
  } catch (error) {
    console.error("Failed to load rebuild.net footer:", error);
  }
})();
```

### 3. Ensure Styling is Available

The header and footer use TailwindCSS utility classes from rebuild.net. You have two options:

#### Option A: Include rebuild.net's CSS (Recommended)

Add to your `<head>`:

```html
<link rel="stylesheet" href="https://rebuild.net/styles/main.css" />
```

#### Option B: Configure Your Own Tailwind

If you're using your own Tailwind setup, ensure your configuration includes the rebuild.net design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        dark: "#1a1a1a",
        muted: "#6b7280",
        blue: "#3b82f6",
        green: "#10b981",
        red: "#ef4444",
        // ... other colors from rebuild.net
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
    },
  },
};
```

## Features Included

### Header

- Rebuild logo linking to rebuild.net
- "Live and in beta" badge
- Desktop navigation menu with all main pages
- Mobile menu toggle button
- Full-screen mobile menu overlay with:
  - Main navigation
  - Secondary navigation (Open positions, Privacy, Changelog)
  - Close button

### Footer

- Rebuild logo and tagline
- Newsletter signup form with MailerLite integration
- LinkedIn follow link
- Full site navigation (main and secondary)
- Auto-updating copyright year

## CORS Configuration

The `/includes/*` endpoints are configured with the following headers:

```json
{
  "Access-Control-Allow-Origin": "https://letter.rebuild.net",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=300, s-maxage=600"
}
```

**Cache Duration**: 5 minutes (browser) / 10 minutes (CDN)

## Local Development

During local development:

1. Build the rebuild-web project: `npm run build`
2. Start the dev server: `npm run dev`
3. The includes will be available at:
   - `http://localhost:8080/includes/header.html`
   - `http://localhost:8080/includes/footer.html`

For local testing in rebuild-letter, update `includes.js` to use localhost URLs temporarily:

```javascript
const REBUILD_BASE_URL = "http://localhost:8080"; // Change back to production URL before deploying
```

## Deployment Checklist

When deploying changes to rebuild.net:

- [ ] Test the build: `npm run build`
- [ ] Verify includes are generated in `dist/includes/`
- [ ] Check that `vercel.json` is committed
- [ ] Deploy to staging and test CORS from letter.rebuild.net staging
- [ ] Verify header and footer load correctly
- [ ] Check mobile menu functionality
- [ ] Test newsletter form submission
- [ ] Deploy to production

## Updating the Includes

When you make changes to the header or footer:

1. Edit the source files:
   - [src/includes/header.html](src/includes/header.html)
   - [src/includes/footer.html](src/includes/footer.html)

2. Build and deploy rebuild.net

3. The changes will automatically appear in rebuild-letter within 5-10 minutes (cache expiry)

4. To force immediate update in development, clear your browser cache or append a cache-busting query: `?v=123`

## Troubleshooting

### Includes don't load

- Check browser console for CORS errors
- Verify `vercel.json` is deployed
- Confirm the rebuild.net URLs are correct
- Check that placeholders exist in HTML with correct IDs

### Styling looks broken

- Ensure rebuild.net CSS is loaded
- Check that Tailwind classes are processed
- Verify no CSS conflicts with your site styles

### Mobile menu doesn't work

- The menu requires JavaScript from the header include
- Ensure the header HTML loads completely
- Check for JavaScript errors in console
- Verify no duplicate IDs if you have multiple menus

### Newsletter form doesn't submit

- The form POSTs to rebuild.net's API endpoint
- Check network tab for failed requests
- Verify the API endpoint is accessible
- Ensure form IDs are unique on the page

## Support

For questions or issues:

- Check the [rebuild-web repository](https://github.com/yourorg/rebuild-web)
- Review the [CLAUDE.md](CLAUDE.md) project documentation
- Contact the Rebuild development team
