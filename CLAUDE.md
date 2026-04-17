# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**rebuild-web** is a production Eleventy static site for Rebuild — a sprint for European social platforms. It uses Nunjucks templates, TailwindCSS, Bunny CDN Edge Scripts for form processing, MailerLite for newsletters, and Notion API for build-time data.

## Development Commands

```bash
npm run dev           # Dev server + CSS watch (runs both concurrently)
npm run build         # Production build (Eleventy + CSS)
npm run build:css     # Build CSS only
npm run build:production  # Build + JS minification
npm run clean         # Remove dist/ and .cache/
npm run format        # Prettier formatting
npm run format:check  # Check formatting without writing
```

CSS is compiled separately by Tailwind CLI (not Eleventy) — output goes to `dist/styles/main.css`.

## Architecture

### Eleventy Config (`eleventy.config.js`)

Custom **collections** available in templates:

- `insights` / `featuredInsights` — from `src/insights/**/*.md`

Custom **filters**: `dateFormat`, `shortDate`, `excerpt(length=150)`, `limit(n)`, `isPast`, `shuffle`, `categoryColors`

Custom **shortcode**: `{% image src, alt, sizes %}` — uses `@11ty/eleventy-img`, outputs responsive WebP/JPEG.

### Site Configuration (`src/_data/site.js`)

Controls site title, URL, `main_navigation` (with subItems and status), and `second_navigation`. **Edit this file to add/remove nav items or update gathering status** (`past`/`current`/`future`).

### Data Sources

| File                        | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| `src/_data/builders.js`     | Fetches Notion database at build time     |
| `src/_data/gatherings.json` | Gathering events with status, dates, CTAs |
| `src/_data/carousel.json`   | Homepage carousel slides                  |
| `src/_data/events.json`     | Events listing                            |
| `src/_data/jobs.json`       | Open positions                            |
| `src/_data/programmes.json` | Programmes listing                        |

### Forms Architecture

Forms are fetched client-side from `/forms/{form-name}.html` and rendered in a sidebar overlay. Trigger with `data-form="[name]"` on any element. Available forms: `newsletter`, `builder-promo`, `builder-application`, `gathering-invitation`, `application-rebuild1`.

Flow: client validation → `src/scripts/form-handler.js` → Bunny Edge Script (`src/scripts/edge-script.js`) → MailerLite or Notion.

When adding a new form:

1. Create `src/forms/{name}.html`
2. Register in `src/scripts/form-triggers.js`
3. Add handler endpoint in `src/scripts/edge-script.js`

### Page Structure

- Pages in `src/pages/` use `permalink` frontmatter to control URL
- Gatherings with sub-pages go in `src/pages/gatherings/` (e.g., `rebuild-2.html` → `/gatherings/rebuild-2/`)
- Homepage lives at `src/index.html` (root, not in `pages/`)

## Key Conventions

### Component Patterns

```njk
{% include "components/foo.njk" %}
{% include "components/foo.njk" with { key: value } %}
{% from "components/image-credit.njk" import imageCredit %}
{{ imageCredit("Photo by Name", "bottom-left") }}
```

### Content Frontmatter

Journal and insight posts (`.md` files) require:

```yaml
---
title: "Title"
date: 2025-01-01
author: "Name"
tags: [Tag1, Tag2]
excerpt: "Brief description"
featured: false
---
```

### Styling

- TailwindCSS utility classes; custom components via `@layer components` in `src/styles/main.css`
- Custom color tokens used: `bg-red-tint`, `bg-blue-tint`, `bg-green-tint`, `bg-orange-tint`, `bg-blonde-tint`, `bg-blush-tint`, `text-dark`

## Git Workflow

- `main` — production (auto-deploys to rebuild.net)
- `staging` — staging (auto-deploys)
- `feature/*` — feature branches

Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`

## Environment Variables

Required for build (see `.env.example`):

- `NOTION_TOKEN`, `NOTION_BUILDERS_DB_ID` — Builders directory
- `BUNNY_*` — CDN/edge script configuration
- `MAILERLITE_*` — Newsletter integration
- `SITE_URL`, `API_URL` — used in `src/_data/site.js`
