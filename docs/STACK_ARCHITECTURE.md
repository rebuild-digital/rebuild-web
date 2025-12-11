# Project Stack Architecture

## The Stack

### Build & Development

- **Eleventy (11ty)** - Static site generator
  - Template language: Nunjucks (for layouts/components)
  - Markdown with YAML frontmatter (for journal entries)
  - Collections for journal filtering/tagging
  - Custom filters for date formatting, excerpt generation, etc.

### Styling & Scripts

- **TailwindCSS** - Utility-first CSS framework with custom design tokens
- **JavaScript** - Vanilla JS for interactions (countdown timers, form validation, video controls)

### Hosting & Infrastructure

- **StaticHost.eu** - Static site hosting (European)
- **Cloudflare Workers** - Serverless functions for form handling
- **Bunny CDN** - Video delivery, storage, and font hosting

### Data & Integration

- **Notion API** - Database for:
  - Form submissions (newsletter, contact)
  - Builders/Projects data (fetched at build time)
- **JSON data files** - Event data (`events.json`)
- **Markdown files** - Journal content

### Version Control & Deployment

- **Git** - Version control
- **GitHub/GitLab** - Repository hosting
- **Automatic deploys** - Push to main = deploy to StaticHost.eu

## Detailed Architecture by Page

### Homepage

**Template:** Default
**Components used:**

- Header (with navigation)
- Animated visual hero (video background or CSS animation?)
- Rich Text (core message)
- Rich Text (approach / 1-paragraph)
- Card Collection (Builders preview - links to Builders page)
- Card Collection (Journal materials preview - filtered/featured entries)
- Countdown (to nearest event)
- Form (Newsletter signup - 2 instances?)
- Footer

**Technical notes:**

- Hero could use `<video>` element with Bunny CDN source
- Countdown: client-side JS reads nearest date from `events.json`
- Newsletter forms submit to Cloudflare Worker → Notion

### "Journal" (with M badge - presumably "Many" entries)

**Template:** Journal (listing page)
**Components used:**

- Header
- Rich Text (intro/description)
- Project List (layout showing all journal entries with filtering)
- Card Collection (displays filtered results)
- Footer

**Technical notes:**

- Eleventy collections group posts by tags (Stories, Tags, Resources, Interviews, Frameworks, Design Principles, Toolkits)
- Each post is generated from markdown
- Filtering can be:
  - Build-time: separate pages per tag (`/journal/stories/`, `/journal/resources/`)
  - Client-side: single page with JS filtering
- Pagination if needed

**Individual journal entry:**

**Template:** Journal (single post)

**Components used:**

- Header
- Rich Text (article content - generated from markdown)
- Image (featured/inline images)
- Quote (pull quotes within content)
- Video (embedded content)
- Buttons (CTAs, related links)
- Card (related posts)
- Footer

### Builders

**Template:** Default
**Components used:**

- Header
- Rich Text (short description)
- Project List or Card Collection (list of builders)
- Accordion/FAQ (could work for builder profiles)
- Buttons:
  - CTA (Apply)
  - CTA (Propose)
- Footer

**Technical notes:**

- Builders list **fetched from Notion database at build time**
- Eleventy data file (`_data/builders.js`) queries Notion API
- Database properties: Name, Description, Image URL, Link, Status, etc.
- Both CTAs could link to forms or external application pages
- Build-time fetch means no client-side API calls needed

### Gatherings (Events overview)

**Template:** Event (overview)
**Components used:**

- Header
- Rich Text (high-level info)
- Rich Text (timeline/narrative)
- Card Collection (3 event cards)
- Footer

**Technical notes:**

- Reads from `events.json`
- Each card links to individual event page
- Shows key info: name, date, location

### Individual Event Pages (×3)

**Template:** Event (single)
**Components used:**

- Header
- Rich Text (dates + details)
- Countdown (to this specific event)
- Agenda (structured schedule)
- Form (optional - registration?)
- Footer

**Technical notes:**

- Each page references specific event in `events.json`
- Countdown calculates from event date
- Agenda component displays time-based schedule items

### About

**Template:** Default
**Components used:**

- Header
- Rich Text (initiative design + rationale)
- Rich Text (outcomes)
- Rich Text or Card Collection (behind the initiative / ambassadors)
- Video (potential video interview)
- Rich Text (founders)
- Rich Text or visual (progress bar initiative)
- Footer

**Technical notes:**

- Mostly static content
- Progress bar: could be data-driven from JSON or hardcoded
- Video interview via Bunny CDN

### Get in Touch

**Template:** Default
**Components used:**

- Header
- Rich Text (press + media kit intro)
- Buttons (download media kit)
- Form (contact form)
- Footer

**Technical notes:**

- Media kit: PDF in `/public/assets/` or Bunny CDN
- Contact form submits to Cloudflare Worker → Notion

## Component Architecture

Based on your components diagram, here's how they map to Eleventy:

### Content Components (Nunjucks partials)

```text
/src/_includes/components/
├── rich-text.njk       # Accepts markdown/HTML content
├── quote.njk           # Blockquote with styling
├── image.njk           # Responsive image with caption
├── video.njk           # Video player (Bunny CDN source)
├── agenda.njk          # Structured schedule display
└── buttons.njk         # CTA buttons (primary/secondary variants)
```

All component styles are defined in `src/styles/main.css` using Tailwind's `@layer components` directive.

### Interactive Components

```text
/src/_includes/components/
├── form.njk            # Form with validation, Cloudflare Worker submission
└── countdown.njk       # Timer component (client-side JS)
```

### Layout Components

```text
/src/_includes/components/
├── project-list.njk    # List/grid of items (journal, builders)
├── card.njk            # Individual card
├── card-collection.njk # Grid of cards
├── accordion.njk       # Expandable sections (FAQ)
├── header.njk          # Site header + nav
└── footer.njk          # Site footer
```

### Page Templates

```text
/src/_includes/layouts/
├── default.njk         # Base template (header + content + footer)
├── journal.njk         # Journal listing page
├── journal-post.njk    # Single journal entry
└── event.njk           # Event pages
```

### Styling

```text
/src/styles/
└── main.css            # TailwindCSS with custom design tokens
```

**Tailwind Configuration (`tailwind.config.js`):**

Design tokens are configured in the Tailwind config, extending the default theme with:

- **Colors**: Primary colors (red, blue, yellow) with shades and tints, neutrals (light, lighter, muted, darker, dark)
- **Spacing**: Custom scale (xs, sm, md, lg, xl, 2xl)
- **Border radius**: Custom values (sm, md, lg)
- **Transitions**: Custom durations (fast, base, slow)
- **Fonts**: System font stack with custom font placeholder

**Main CSS Structure (`src/styles/main.css`):**

```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base layer - Global resets and defaults */
@layer base {
  /* Typography, links, images, etc. */
}

/* Components layer - Component-specific styles */
@layer components {
  /* Button variants, card styles, header/footer, etc. */
}
```

## Data Structure

### `events.json`

```json
{
  "events": [
    {
      "id": "event-1",
      "title": "Event Name",
      "date": "2025-03-15T09:00:00Z",
      "location": "City, Country",
      "description": "...",
      "agenda": [
        {
          "time": "09:00",
          "title": "Registration",
          "description": "..."
        }
      ]
    }
  ]
}
```

### Journal markdown frontmatter

```yaml
---
title: "Post Title"
date: 2025-11-18
author: "Author Name"
tags:
  - Stories
  - Resources

excerpt: "Short description for meta description..."
featured_image: "/assets/images/post-image.jpg"
featured: false # Pin to top of journal listing
# Extensible: add new fields as needed
---
```

**Frontmatter field notes:**

- `featured_image`: Used for Open Graph/social sharing
- `featured`: Boolean for pinning posts
- `excerpt`: Used for meta description and previews
- Structure allows adding fields without breaking existing posts

## Eleventy Configuration Highlights

```javascript
// .eleventy.js key features
const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight); // Code syntax highlighting
  eleventyConfig.addPlugin(rss); // RSS feed generation

  // Collections
  eleventyConfig.addCollection("journal", ...);
  eleventyConfig.addCollection("journalByTag", ...);
  eleventyConfig.addCollection("featuredJournal", collection => {
    return collection.getFilteredByTag("journal")
      .filter(post => post.data.featured === true)
      .sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter("dateFormat", ...);
  eleventyConfig.addFilter("excerpt", ...);

  // Image shortcode using Eleventy Image
  eleventyConfig.addShortcode("image", async function(src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [300, 600, 1200],
      formats: ["webp", "jpeg"],
      outputDir: "./dist/assets/images/",
      urlPath: "/assets/images/"
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async"
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Pass-through
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy({"src/public": "/"});  // favicon, robots.txt, etc.

  // Watch targets
  eleventyConfig.addWatchTarget("src/styles/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
```

### TailwindCSS Setup

TailwindCSS is configured via `tailwind.config.js` and processed through PostCSS:

```javascript
// postcss.config.js
module.exports = {
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
```

Component styles use Tailwind's `@apply` directive in `src/styles/main.css` for reusable patterns.

## Data Fetching

### Notion Data Sources

**Builders Database (`_data/builders.js`):**

```javascript
const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "../../.cache/builders.json");

module.exports = async function () {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BUILDERS_DB_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
    });

    const data = response.results.map((page) => ({
      id: page.id,
      name: page.properties.Name.title[0].plain_text,
      description: page.properties.Description.rich_text[0]?.plain_text || "",
      imageUrl: page.properties.Image?.files[0]?.file?.url || "",
      link: page.properties.Link?.url || "",
      tags: page.properties.Tags?.multi_select.map((tag) => tag.name) || [],
    }));

    // Cache the data for future builds if Notion API fails
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.warn("Notion API failed, using cached data:", error.message);

    // Fall back to cached data if API fails
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }

    console.error("No cached data available");
    return [];
  }
};
```

**Notion Database Structure for Builders:**

- **Name** (Title) - Project/Builder name
- **Description** (Rich Text) - Short description
- **Image** (Files & Media) - Project image/logo
- **Link** (URL) - External link to project
- **Status** (Select) - Draft, Published, Archived
- **Tags** (Multi-select) - Categories/technologies
- **Order** (Number) - Display order (optional)

## SEO & Meta Tags

### Meta Tag Structure

```javascript
// In _data/site.js
module.exports = {
  title: "Site Title",
  description: "Default site description",
  url: "https://yoursite.com",
  defaultImage: "/assets/images/default-og-image.jpg",
  author: "Your Name",
};
```

### Page Meta Template (in base layout)

```html
<!-- In _includes/layouts/default.njk -->
<meta name="description" content="{{ description or site.description }}" />
<meta property="og:title" content="{{ title or site.title }}" />
<meta
  property="og:description"
  content="{{ description or site.description }}"
/>
<meta property="og:image" content="{{ image or site.defaultImage }}" />
<meta property="og:url" content="{{ site.url }}{{ page.url }}" />
<meta name="twitter:card" content="summary_large_image" />

<!-- For journal posts, use featured_image -->
{% if featured_image %}
<meta property="og:image" content="{{ featured_image }}" />
{% endif %}
```

### RSS Feed

- Location: `/feed.xml`
- Generated automatically via `@11ty/eleventy-plugin-rss`
- Includes all journal posts

### robots.txt

```text
# /src/public/robots.txt
User-agent: *
Allow: /

# Block common AI/ML crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /

Sitemap: https://yoursite.com/sitemap.xml
```

### Sitemap

- Auto-generated via `@11ty/eleventy-plugin-sitemap`
- Includes all pages and journal posts

## Error Handling

### 404 Page

- Custom 404 template: `src/pages/404.html`
- Styled to match site design
- Includes navigation back to home/journal

### Build-Time Failures

- **Notion API failure**: Falls back to cached builders data (see above)
- **Image processing failure**: Log warning, use original image
- **Missing frontmatter**: Provide sensible defaults

## Forms & Validation

### Client-Side Validation Rules

```javascript
// Newsletter form

- Email: required, valid email format
- Honeypot field (hidden, should remain empty)

// Contact form

- Name: required, min 2 chars, max 100 chars
- Email: required, valid email format
- Message: required, min 10 chars, max 1000 chars
- Honeypot field (hidden, should remain empty)

```

### Validation UX

- Inline error messages (red text below field)
- Field border color change on error (red) and success (green)
- Disable submit button while submitting
- Success message replaces form on successful submission
- Error message for failed submissions (try again)

### Spam Protection

- Hidden honeypot field
- Client-side validation before submission
- Rate limiting on Worker side (optional)

## Accessibility Baseline

### Requirements

- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- ARIA labels on interactive elements (buttons, forms, navigation)
- Keyboard navigation:
  - Tab order follows visual order
  - Forms fully keyboard accessible
- Color contrast: Minimum WCAG AA (4.5:1 for normal text)
- Alt text for all images
- Focus indicators visible on all interactive elements

## Video Configuration

### Video Component Features

```html
<!-- Example video component usage -->
<video
  src="https://cdn.bunny.net/video.mp4"
  poster="/assets/images/video-poster.jpg"
  controls
  preload="metadata"
  muted
  <!--
  Required
  for
  autoplay
  --
>
  {% if autoplay %}autoplay{% endif %} > Your browser does not support video
  playback.
</video>
```

### Video Guidelines

- Autoplay: Optional parameter, must be muted
- Controls: Simple native browser controls
- Poster images: Static frame or custom image
- Preload: `metadata` for performance
- Formats: MP4 (primary), WebM (optional fallback)

## Browser Support

**Target:** Last 2 versions of modern browsers

- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**No support needed for:**

- Internet Explorer
- Legacy Edge (pre-Chromium)

## Build & Deployment

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "eleventy --serve --watch",
    "build": "NODE_ENV=production eleventy && npm run minify",
    "minify": "npm run minify:css && npm run minify:js",
    "minify:css": "postcss dist/**/*.css --replace --use cssnano",
    "minify:js": "terser dist/**/*.js --compress --mangle -o dist/bundle.min.js",
    "serve": "eleventy --serve",
    "clean": "rm -rf dist .cache"
  }
}
```

### Environment Configuration

- **Development**: Local with hot reload, no minification
- **Staging**: Full build on StaticHost.eu, staging subdomain
- **Production**: Full build with minification, caching, custom domain

### Build Caching Strategy

- Cache `.cache/` directory between builds
- Cache `node_modules/`
- Invalidate on: package.json changes, Notion data changes

### Deploy Previews

- Automatic for pull requests
- Temporary URLs for review
- Same build process as production

## Security

### Security Headers (Configure on StaticHost.eu or via Worker)

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.b-cdn.net; media-src https://videos.b-cdn.net;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### CORS for Cloudflare Workers

```javascript
// In Worker response
headers.set("Access-Control-Allow-Origin", "https://yoursite.com");
headers.set("Access-Control-Allow-Methods", "POST");
headers.set("Access-Control-Allow-Headers", "Content-Type");
```

## Rate Limiting & Performance

### Notion API Rate Limits

- **Rate**: ~3 requests per second
- **Strategy**:
  - Build-time only (not client-side)
  - Cache results between builds
  - Exponential backoff on failures

### Build Performance

- Incremental builds where possible
- Parallel processing of images
- Cache external API calls
- Target build time: <2 minutes

### Page Performance Targets (Lighthouse)

- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: 100

## Cloudflare Workers for Forms

**Two endpoints needed (form submissions only):**

1. `/api/newsletter` - Newsletter signup
2. `/api/contact` - Contact form

Each receives POST data and uses Notion API to create database entries.

**Note:** Builders data is fetched at **build time** via Eleventy data files, not via Workers.

## Development Workflow

1. **Local development:** `npm start` (Eleventy dev server)
2. **Write journal post:** Create markdown in `/src/content/journal/`
3. **Commit & push:** Git push to main
4. **Auto-deploy:** StaticHost.eu builds and deploys
5. **Videos & fonts:** Upload to Bunny CDN, reference URLs in content

## Directory Structure

```text
/
├── src/
│   ├── pages/
│   │   ├── index.html        # Homepage
│   │   ├── about.html
│   │   ├── builders.html     # Uses builders data from Notion
│   │   ├── contact.html      # Get in Touch page
│   │   ├── 404.html          # Error page
│   │   ├── events/
│   │   │   ├── index.html    # Events overview
│   │   │   ├── event-1.html
│   │   │   ├── event-2.html
│   │   │   └── event-3.html
│   │   └── journal/          # Generated from markdown
│   ├── content/
│   │   └── journal/          # Markdown posts
│   ├── _data/
│   │   ├── site.js           # Global site config (title, description, URLs)
│   │   ├── events.json       # Event data (dates, agendas, etc.)
│   │   └── builders.js       # Fetches builders from Notion at build time
│   ├── _includes/
│   │   ├── layouts/          # Page templates
│   │   └── components/       # Reusable components
│   ├── styles/
│   │   └── main.css          # TailwindCSS with custom design tokens
│   ├── scripts/
│   │   ├── countdown.js      # Countdown timer logic
│   │   └── forms.js          # Form validation & submission
│   └── public/               # Static files copied to root
│       ├── favicon.ico
│       ├── robots.txt
│       └── assets/
│           ├── images/
│           │   └── default-og-image.jpg
│           └── media-kit.pdf
├── api/                      # Serverless functions (Cloudflare Workers)
│   ├── newsletter-handler/
│   └── contact-handler/
├── .cache/                   # Build cache (gitignored)
│   └── builders.json         # Cached Notion data
├── dist/                     # Build output (gitignored)
├── .eleventy.js              # Eleventy config
├── postcss.config.js         # PostCSS config (TailwindCSS)
├── tailwind.config.js        # Tailwind configuration
├── package.json
├── .env                      # Environment variables (gitignored)
├── .env.example              # Example env vars (committed)
└── .gitignore
```
