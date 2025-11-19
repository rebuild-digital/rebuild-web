# Project Quick Reference for Development

This is a quick reference guide for starting development. For full details, see the other documentation files.

---

## What We're Building

A hybrid static website with:
- Custom HTML/CSS pages (homepage, about, events, contact)
- Auto-generated journal from markdown posts
- Builders/projects list fetched from Notion
- Forms that submit to Cloudflare Workers → Notion
- Videos delivered via Bunny CDN
- No JavaScript framework, no CMS

---

## Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| **Build Tool** | Eleventy (11ty) |
| **Templates** | Nunjucks |
| **Styling** | CSS Modules |
| **Content** | Markdown + YAML frontmatter |
| **Hosting** | StaticHost.eu |
| **Functions** | Cloudflare Workers |
| **Video CDN** | Bunny CDN |
| **Font CDN** | Bunny CDN (future) |
| **Data Source** | Notion API (build-time) |
| **Analytics** | Pirsch |

---

## Key Files & Locations

```
/
├── .eleventy.js              # Main Eleventy config
├── postcss.config.js         # CSS Modules config
├── package.json              # Scripts + dependencies
├── src/
│   ├── pages/                # Static + generated pages
│   ├── content/journal/      # Markdown blog posts
│   ├── _data/
│   │   ├── site.js           # Global site data
│   │   ├── events.json       # Event data
│   │   └── builders.js       # Notion fetch (build-time)
│   ├── _includes/
│   │   ├── layouts/          # Page templates
│   │   └── components/       # Reusable components + CSS
│   ├── styles/               # Global CSS
│   └── scripts/              # Client-side JS
├── api/                      # Cloudflare Workers
└── dist/                     # Build output (gitignored)
```

---

## Critical Design Decisions

### Colors
- 3 primaries (red, blue, yellow) + shade + tint each
- Yellow = persistent site background
- Off-white + dark with tints
- Defined as CSS custom properties in `global.css`

### Typography
- **Current**: System UI fonts
- **Future**: Custom sans-serif (to be added)

### Forms
- Two forms: Newsletter, Contact
- Client validation + Cloudflare Worker → Notion
- Honeypot spam protection

### Images
- Eleventy Image plugin (local storage)
- WebP + JPEG fallbacks
- Responsive with srcset

### Journal
- Markdown with frontmatter
- Fields: title, date, author, tags, excerpt, featured_image, featured
- Syntax highlighting for code blocks
- Tag-based filtering

### Builders
- Fetched from Notion at build time
- Cached locally if API fails
- Status filter: only "Published"

### Videos
- Bunny CDN delivery
- Native HTML5 player
- Autoplay option (muted only)

---

## Environment Variables Needed

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

# Pirsch (optional - if using server-side)
PIRSCH_CLIENT_ID=xxxxxxxxxxxxx
PIRSCH_CLIENT_SECRET=xxxxxxxxxxxxx
```

---

## NPM Scripts to Create

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

---

## Dependencies to Install

### Core
```bash
npm install --save-dev @11ty/eleventy
npm install --save-dev @11ty/eleventy-img
npm install --save-dev @11ty/eleventy-plugin-syntaxhighlight
npm install --save-dev @11ty/eleventy-plugin-rss
npm install --save-dev @11ty/eleventy-plugin-sitemap
```

### CSS Processing
```bash
npm install --save-dev postcss postcss-modules postcss-cli
npm install --save-dev cssnano
npm install --save-dev eleventy-plugin-postcss
```

### JavaScript
```bash
npm install --save-dev terser
```

### APIs & Utils
```bash
npm install @notionhq/client
npm install dotenv
```

---

## Component Structure

Each component should have:
- `.njk` file (Nunjucks template)
- `.module.css` file (scoped styles)

Example:
```
/src/_includes/components/
├── card.njk
├── card.module.css
├── form.njk
├── form.module.css
etc.
```

---

## SEO Requirements

### Every Page Needs
- `<title>` tag (unique per page)
- Meta description
- Open Graph tags (title, description, image, URL)
- Twitter Card tags

### Site-Wide
- Sitemap at `/sitemap.xml`
- RSS feed at `/feed.xml`
- robots.txt with AI crawler blocks
- Favicon

---

## Accessibility Checklist

- [ ] Semantic HTML5 elements
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation (tab order, focus indicators)
- [ ] Alt text on all images
- [ ] Color contrast WCAG AA minimum
- [ ] Form labels associated with inputs
- [ ] Skip to main content link

---

## Browser Support

**Target**: Last 2 versions of modern browsers
- Chrome/Edge, Firefox, Safari, Mobile Safari, Chrome Mobile

**No support**: IE, Legacy Edge

---

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Create journal post**: Add markdown file to `src/content/journal/`
3. **Edit page**: Modify HTML in `src/pages/`
4. **Add component**: Create `.njk` + `.module.css` in `src/_includes/components/`
5. **Build for production**: `npm run build`
6. **Deploy**: Push to `main` branch → auto-deploy

---

## Common Patterns

### Using a Component in a Page
```html
{% include "components/card.njk" %}
```

### Accessing Site Data
```html
{{ site.title }}
{{ site.description }}
```

### Accessing Builders Data
```html
{% for builder in builders %}
  <h3>{{ builder.name }}</h3>
  <p>{{ builder.description }}</p>
{% endfor %}
```

### Journal Loop
```html
{% for post in collections.journal | reverse %}
  <article>
    <h2>{{ post.data.title }}</h2>
    <time>{{ post.date | dateFormat }}</time>
  </article>
{% endfor %}
```

### Optimized Image
```html
{% image "src/assets/images/photo.jpg", "Alt text", "(min-width: 768px) 50vw, 100vw" %}
```

---

## Testing Checklist

Before deploying:
- [ ] All pages load without errors
- [ ] Forms submit successfully (test with Notion)
- [ ] Videos play from Bunny CDN
- [ ] Images optimize correctly
- [ ] Journal posts generate from markdown
- [ ] Navigation works across site
- [ ] Mobile responsive
- [ ] Lighthouse scores meet targets
- [ ] RSS feed validates
- [ ] Sitemap generates correctly

---

## Important Notes

1. **Yellow background** - Applied globally, should be visible everywhere
2. **System fonts only** - Custom font will be added later
3. **Builders cache** - Don't fail build if Notion API is down
4. **No framework** - Pure HTML/CSS/JS, no React/Vue/Svelte
5. **CSS Modules** - Keep styles scoped to components
6. **Notion at build time** - Not client-side, only during build
7. **Videos on CDN** - Never in git repo, always reference Bunny URLs
8. **Aggressive robots.txt** - Block all AI crawlers

---

## Where to Find More Info

- **Full architecture**: `STACK_ARCHITECTURE.md`
- **Setup guide**: `SETUP_CHECKLIST.md`
- **All decisions**: `DESIGN_DECISIONS.md`
- **Eleventy docs**: https://www.11ty.dev/docs/
- **CSS Modules**: https://github.com/css-modules/css-modules
- **Notion API**: https://developers.notion.com/

---

Ready to build! Start with the basic Eleventy setup and directory structure, then build components incrementally.
