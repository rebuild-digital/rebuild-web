# Design & Technical Decisions

This document captures all key decisions made for the project to serve as a reference during development.

## Design System

### Color Palette

**Primary Colors** (exact hex values TBD):

- **Red**: Base + Shade + Tint
- **Blue**: Base + Shade + Tint
- **Yellow**: Base + Shade + Tint (persistent site background)

**Neutrals**:

- **Off-white**: For text on dark backgrounds
- **Dark**: Primary text color + 3 tints for hierarchy

**Implementation**: CSS custom properties in `global.css` (see STACK_ARCHITECTURE.md for structure)

### Typography

**Current**: System UI font stack

```css
--font-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

**Future**: Custom sans-serif font (to be added)

- Will replace system fonts across entire site
- Hosted on Bunny CDN when ready
- Font loading strategy: `font-display: swap`

### Layout

**Background**: Yellow (primary color) as persistent site background
**Approach**: Component-based with CSS Modules for scoping

## Content Strategy

### Journal Posts

**Frontmatter Structure**:

```yaml
title: "Post Title"
date: 2025-11-18
author: "Author Name"
tags: [Stories, Resources, etc.]
excerpt: "Meta description..."
featured_image: "/assets/images/post-image.jpg"
featured: false  # Pin to top
```

**Features**:

- Tag-based filtering (7 categories: Stories, Tags, Resources, Interviews, Frameworks, Design Principles, Toolkits)
- Featured/pinned posts
- Inline code blocks with syntax highlighting
- Extensible structure for future fields

**SEO**:

- Journal posts use `featured_image` for Open Graph
- Dynamic meta descriptions from `excerpt`
- All other pages use default site OG image

### Builders/Projects

**Data Source**: Notion database (fetched at build time)

**Notion Properties**:

- Name (Title)
- Description (Rich Text)
- Image (Files & Media)
- Link (URL)
- Status (Select: Draft, Published, Archived)
- Tags (Multi-select)
- Order (Number) - optional

**Caching**: Falls back to cached data if Notion API fails during build

### Events

**Data Source**: JSON file (`events.json`)

- Only 3 events total
- Includes dates, locations, agendas
- Used for countdown timers

## Technical Decisions

### Static Site Generation

**Tool**: Eleventy (11ty)

- No JavaScript framework needed
- Nunjucks for templating
- Markdown with frontmatter for content
- Build-time data fetching from Notion

### Styling

**Approach**: CSS Modules

- Component-scoped styles (`.module.css` files)
- Global styles for variables, typography, utilities
- No CSS-in-JS, no preprocessors (yet)

### Images

**Strategy**: Eleventy Image plugin

- Responsive images with `srcset`
- WebP + JPEG fallbacks
- Lazy loading by default
- Local storage (not CDN)
- Automatic optimization at build time

### Code Highlighting

**Implementation**: `@11ty/eleventy-plugin-syntaxhighlight`

- Supports inline code blocks
- Language-specific syntax highlighting
- Styled via CSS

### Forms

**Architecture**:

- Client-side: HTML5 validation + custom JavaScript
- Server-side: Cloudflare Workers → Notion API
- Two forms: Newsletter signup, Contact

**Validation Rules**:

- Required fields marked clearly
- Email format validation
- Character limits enforced
- Honeypot spam protection

**UX**:

- Inline error messages
- Border color feedback (red/green)
- Submit button disabled during submission
- Success message replaces form
- Clear error handling

### Videos

**Hosting**: Bunny CDN

**Player**: Native HTML5 `<video>` element

**Features**:

- Simple browser controls
- Autoplay option (must be muted)
- Poster images (from video frame ideally)
- Preload: `metadata` for performance

**Formats**:

- Primary: MP4
- Optional: WebM for better compression

## Browser Support

**Target**: Modern browsers only (last 2 versions)

- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop + iOS)
- Chrome Mobile (Android)

**No support**:

- Internet Explorer
- Legacy Edge (pre-Chromium)

**Polyfills**: None needed for modern browsers

## SEO & Discoverability

### Meta Tags

- Open Graph for social sharing
- Twitter Cards
- Dynamic descriptions (journal posts)
- Default site image (non-journal pages)

### Sitemap

- Auto-generated via plugin
- Includes all pages and journal posts
- Submitted to search engines

### RSS Feed

- `/feed.xml`
- All journal posts included
- Auto-generated via plugin

### robots.txt

- Allow all crawlers by default
- **Block AI/ML crawlers**:
  - GPTBot (OpenAI)
  - ChatGPT-User
  - CCBot (Common Crawl)
  - anthropic-ai
  - Claude-Web
  - Google-Extended

## Performance

### Build Optimization

- CSS minification (cssnano)
- JavaScript minification (terser)
- Image optimization (Eleventy Image)
- Build caching for faster rebuilds

### Runtime Performance

- Lazy loading images
- Preload: `metadata` for videos
- No client-side JavaScript frameworks
- Minimal JavaScript overall

### Targets (Lighthouse)

- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: 100

## Accessibility

### Baseline Requirements

- **Semantic HTML**: Use proper elements (`<nav>`, `<main>`, `<article>`, etc.)
- **ARIA labels**: On interactive elements where needed
- **Keyboard navigation**:
  - Logical tab order
  - Visible focus indicators
  - Skip to main content link
- **Color contrast**: WCAG AA minimum (4.5:1)
- **Alt text**: All images have descriptive alt attributes
- **Form labels**: Associated with inputs

### Testing

- Manual keyboard testing
- Screen reader spot checks (when possible)
- Automated tools (Lighthouse, axe)

## Security

### Headers

Configure on StaticHost.eu or via Cloudflare Worker:

- Content-Security-Policy (restrict script/style sources)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (disable camera, mic, geolocation)

### CORS

Cloudflare Workers configured for:

- Origin: production domain only
- Methods: POST only
- Headers: Content-Type

### Form Security

- Client-side validation
- Honeypot fields (spam prevention)
- Rate limiting on Worker side (optional)

## Error Handling

### 404 Page

- Custom design matching site style
- Navigation back to home/journal
- Helpful messaging

### Build Failures

- **Notion API down**: Use cached builders data
- **Image processing error**: Log warning, use original
- **Missing frontmatter**: Provide defaults, don't fail build

### User-Facing Errors

- Form submission failures: Clear error messages
- Missing content: Graceful fallbacks

## Deployment Strategy

### Environments

**Development** (Local):

- Command: `npm run dev`
- Hot reload enabled
- No minification
- Full error messages

**Staging**:

- Branch: `staging` or `develop`
- Full build with minification
- Test environment for QA
- Deploy previews for PRs

**Production**:

- Branch: `main`
- Full optimization
- Custom domain (when configured)
- Build caching enabled

### Build Process

1. Install dependencies
2. Fetch Notion data (builders)
3. Process markdown (journal posts)
4. Generate pages
5. Optimize images
6. Minify CSS/JS
7. Generate sitemap/RSS
8. Output to `dist/`

### Caching

- Cache `node_modules/` between builds
- Cache `.cache/` directory (Notion data, image processing)
- Invalidate on package.json or significant data changes

## Rate Limiting & API Usage

### Notion API

- **Rate limit**: ~3 requests per second
- **Usage**: Build-time only (not client-side)
- **Strategy**:
  - Cache responses locally
  - Exponential backoff on failures
  - Use cached data if API unavailable

### Build Performance

- Target: <2 minutes per build
- Parallel image processing
- Incremental builds where possible

## Future Considerations

### Planned Additions

- Custom sans-serif font (replace system fonts)
- Exact color palette values
- Additional journal frontmatter fields (as needed)
- Enhanced video features (quality selection, captions)

### Deferred Features

- Complex performance budgets
- Advanced git hooks/linting
- Server-side analytics (Pirsch API integration)
- Progressive Web App (PWA) features

### Extensibility Points

- Journal frontmatter: Add new fields without breaking old posts
- Components: CSS Modules allow adding new without conflicts
- Data sources: Easy to add new Notion databases
- Build plugins: Eleventy plugin ecosystem

## Questions to Revisit

1. **Exact color values** - Design to provide hex codes
2. **Custom font files** - When ready, upload to Bunny CDN
3. **Video poster generation** - Can we auto-generate from video frames?
4. **Advanced form features** - Captcha if spam becomes an issue?
5. **Analytics depth** - How much tracking do we need beyond pageviews?

This document should be updated as decisions evolve during development.
