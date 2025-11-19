# rebuild-web

A hybrid static website built with Eleventy featuring custom pages, auto-generated journal content, Notion-powered builders directory, and form submissions via Cloudflare Workers.

## Overview

This project combines static site generation with modern web infrastructure to create a fast, maintainable website without heavy JavaScript frameworks. Content is managed through Markdown files and Notion databases, with automatic builds on every deploy.

### Key Features

- **Static Site Generation**: Built with Eleventy (11ty) for optimal performance
- **Component-Based Architecture**: Reusable Nunjucks components with CSS Modules
- **Dynamic Content**: Journal posts from Markdown, builders data from Notion
- **Serverless Forms**: Contact and newsletter forms via Cloudflare Workers
- **CDN Delivery**: Videos and fonts hosted on Bunny CDN
- **Privacy-First Analytics**: Tracking via Pirsch (GDPR-compliant)

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Build Tool** | Eleventy (11ty) |
| **Templates** | Nunjucks |
| **Styling** | CSS Modules + Global CSS |
| **Content** | Markdown + YAML frontmatter |
| **Hosting** | StaticHost.eu |
| **Functions** | Cloudflare Workers |
| **CDN** | Bunny CDN (video & fonts) |
| **Data Source** | Notion API (build-time) |
| **Analytics** | Pirsch |

## Project Structure

```text
/
├── .eleventy.js              # Eleventy configuration
├── postcss.config.js         # PostCSS & CSS Modules config
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
│   │   └── builders.js       # Notion fetch (build-time)
│   ├── _includes/
│   │   ├── layouts/          # Page templates
│   │   └── components/       # Reusable components + CSS
│   ├── styles/               # Global CSS
│   ├── scripts/              # Client-side JavaScript
│   └── public/               # Static assets (favicon, robots.txt)
├── api/                      # Cloudflare Workers
├── .cache/                   # Build cache (gitignored)
└── dist/                     # Build output (gitignored)
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **pnpm**
- **Git**

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
   NOTION_NEWSLETTER_DB_ID=xxxxxxxx
   NOTION_CONTACT_DB_ID=xxxxxxxx
   NOTION_BUILDERS_DB_ID=xxxxxxxx

   # Bunny CDN
   BUNNY_STORAGE_ZONE=your-zone
   BUNNY_API_KEY=xxxxxxxx
   BUNNY_PULL_ZONE_URL=https://videos.b-cdn.net
   BUNNY_FONTS_PULL_ZONE_URL=https://fonts.b-cdn.net

   # Pirsch (optional)
   PIRSCH_CLIENT_ID=xxxxxxxxxxxxx
   PIRSCH_CLIENT_SECRET=xxxxxxxxxxxxx
   ```

## Running the Project

### Development Server

Start the development server with hot reload:

```bash
npm run dev
```

The site will be available at `http://localhost:8080` (or the port Eleventy assigns).

### Production Build

Build the site for production with minification:

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

## Testing

### Local Testing Checklist

Before deploying, verify:

- [ ] Site builds without errors: `npm run build`
- [ ] All pages render correctly in development mode
- [ ] Journal posts display with proper formatting
- [ ] Navigation works across all pages
- [ ] Forms validate properly (client-side)
- [ ] Images load and are properly optimized
- [ ] Code syntax highlighting works in journal posts

### Manual Testing

1. **Test responsive design**: Check layouts on mobile, tablet, and desktop
2. **Validate HTML/CSS**: Use W3C validators
3. **Check accessibility**: Test keyboard navigation and screen reader compatibility
4. **Performance audit**: Run Lighthouse for performance metrics
5. **Cross-browser testing**: Test in Chrome, Firefox, Safari, and Edge

### Testing Forms

To test form submissions locally:

1. Set up Cloudflare Workers locally (see Cloudflare Workers documentation)
2. Update form action URLs to point to local Worker endpoints
3. Verify submissions appear in Notion databases

## Deployment

### Automatic Deployment

The project is configured for automatic deployment via StaticHost.eu:

1. **Push to main branch**: Triggers production deployment
2. **Push to staging branch**: Triggers staging deployment
3. **Pull requests**: Automatic deploy previews

### Build Configuration

StaticHost.eu build settings:

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: 18.x or 20.x

### Environment Variables

Add the following environment variables in StaticHost.eu dashboard:

- All `NOTION_*` variables (for build-time data fetching)
- All `BUNNY_*` variables (if used in build process)
- All `PIRSCH_*` variables (if using server-side analytics)

## Content Management

### Creating Journal Posts

1. Create a new Markdown file in `src/journal/`:

   ```bash
   touch src/journal/my-new-post.md
   ```

2. Add frontmatter and content:

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

3. The post will automatically appear on the journal page after rebuild.

### Managing Builders

Builders/projects are managed via a Notion database:

1. Log into your Notion workspace
2. Open the Builders database
3. Add a new entry with required properties:
   - **Name** (Title)
   - **Description** (Rich Text)
   - **Image** (Files & Media)
   - **Link** (URL)
   - **Status** (Select: Published)
   - **Tags** (Multi-select)
4. Set Status to "Published" to display on site
5. Rebuild the site to fetch latest data

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
      "description": "Event description...",
      "agenda": [
        {
          "time": "09:00",
          "title": "Registration",
          "description": "Check-in and welcome"
        }
      ]
    }
  ]
}
```

## Architecture Details

### Component System

Components are built with Nunjucks templates and CSS Modules:

```text
src/_includes/components/
├── card.njk              # Component template
├── card.module.css       # Scoped styles
├── form.njk
├── form.module.css
└── ...
```

Use components in pages:

```html
{% include "components/card.njk" %}
```

### Data Fetching

**Build-time data** (Notion builders):

- Fetched during build via `src/_data/builders.js`
- Cached locally in `.cache/builders.json`
- Falls back to cache if Notion API fails

**Static data** (events):

- Stored in `src/_data/events.json`
- Directly accessible in templates

### SEO & Meta Tags

Every page includes:

- Unique `<title>` tag
- Meta description
- Open Graph tags (title, description, image, URL)
- Twitter Card tags

Site-wide features:

- Sitemap at `/sitemap.xml`
- RSS feed at `/feed.xml`
- Custom `robots.txt` (blocks AI crawlers)

## Browser Support

**Target browsers** (last 2 versions):

- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop & iOS)
- Chrome Mobile (Android)

**Not supported**:

- Internet Explorer
- Legacy Edge (pre-Chromium)

## Performance Targets

Lighthouse scores:

- **Performance**: >90
- **Accessibility**: >90
- **Best Practices**: >90
- **SEO**: 100

## Documentation

For more detailed information, see:

- [STACK_ARCHITECTURE.md](STACK_ARCHITECTURE.md) - Complete technical architecture
- [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) - Design system and technical decisions
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Initial setup and account configuration
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference for development

## Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally: `npm run dev`
4. Build and verify: `npm run build`
5. Commit your changes: `git commit -m "Description"`
6. Push and create a pull request

### Code Style

- Use semantic HTML5 elements
- Follow CSS Modules naming conventions
- Keep components small and focused
- Write accessible markup (ARIA labels, alt text, semantic structure)
- Ensure color contrast meets WCAG AA standards

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
