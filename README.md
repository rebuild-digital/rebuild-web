# rebuild-web

A hybrid static website built with Eleventy featuring custom pages, journal content, Notion-powered builders directory, and dynamic forms with MailerLite integration.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Static Site** | Eleventy (11ty) + Nunjucks templates |
| **Styling** | TailwindCSS + PostCSS |
| **Content** | Markdown files, Notion API |
| **CDN & Hosting** | Bunny CDN (Edge Scripts, storage) |
| **Forms** | MailerLite API via Bunny Edge Scripts |
| **Analytics** | Pirsch (privacy-first) |

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
├── bunny-edge-scripts/       # Bunny CDN Edge Scripts
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

### Forms

The site uses a flexible form system with multiple components:

**Newsletter Form** (inline or standard):

```njk
{% include "components/forms/newsletter-form.njk" %}
```

**Sidebar Forms** (triggered by data attributes):

```html
<button data-form="builder-promo">Nominate a Builder</button>
<button data-form="builder-application">Apply Now</button>
<button data-form="newsletter">Subscribe</button>
```

Available forms:
- `builder-promo` - Nominate a builder
- `builder-application` - Apply to join directory
- `newsletter` - Newsletter signup
- `gathering-invitation` - Request gathering invitation

### Carousel

Include the carousel component:

```njk
{% include "components/carousel.njk" %}
```

Customize slides via `src/_data/carousel.json`.

### Image Credits

Add credits to images:

```njk
{% from "components/image-credit.njk" import imageCredit %}

<div class="relative">
  <img src="/assets/images/photo.jpg" alt="Description">
  {{ imageCredit("Photo by John Doe") }}
</div>
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

### Form Handling

Forms submit to Bunny Edge Scripts which:
1. Validate and sanitize input
2. Send data to MailerLite (newsletter signups)
3. Send data to Notion (form submissions)
4. Return success/error responses

See `bunny-edge-scripts/` directory for Edge Script implementations.

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
3. Deploy scripts from `bunny-edge-scripts/` directory
4. Set environment variables for each script
5. Enable scripts

See [NEWSLETTER_IMPLEMENTATION.md](NEWSLETTER_IMPLEMENTATION.md) for detailed Edge Script setup.

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

## Reference Documentation

For detailed implementation guides and checklists, see:

- [NEWSLETTER_IMPLEMENTATION.md](NEWSLETTER_IMPLEMENTATION.md) - MailerLite integration guide
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Complete deployment checklist
- [FORMS_GUIDE.md](FORMS_GUIDE.md) - Detailed form component documentation
- [SIDEBAR_FORMS.md](SIDEBAR_FORMS.md) - Sidebar form system documentation
- [CAROUSEL.md](CAROUSEL.md) - Carousel component documentation
- [IMAGE-CREDIT-EXAMPLES.md](IMAGE-CREDIT-EXAMPLES.md) - Image credit usage examples

## Troubleshooting

### Build Errors

**Module not found**:
- Run `npm install` to ensure all dependencies are installed

**PostCSS errors**:
- Clear cache: `npm run clean`
- Rebuild: `npm run build`

### Development Server Issues

**Port already in use**:
- Kill the process using port 8080
- Or specify a different port in `.eleventy.js`

**Hot reload not working**:
- Check browser console for errors
- Restart development server

### Form Submission Issues

**Forms not submitting**:
- Check browser console for errors
- Verify Edge Scripts are enabled in Bunny CDN
- Check Edge Script logs in Bunny dashboard

**Data not appearing in MailerLite/Notion**:
- Verify API keys are correct
- Check Edge Script environment variables
- Review Edge Script logs for errors

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
