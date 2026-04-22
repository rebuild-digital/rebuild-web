# rebuild-web

A production Eleventy static site with Nunjucks components, TailwindCSS styling, Bunny CDN Edge Scripts for forms, MailerLite integration, and Notion API for build-time data. Start here.

## Tech Stack

| Layer             | Technology                            |
| ----------------- | ------------------------------------- |
| **Static Site**   | Eleventy (11ty) + Nunjucks templates  |
| **Styling**       | TailwindCSS + PostCSS                 |
| **Content**       | Markdown files, Notion API            |
| **CDN & Hosting** | Bunny CDN (Edge Scripts, storage)     |
| **Forms**         | MailerLite API via Bunny Edge Scripts |
| **Analytics**     | Pirsch (privacy-first)                |

## Key Features

- **Component-based architecture**: Reusable Nunjucks components (forms, carousel, cards)
- **Dynamic forms**: Sidebar form system with MailerLite integration
- **Build-time data**: Builders directory from Notion
- **CDN-optimized**: Videos, fonts, and assets via Bunny CDN
- **No heavy JavaScript**: Minimal client-side JS for performance

## Project Structure

```text
/
├── .eleventy.js              # Eleventy configuration
├── postcss.config.js         # PostCSS & TailwindCSS config
├── tailwind.config.js        # Tailwind configuration
├── package.json              # Dependencies & scripts
├── src/
│   ├── index.html            # Homepage
│   ├── journal.html          # Journal listing page
│   ├── builders.html         # Builders listing page
│   ├── gatherings.html       # Events/gatherings page
│   ├── journal/              # Markdown blog posts
│   ├── _data/
│   │   ├── site.js           # Global site configuration
│   │   ├── events.json       # Event data
│   │   ├── carousel.json     # Carousel slides data
│   │   └── builders.js       # Notion fetch (build-time)
│   ├── _includes/
│   │   ├── layouts/          # Page templates
│   │   └── components/       # Reusable components
│   │       ├── forms/        # Form components
│   │       ├── carousel.njk
│   │       ├── form-sidebar.njk
│   │       └── ...
│   ├── forms/                # Form HTML endpoints
│   ├── styles/               # TailwindCSS styles
│   ├── scripts/              # Client-side JavaScript
│   └── public/               # Static assets
├── src/scripts/              # Client-side JavaScript & edge scripts
├── .cache/                   # Build cache (gitignored)
└── dist/                     # Build output (gitignored)
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or pnpm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd rebuild-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment variables file:

   ```bash
   cp .env.example .env
   ```

4. Add your environment variables to `.env`:

   ```bash
   # Notion
   NOTION_TOKEN=secret_xxxxxxxxxxxxx
   NOTION_BUILDERS_DB_ID=xxxxxxxx

   # Bunny CDN
   BUNNY_STORAGE_ZONE=your-zone
   BUNNY_API_KEY=xxxxxxxx
   BUNNY_PULL_ZONE_URL=https://videos.b-cdn.net
   BUNNY_FONTS_PULL_ZONE_URL=https://fonts.b-cdn.net

   # MailerLite
   MAILERLITE_API_KEY=xxxxxxxxxxxxx
   MAILERLITE_GROUP_ID=12345

   # Pirsch (optional)
   PIRSCH_CLIENT_ID=xxxxxxxxxxxxx
   PIRSCH_CLIENT_SECRET=xxxxxxxxxxxxx
   ```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The site will be available at `http://localhost:8080`.

### Production Build

Build the site for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Other Commands

```bash
# Serve built site locally
npm run serve

# Clean build output and cache
npm run clean

# Minify CSS only
npm run minify:css

# Minify JavaScript only
npm run minify:js
```

## Content Management

### Creating Journal Posts

Create a new Markdown file in `src/journal/`:

```markdown
---
title: "My New Post Title"
date: 2025-11-19
author: "Your Name"
tags:
  - Stories
  - Resources
excerpt: "A brief description for meta tags and previews"
featured_image: "/assets/images/post-image.jpg"
featured: false
---

Your post content here...
```

The post will automatically appear on the journal page after rebuild.

### Managing Builders

Builders are managed via a Notion database:

1. Open the Builders database in Notion
2. Add a new entry with required properties:
   - **Name** (Title)
   - **Description** (Rich Text)
   - **Image** (Files & Media)
   - **Link** (URL)
   - **Status** (Select: Published)
   - **Tags** (Multi-select)
3. Set Status to "Published" to display on site
4. Rebuild the site to fetch latest data

### Updating Events

Events are managed via `src/_data/events.json`:

```json
{
	"events": [
		{
			"id": "event-1",
			"title": "Event Name",
			"date": "2025-03-15T09:00:00Z",
			"location": "City, Country",
			"description": "Event description..."
		}
	]
}
```

### Updating Carousel

Carousel slides are managed via `src/_data/carousel.json`:

```json
{
	"slides": [
		{
			"id": "slide-1",
			"headline": "Your Headline",
			"subheader": "Description text",
			"image": "/assets/images/slide.jpg",
			"ctaText": "Button Text",
			"ctaLink": "/link/",
			"bgColor": "#e8e8e8"
		}
	]
}
```

## Components

### Forms System

The site uses a sidebar form system with MailerLite integration:

**Sidebar Forms** (triggered by data attributes):

```html
<button data-form="builder-promo">
	Nominate a Builder
</button>
<button data-form="builder-application">Apply Now</button>
<button data-form="newsletter">Subscribe</button>
<button data-form="gathering-invitation">
	Request Invitation
</button>
```

**Newsletter Form** (inline or standard):

```njk
{# Standard layout #}
{% include "components/forms/newsletter-form.njk" %}

{# Inline layout for footer/sidebar #}
{% include "components/forms/newsletter-form.njk" with { inline: true } %}
```

**Custom Forms** using base component:

```njk
{% set myFormFields = [
  {
    type: 'text',
    name: 'full_name',
    label: 'Full Name',
    required: true
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email Address',
    required: true
  },
  {
    type: 'textarea',
    name: 'message',
    label: 'Message',
    rows: 5,
    required: true
  }
] %}

{% include "components/form.njk" with {
  formId: 'contact-form',
  action: '/api/contact',
  title: 'Get in Touch',
  submitText: 'Send Message',
  fields: myFormFields
} %}
```

**Supported Field Types:**

- `text`, `email`, `tel`, `url` - Input fields
- `textarea` - Multi-line text
- `select` - Dropdown
- `radio` - Radio buttons
- `checkbox` - Checkboxes

**Sidebar Form Behavior:**

- Desktop (≥768px): Slides in from right as 500-600px sidebar, page content shifts left
- Mobile (<768px): Full-screen modal with dark overlay
- Close with X button, ESC key, or overlay click
- JavaScript API: `window.loadForm('form-name')`, `window.closeFormSidebar()`

**Form Processing Flow:**

1. Client-side validation
2. Submit to Bunny Edge Script
3. Edge Script validates and routes to MailerLite (newsletters) or Notion (form submissions)
4. Return success/error to client

### Carousel

Include the carousel component:

```njk
{% include "components/carousel.njk" %}
```

Customize slides via [src/\_data/carousel.json](src/_data/carousel.json):

```json
{
	"slides": [
		{
			"id": "slide-1",
			"headline": "Your Headline Here",
			"subheader": "Your descriptive text here",
			"image": "/assets/images/your-image.jpg",
			"ctaText": "Button Text",
			"ctaLink": "/your-link/",
			"bgColor": "#e8e8e8"
		}
	]
}
```

**Features:**

- Auto-rotation every 5 seconds
- Navigation dots, prev/next arrows, keyboard arrows, touch/swipe
- Pause on hover and when page hidden
- Fully accessible with ARIA labels

### Image Credits

Add credits to images:

```njk
{% from "components/image-credit.njk" import imageCredit %}

<div class="relative">
  <img src="/assets/images/photo.jpg" alt="Description">
  {{ imageCredit("Photo by John Doe") }}
</div>
```

Position in any corner:

```njk
{{ imageCredit("Photo by John Doe", position="bottom-left") }}
{{ imageCredit("Photo by John Doe", position="top-right") }}
{{ imageCredit("Photo by John Doe", position="top-left") }}
```

## Architecture

### Component System

Components are built with Nunjucks templates and styled with TailwindCSS:

```text
src/_includes/components/
├── carousel.njk
├── card.njk
├── buttons.njk
├── header.njk
├── footer.njk
├── form-sidebar.njk
└── forms/
    ├── newsletter-form.njk
    ├── builder-promo-form.njk
    └── ...
```

### Data Fetching

**Build-time data** (Notion builders):

- Fetched during build via `src/_data/builders.js`
- Cached locally in `.cache/builders.json`
- Falls back to cache if Notion API fails

**Static data** (events, carousel):

- Stored in `src/_data/*.json`
- Directly accessible in templates

### Form Handling & Bunny Edge Scripts

Forms submit to Bunny Edge Scripts which handle backend processing:

**Edge Script (Combined Handler):**

- Located: `src/scripts/edge-script.js`
- Handles all form endpoints:
  - `/api/newsletter-signup` → MailerLite
  - `/api/builder-application` → Notion
  - `/api/builder-promotion` → Notion
  - `/api/gathering-invitation` → Notion
- Features:
  - MailerLite API v2 integration for newsletter signups
  - Notion API integration for form submissions
  - 5-second deduplication window for rapid submissions
  - Maps interest field to MailerLite custom field
  - Proper error handling and validation
  - Newsletter checkbox on all forms signs up users directly to MailerLite
  - Uses Bunny SDK with middleware pattern (prevents infinite loops)

**Required Environment Variables:**

```bash
MAILERLITE_API_KEY=eyJxxxxxxxxxxxxx
MAILERLITE_GROUP_ID=12345  # Optional
NOTION_TOKEN=secret_xxxxxxxxxxxxx
NOTION_BUILDERS_DB_ID=xxxxxxxx
```

**Deployment Steps:**

1. Update origin URL in edge script to match your domain
2. Log into Bunny CDN Dashboard → Pull Zones → Edge Scripts
3. Create new Edge Script as Middleware
4. Copy script contents from `src/scripts/edge-script.js`
5. Add environment variables in Edge Scripts dashboard
6. Enable script and save changes
7. Update CORS headers for production domain

**MailerLite Setup:**

1. Get API key from <https://dashboard.mailerlite.com/integrations/api>
2. Create custom field named `interest` (Text type) in MailerLite
3. Optionally get Group ID from URL: `dashboard.mailerlite.com/groups/{GROUP_ID}/subscribers`

### SEO & Meta

Every page includes:

- Unique `<title>` tag
- Meta description
- Open Graph tags
- Twitter Card tags

Site-wide features:

- Sitemap at `/sitemap.xml`
- RSS feed at `/feed.xml`
- Custom `robots.txt`

## Deployment

### Automatic Deployment

The project deploys automatically via StaticHost.eu:

- **Push to main**: Production deployment
- **Push to staging**: Staging deployment
- **Pull requests**: Deploy previews

### Build Configuration

StaticHost.eu settings:

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: 18.x or 20.x

### Environment Variables

Configure in StaticHost.eu dashboard:

- All `NOTION_*` variables
- All `BUNNY_*` variables
- All `MAILERLITE_*` variables
- All `PIRSCH_*` variables

### Bunny Edge Scripts

After deploying to StaticHost, configure Bunny Edge Scripts:

1. Log into Bunny CDN dashboard
2. Navigate to Pull Zones → Select your zone → Edge Scripts
3. Deploy the edge script from `src/scripts/edge-script.js`
4. Set environment variables (see list above)
5. Enable the script

See Edge Scripts configuration details above in "Form Handling & Bunny Edge Scripts".

## Performance

### Browser Support

Target browsers (last 2 versions):

- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop & iOS)
- Chrome Mobile (Android)

### Performance Targets

Lighthouse scores:

- **Performance**: >90
- **Accessibility**: >90
- **Best Practices**: >90
- **SEO**: 100

## Development Guidelines

### Code Style

- Use semantic HTML5 elements
- Use TailwindCSS utility classes for styling
- Keep components small and focused
- Write accessible markup (ARIA labels, alt text, semantic structure)
- Ensure color contrast meets WCAG AA standards

### Git Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally: `npm run dev`
4. Build and verify: `npm run build`
5. Commit changes: `git commit -m "Description"`
6. Push and create a pull request

### Commit Messages

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Adding New Forms

To add a new sidebar form:

1. **Create form component** in `src/_includes/components/forms/your-form.njk`:

   ```njk
   <form action="/api/your-endpoint" method="POST">
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

3. **Register in** [src/scripts/form-triggers.js](src/scripts/form-triggers.js):

   ```javascript
   const formUrls = {
   	"builder-promo": "/forms/builder-promo.html",
   	"builder-application":
   		"/forms/builder-application.html",
   	newsletter: "/forms/newsletter.html",
   	"your-form": "/forms/your-form.html", // Add this
   };
   ```

4. **Use it in your pages**:

   ```html
   <button data-form="your-form">Open Your Form</button>
   ```

## Reference Documentation

Additional documentation files:

- [CLAUDE.md](CLAUDE.md) - AI assistant instructions for this project
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Complete deployment checklist

## Troubleshooting

### Build Errors

**Module not found**:

- Run `npm install` to ensure all dependencies are installed

**PostCSS errors**:

- Clear cache: `npm run clean`
- Rebuild: `npm run build`

**Eleventy build fails**:

- Check for syntax errors in Nunjucks templates
- Verify data files are valid JSON
- Check console output for specific error messages

### Development Server Issues

**Port already in use**:

- Kill the process using port 8080: `lsof -ti:8080 | xargs kill`
- Or specify a different port in [.eleventy.js](.eleventy.js)

**Hot reload not working**:

- Check browser console for errors
- Restart development server
- Clear browser cache

**Images or assets not loading**:

- Verify file paths are correct
- Check that files exist in `src/public/` or configured asset directory
- Rebuild: `npm run build`

### Form Submission Issues

**Forms not submitting**:

- Check browser console for JavaScript errors
- Verify Edge Scripts are enabled in Bunny CDN dashboard
- Check Edge Script logs in Bunny dashboard
- Verify CORS headers allow your domain
- Test with browser network tab to see actual request/response

**Form submitting multiple times**:

- Clear browser cache
- Check browser console for multiple form handlers initializing
- Verify deduplication is working in Bunny logs
- Check for duplicate event listeners in code

**Validation errors**:

- "Email is required": Field empty or form data not parsing correctly
- "Consent is required": Footer form has hidden consent field; full form requires checkbox
- "Interest selection required": Newsletter form requires selecting interest dropdown

**Data not appearing in MailerLite**:

- Check Bunny logs for successful 200 responses from MailerLite API
- Verify API key has correct permissions in MailerLite dashboard
- Check MailerLite "Unconfirmed" tab if double opt-in is enabled
- Verify custom field `interest` exists in MailerLite
- Try a different test email

**Data not appearing in Notion**:

- Verify Notion API token is valid
- Check database ID is correct
- Ensure Notion integration has access to the database
- Review Edge Script logs for API errors

**CORS errors in browser**:

- Verify CORS headers in edge script match your domain
- Check that OPTIONS preflight returns 200
- Update `Access-Control-Allow-Origin` header in edge script

**MailerLite API errors**:

- 401 Unauthorized: API key is wrong or expired
- 400 Bad Request: Invalid email format or missing required fields
- Check request payload in Bunny logs for details

### Carousel Issues

**Carousel not appearing**:

- Ensure [src/\_data/carousel.json](src/_data/carousel.json) has valid data
- Check that images exist at specified paths
- Verify carousel script is loaded in [src/\_includes/layouts/base.njk](src/_includes/layouts/base.njk)

**Navigation not working**:

- Check browser console for JavaScript errors
- Ensure [src/scripts/carousel.js](src/scripts/carousel.js) is being served correctly
- Verify carousel container has correct class names

**Styles not applying**:

- Run `npm run build:css` to rebuild CSS
- Clear browser cache
- Check that [src/styles/main.css](src/styles/main.css) includes carousel styles

### Styling Issues

**TailwindCSS classes not working**:

- Rebuild CSS: `npm run build:css`
- Check for typos in class names
- Verify PostCSS config is correct
- Ensure classes are not purged by TailwindCSS

**Custom CSS not applying**:

- Check file is imported in [src/styles/main.css](src/styles/main.css)
- Clear browser cache
- Check browser dev tools for CSS conflicts

### Edge Script Debugging

**Infinite loop detection**:

- Verify script only intercepts specific API paths
- Ensure script returns `void` for non-API paths
- Check origin URL is correct and doesn't point back to edge script
- Use Bunny SDK middleware pattern to prevent loops

**Edge script errors**:

- Check Bunny dashboard logs for error messages
- Verify environment variables are set correctly
- Test edge script with curl or Postman
- Check that script is enabled in Bunny dashboard

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
