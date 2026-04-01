# Environment Configuration Guide

## Overview

This project uses environment variables to configure URLs for different deployment environments (staging vs production). This allows forms and API calls to work correctly regardless of where the site is hosted.

## Environment Variables

All environment variables are defined in `.env` (local) and should be documented in `.env.example` (committed to repo).

### Key Variables

#### `SITE_URL`

The base URL where your site is deployed and accessed by users.

- **Staging**: `https://rebuild-staging.statichost.page`
- **Production**: `https://www.rebuild.net`

#### `API_URL`

The Bunny CDN endpoint where Edge Scripts handle form submissions and API requests.

- **Staging**: `https://rebuild-staging.b-cdn.net`
- **Production**: `https://rebuild.b-cdn.net`

## How It Works

1. **Environment variables** are loaded from `.env` file at build time
2. **`src/_data/site.js`** exposes these as `site.url` and `site.apiUrl` in templates
3. **Form templates** use `{{ site.apiUrl }}` to construct absolute API URLs
4. **Result**: Forms submit to the correct API endpoint in any environment

## Usage in Templates

### Example: Newsletter Form

```njk
<form action="{{ site.apiUrl }}/api/newsletter-signup" method="POST">
  <!-- form fields -->
</form>
```

This will render as:

- **Staging**: `action="https://rebuild-staging.b-cdn.net/api/newsletter-signup"`
- **Production**: `action="https://rebuild.b-cdn.net/api/newsletter-signup"`

### Forms Using This Pattern

All forms now use absolute URLs via `site.apiUrl`:

- ✅ Newsletter form (`newsletter-form.njk`)
- ✅ Builder application form (`builder-application-form.njk`)
- ✅ Builder promotion form (`builder-promo-form.njk`)

## Switching Between Environments

### For Local Development (Staging)

Your `.env` file should contain:

```bash
SITE_URL=https://rebuild-staging.statichost.page
API_URL=https://rebuild-staging.b-cdn.net
```

### For Production Deployment

Update your `.env` (or set environment variables in your deployment platform):

```bash
SITE_URL=https://www.rebuild.net
API_URL=https://rebuild.b-cdn.net
```

## Why This Matters

### The Problem

When using relative URLs like `action="/api/newsletter-signup"`:

- Form on `rebuild-staging.statichost.page` → submits to `rebuild-staging.statichost.page/api/newsletter-signup` ❌ (no API there)
- Form on `rebuild-staging.b-cdn.net` → submits to `rebuild-staging.b-cdn.net/api/newsletter-signup` ✅ (Edge Script handles it)

### The Solution

Using absolute URLs with environment variables:

- Form on ANY domain → submits to `rebuild-staging.b-cdn.net/api/newsletter-signup` ✅
- Environment variable makes it easy to switch between staging and production

## Bunny Edge Script Configuration

Your Bunny Edge Scripts should be configured with the static host as the origin:

```javascript
BunnySDK.net.http.servePullZone({
  origin: "https://rebuild-staging.statichost.page", // For staging
  // origin: "https://www.rebuild.net", // For production
});
```

This creates the flow:

1. User visits static host OR CDN
2. Form submits to CDN (absolute URL)
3. CDN Edge Script processes API requests
4. CDN proxies other requests to static host origin

## Testing

After changing environment variables:

1. Rebuild the site: `npm run build`
2. Check generated HTML: `grep "action=" dist/forms/newsletter.html`
3. Verify the correct API URL is rendered
4. Test form submission on the static host URL

## Troubleshooting

### Forms don't submit correctly

- ✅ Check `.env` file has correct `API_URL`
- ✅ Rebuild the site after changing `.env`
- ✅ Verify generated HTML has absolute URLs: `grep "action=" dist/forms/*.html`

### Getting CORS errors

- ✅ Ensure Bunny Edge Script has CORS headers configured
- ✅ Check that `origin` in Edge Script matches your static host

### Environment variable not working

- ✅ Make sure you're loading env vars in `.eleventy.js` (using `dotenv` or similar)
- ✅ Restart dev server after changing `.env`
- ✅ Check `src/_data/site.js` is reading `process.env.API_URL` correctly
