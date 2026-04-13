# rebuild-web

Production website for [rebuild.net](https://www.rebuild.net) — a sprint for European social platform.

Built as an Eleventy static site. Content is mostly managed through JSON files in the repo, with one Notion-sourced data set (the Platforms directory). Forms are handled by serverless edge functions on Bunny CDN and captured in Notion. A high-level migration from mostly American to European services 

---

## Tech Stack

| Layer | Technology | Notes |
| --- | --- | --- |
| **Static site generator** | [Eleventy (11ty)](https://www.11ty.dev/) | v2.x |
| **Templates** | Nunjucks | Component-based includes and macros |
| **Styling** | TailwindCSS + PostCSS | Utility-first, no custom CSS framework |
| **Hosting** | Vercel | Auto-deploys from git |
| **CDN** | Bunny CDN | Assets, fonts, videos, and edge script execution |
| **Form processing** | Bunny Edge Scripts | Serverless JS at the CDN edge |
| **Newsletter** | MailerLite | API v2, subscriber management |
| **Builders directory** | Notion API | Fetched at build time |
| **Analytics** | Pirsch | Privacy-first, EU-based, GDPR-compliant |

### Rationale

This stack was chosen for simplicity, performance, and low operational overhead:

- **Eleventy** generates fast, dependency-light HTML. No React, no hydration, no bundle splitting.
- **Nunjucks** provides enough component composition (includes, macros, template inheritance) without a JavaScript component model.
- **TailwindCSS** keeps styling co-located with markup and avoids growing a custom CSS codebase.
- **Bunny CDN + Edge Scripts** offloads form processing without needing a dedicated backend. The same CDN layer serves assets and runs backend logic.
- **Notion as CMS** for the Platforms directory means non-technical editors can manage entries without touching the repo. Other content (carousel, jobs, events, gatherings) lives in JSON files directly in the repo — simpler to version and edit.
- **Independance** from US-owned frameworks and services like React and  has been a prioritity  

### Limitations

- **Build-time data**: Notion data is fetched at build time, not on request. Changes in Notion require a site rebuild to appear. A cache fallback exists, but stale data is possible if the Notion API is unavailable.
- **No incremental builds**: Every content change triggers a full rebuild. Acceptable at current scale but will slow down as content grows.
- **Edge Script constraints**: Bunny Edge Scripts run a limited JavaScript environment (no Node.js APIs, no npm packages). Complex backend logic requires workarounds.
- **Form deduplication**: Currently handled by a 5-second in-memory window in the edge script. Not durable across edge node restarts.
- **MailerLite API v2**: The current integration targets the v2 API. Migration to v3 would require changes to `src/scripts/edge-script.js`.

---

## Project Structure

```text
/
├── .eleventy.js              # Eleventy config (input/output, plugins, filters)
├── postcss.config.js
├── tailwind.config.js
├── package.json
└── src/
    ├── index.html            # Homepage
    ├── _data/                # Data files available to all templates
    │   ├── site.js           # Global site config (name, URL, social links)
    │   ├── carousel.json     # Homepage carousel slides
    │   ├── events.json       # Gathering events (dates, locations, proof points)
    │   ├── gatherings.json   # Gathering summary cards (timeline view)
    │   ├── jobs.json         # Job listings
    │   ├── programmes.json   # Programme definitions (investor, talent, etc.)
    │   ├── splashImages.js   # Rotating splash images (computed)
    │   └── builders.js       # Notion fetch (Builders directory, build-time)
    ├── _includes/
    │   ├── layouts/          # Page-level layout templates
    │   └── components/       # Reusable Nunjucks components
    │       └── forms/        # Form components
    ├── pages/                # Site pages (use permalink in frontmatter)
    ├── journal/              # Markdown journal posts
    ├── insights/             # Markdown insight posts
    ├── forms/                # Form HTML endpoints (fetched by sidebar)
    ├── scripts/              # Client-side JS + edge script source
    ├── styles/               # TailwindCSS source (main.css)
    └── public/               # Static assets (images, fonts, favicons)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone <repository-url>
cd rebuild-web
npm install
cp .env.example .env
# fill in .env values — see Environment Variables section
```

### Development

```bash
npm run dev        # Start dev server with hot reload → http://localhost:8080
npm run build      # Production build → dist/
npm run clean      # Clear .cache/ and dist/
npm run build:css  # Rebuild CSS only
```

---

## Content Reference

All site content is either in Markdown files, JSON files in `src/_data/`, or in Notion. Below is the map.

### Carousel (`src/_data/carousel.json`)

The homepage carousel. Edit the JSON file directly. Each slide:

```json
{
  "id": "slide-1",
  "headline": "Slide headline",
  "subheader": "Supporting text",
  "image": "/assets/images/photo.jpg",
  "ctaText": "Button label",
  "ctaLink": "/link/",
  "bgColor": "#dde2de"
}
```

Include in a template with:

```njk
{% include "components/carousel.njk" %}
```

Features: auto-rotation (5s), pause on hover, keyboard/swipe navigation, ARIA labels.

### Jobs (`src/_data/jobs.json`)

Open positions displayed on the site. HTML content is supported in the `content` field. Toggle visibility with `"active": true/false`.

```json
{
  "jobs": [
    {
      "id": "unique-id",
      "title": "Role title",
      "content": "<p>HTML description...</p>",
      "active": true
    }
  ]
}
```

### Events (`src/_data/events.json`)

The three Rebuild gatherings with full detail: dates, location, proof points, and a CTA. Used on the journey/gatherings page. Each event can link to a sidebar form via `"dataForm": "gathering-invitation"`.

### Gatherings (`src/_data/gatherings.json`)

Summary card data for the timeline view of gatherings (title, location, dates, image). Simpler than `events.json` — used for the compact overview component.

### Programmes (`src/_data/programmes.json`)

The four programme types (investor, talent, public funds, board). Each has a title, description, and brand colour.

### Builders Directory (`src/_data/builders.js`)

Fetched from a Notion database at build time. Editors manage entries directly in Notion; setting **PUBLISHED? === ✔️** makes an entry appear on site. A local cache at `.cache/builders.json` is used as fallback if the Notion API is unavailable.

Notion properties used: "Name", "DESCRIPTION", "COUNTRY", "CATEGORY", "WEBSITE".(case sensitive always).

### Insights Posts (`src/insights/`)

Markdown files with frontmatter:

```yaml
---
title: "The future you want for your social network will be true"
date: 2025-12-22
author: "Matt Muir"
tags:
  - Stories
excerpt: "Daniela Hinrichs on building XING from invitation-only startup to the world's first Web 2.0 IPO – why community, not just code, made Europe's business network a success"
featured_image: "/assets/images/daniela-3.jpg"
featured_image_credit: "Michael DeBoer"
featured_image_credit_theme: "dark"
published: true
---
```

## Forms System

Forms are displayed in a responsive sidebar overlay. On desktop (≥768px) the form slides in from the right and the page content shifts. On mobile it opens as a full-screen modal.

### Triggering a Form

Any element with a `data-form` attribute opens the sidebar:

```html
<button data-form="newsletter">Subscribe</button>
<button data-form="builder-promo">Nominate a Builder</button>
<button data-form="builder-application">Apply to Directory</button>
<button data-form="gathering-invitation">Request Invitation</button>
```

JavaScript API: `window.loadForm('form-name')`, `window.closeFormSidebar()`

### Adding a New Form

1. Create the form component: `src/_includes/components/forms/your-form.njk`
2. Create the HTML endpoint: `src/forms/your-form.html` (fetched dynamically)
3. Register in `src/scripts/form-triggers.js`:

   ```js
   const formUrls = {
     "your-form": "/forms/your-form.html",
     // ...existing entries
   };
   ```

4. Add backend handling to `src/scripts/edge-script.js` for the new endpoint
5. Use the trigger: `<button data-form="your-form">...</button>`

### Form Processing Flow

```text
Browser → Bunny Edge Script → MailerLite (newsletters)
                            → Notion (applications, suggestions, invitations)
```

The edge script (`src/scripts/edge-script.js`) is a single combined handler deployed to Bunny CDN. It:

- Intercepts requests to `/api/*` paths only (non-API paths pass through)
- Routes by endpoint to MailerLite or Notion
- Runs a 5-second deduplication window
- Maps the `interest` form field to a MailerLite custom field
- Handles CORS preflight

---

## Architecture

### Component System

Nunjucks templates in `src/_includes/components/`. Use standard Nunjucks includes and macros:

```njk
{% include "components/carousel.njk" %}

{% from "components/image-credit.njk" import imageCredit %}
{{ imageCredit("Photo by Name", position="bottom-right") }}
```

### Data Flow

```text
Build time:
  Notion API → builders.js → builders data → Nunjucks templates → HTML

  JSON files → Nunjucks templates → HTML
    ↑
    Direct edits in repo (carousel, events, gatherings, jobs, programmes)

Runtime:
  Form submit → Bunny Edge Script → MailerLite / Notion
```

### SEO

Every page includes title, meta description, Open Graph, and Twitter Card tags. The site generates `/sitemap.xml`, `/feed.xml`, and `robots.txt`.

---

## Deployment

Deploys automatically via **Vercel**:

- Push to `main` → production deploy
- Push to `staging` → staging deploy

Build settings: command `npm run build`, output directory `dist`, Node 18.x or 20.x.

### Bunny Edge Scripts

The form backend is a single script deployed separately to Bunny CDN — it is **not** part of the static build output.

1. Log into Bunny CDN Dashboard → Pull Zones → Edge Scripts
2. Create a new Edge Script as **Middleware**
3. Paste contents of `src/scripts/edge-script.js`
4. Set environment variables (see below)
5. Enable the script

---

## Environment Variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NOTION_TOKEN` | Build, Edge Script | Notion API auth |
| `NOTION_BUILDERS_DB_ID` | Build | Builders Notion database |
| `MAILERLITE_API_KEY` | Edge Script | Newsletter signup |
| `MAILERLITE_GROUP_ID` | Edge Script | Default Group ID |
| `BUNNY_STORAGE_ZONE` | Build | CDN asset references |
| `BUNNY_API_KEY` | Build | CDN access |
| `BUNNY_PULL_ZONE_URL` | Build | Video CDN URL |
| `BUNNY_FONTS_PULL_ZONE_URL` | Build | Font CDN URL |
| `PIRSCH_CLIENT_ID` | Build | Analytics |
| `PIRSCH_CLIENT_SECRET` | Build | Analytics |

See `.env.example` for the full list. Build-time variables go in the Vercel dashboard; edge script variables go in Bunny CDN dashboard.

---

## US → EU Migration

> This section tracks the migration of third-party services from US-based providers to EU-based alternatives, primarily for GDPR compliance, data sovereignty, and alignment with Rebuild's mission.

### Current Service Map

| Service | Current provider | Status |
| --- | --- | --- |
| Static hosting | Vercel (US) | Exploring hosting on Hetzner with Coolify |
| CDN + Edge Scripts | Bunny CDN (EU-founded, global PoPs) | Acceptable |
| Analytics | Pirsch (Germany) | Already EU |
| Newsletter | MailerLite (Lithuania) | Already EU |
| Notion (Builders CMS) | Notion (US) | To migrate |
| DNS / domain | Cloudflare handling, domain purchased on GoDaddy | Exploring Bunny CDN |

### Migration Notes

_To be filled in as decisions are made._

- **Notion → EU alternative**: The Platforms directory is the only Notion-sourced dataset. Candidates for replacement: a self-hosted CMS, a EU-hosted headless CMS (e.g. Directus on a EU VPS), or a simple JSON/Markdown workflow. The migration surface is small — only `src/_data/builders.js` needs updating.

---

## Troubleshooting

### Build fails

- Clear cache and retry: `npm run clean && npm run build`
- Check for Nunjucks syntax errors or invalid JSON in `src/_data/`
- Verify Notion API token and database ID are set

### Forms not working

- Open browser DevTools → Network tab and check the request/response to the edge script endpoint
- Check Bunny CDN dashboard → Edge Script logs
- Verify CORS headers in the edge script allow your domain
- Confirm environment variables are set in the Bunny dashboard

### Carousel not appearing

- Verify `src/_data/carousel.json` is valid JSON with at least one slide
- Check image paths exist under `src/public/assets/images/`

### Builders not showing

- Check the `.cache/builders.json` file for cached data
- Verify `NOTION_TOKEN` and `NOTION_BUILDERS_DB_ID` are correct
- Ensure the Notion integration has access to the database
- Entries must have **PUBLISHED? === ✔️**

### TailwindCSS classes not applying

- Rebuild CSS: `npm run build:css`
- Check `tailwind.config.js` content paths include your template files
- Clear browser cache

---

## Reference

- [CLAUDE.md](CLAUDE.md) — AI assistant instructions for this project
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) — Pre-deploy checklist

## License

ISC
