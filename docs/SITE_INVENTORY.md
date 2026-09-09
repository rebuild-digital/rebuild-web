# Site Inventory — rebuild.net (Eleventy)

Generated 2026-09-09. Read-only audit of the current Eleventy source.

---

## 0. Stale docs to remove

### Root `.md` files

| File | Verdict |
| --- | --- |
| `README.md` | **Keep** |
| `AGENTS.md` | **Keep** |
| `CLAUDE.md` | **Keep** |
| `PHASE_1_BRIEF.md` | **Keep** |
| `REBUILD_PLATFORM_TRANSITION_PLAN.md` | **Keep** |
| `STATUS.md` | **Keep** |
| `TASK_0c_SITE_INVENTORY.md` | **Keep** (task file, remove after execution) |
| `SOLIDSTART_MIGRATION_PLAN.md` | **Remove** — superseded migration plan |
| `INCLUDES_USAGE.md` | **Remove** — documents include-sharing for the letter sub-site; stale planning doc |

### `docs/archive/` (all stale — remove entire directory)

| File | Notes |
| --- | --- |
| `docs/archive/DESIGN_DECISIONS.md` | Old stack decisions |
| `docs/archive/ENVIRONMENT_CONFIG.md` | Old env docs |
| `docs/archive/NOTION_REBUILD1_SETUP.md` | Old Notion setup |
| `docs/archive/PRODUCTION_CHECKLIST.md` | Old deploy checklist |
| `docs/archive/QUICK_REFERENCE.md` | Old quick ref |
| `docs/archive/README.md` | Archive readme |
| `docs/archive/SETUP_CHECKLIST.md` | Old setup checklist |
| `docs/archive/STACK_ARCHITECTURE.md` | Old architecture doc |

---

## 1. Pages & routes

### Static pages (19 pages)

| Source file | Output URL | Title | Layout |
| --- | --- | --- | --- |
| `src/index.html` | `/` | Rebuild | `layouts/default.njk` |
| `src/pages/about.html` | `/about/` | About | `layouts/base.njk` |
| `src/pages/apply.html` | `/apply/` | Join the directory | `layouts/base.njk` |
| `src/pages/data.html` | `/data/` | Data | `layouts/base.njk` |
| `src/pages/directory.html` | `/directory/` | Directory | `layouts/base.njk` |
| `src/pages/gathering-request.html` | `/gathering-request/` | Request an invitation to Rebuild 3 | `layouts/base.njk` |
| `src/pages/gatherings.html` | `/gatherings/` | Gatherings | `layouts/default.njk` |
| `src/pages/gatherings/rebuild-2.html` | `/gatherings/rebuild-2/` | Rebuild 2 | `layouts/default.njk` |
| `src/pages/gatherings/rebuild-3.html` | `/gatherings/rebuild-3/` | Rebuild 3 | `layouts/default.njk` |
| `src/pages/get-in-touch.html` | `/get-in-touch/` | Get in touch | `layouts/default.njk` |
| `src/pages/insights.html` | `/insights/` | Insights | `layouts/insights.njk` |
| `src/pages/journey.html` | `/journey/` | Journey | `layouts/default.njk` |
| `src/pages/newsletter.html` | `/newsletter/` | Stay updated | `layouts/base.njk` |
| `src/pages/open-positions.html` | `/open-positions/` | Open positions | `layouts/base.njk` |
| `src/pages/people.html` | `/people/` | People | `layouts/default.njk` |
| `src/pages/privacy.html` | `/privacy/` | Privacy and Cookie Policy | `layouts/base.njk` |
| `src/pages/rebuild1-application.html` | `/rebuild1-application/` | Request an invitation to the first gathering | `layouts/base.njk` |
| `src/pages/suggest.html` | `/suggest/` | Suggest a platform | `layouts/base.njk` |
| `src/pages/tools.html` | `/tools/` | Tools | `layouts/default.njk` |
| `src/changelog.md` | `/changelog/` | Changelog | `layouts/base.njk` |

### Collection pages — insights (15 posts)

URL pattern: `/insights/<slug>/` (Eleventy default, layout set via `src/insights/insights.json` → `layouts/insight-post.njk`).

| Slug | Title |
| --- | --- |
| `a-word-from-margrethe` | Margrethe Vestager on Rebuild |
| `andre-ribeirinho` | André Ribeirinho: Offline is where online gets real |
| `christian-lindholm` | Christian Lindholm: Without plumbing, there'd be no civilisation |
| `collaboration` | Build connections |
| `cooperative-ownership` | What if everyone was a shareholder? |
| `daniela-hinrichs` | The future you want for your social network will be true |
| `dating-platorms` | Love at Rebuild |
| `felix-petersen` | Building home-cooked social |
| `irl-platforms` | Log off and socialise |
| `katharina-birkenbach` | Make the internet fun again |
| `linda-liukas` | Public space computing |
| `social-design-framework` | An introduction to the social design framework |
| `social-travel` | Travel socially |
| `thomas-madsen-mygdal` | An invitation to participate from Thomas Madsen-Mygdal |
| `ville-muitarri` | Belaying the community |

> **Note:** The slug `dating-platorms` is a typo (missing "f" in "platforms"). The generated URL will be `/insights/dating-platorms/`.

### Form partial pages (6 pages, `layout: false`)

These are loaded via `fetch()` into the form sidebar — not full pages.

| Source | Output URL |
| --- | --- |
| `src/forms/newsletter.html` | `/forms/newsletter.html` |
| `src/forms/builder-application.html` | `/forms/builder-application.html` |
| `src/forms/builder-promo.html` | `/forms/builder-promo.html` |
| `src/forms/gathering-invitation.html` | `/forms/gathering-invitation.html` |
| `src/forms/gathering-invitation-rebuild3.html` | `/forms/gathering-invitation-rebuild3.html` |
| `src/forms/application-rebuild1.html` | `/forms/application-rebuild1.html` |

### Generated files

| File | Output URL |
| --- | --- |
| `src/sitemap.njk` | `/sitemap.xml` |

**Total page count: 20 static + 15 insight posts + 6 form partials + 1 sitemap = 42 generated files.**

---

## 2. Components (Nunjucks includes/macros)

### `src/_includes/components/`

| File | Lines | Description | Used in |
| --- | --- | --- | --- |
| `banner.njk` | 19 | Fixed bottom banner (currently commented out in base layout) | `base.njk` (disabled) |
| `builder-row.njk` | 60 | Single directory entry row with category tags | `directory.html` |
| `card.njk` | 34 | Insight article card for grid listings | `insights.html` |
| `carousel.njk` | 63 | Homepage hero carousel with slide dots and navigation | `index.html`, `base.njk` (script) |
| `directory-preview.njk` | 83 | Homepage directory preview section with featured builders | `index.html` |
| `engage.njk` | 111 | CTA section with newsletter signup and form triggers | `index.html`, `gatherings.html`, `rebuild-2.html` |
| `faq-accordion.njk` | 45 | Expandable FAQ section | `rebuild-2.html` |
| `footer.njk` | 139 | Site footer with nav, newsletter inline form, and social links | `base.njk` |
| `form-sidebar.njk` | 154 | Slide-in sidebar/modal that dynamically loads form HTML | `base.njk` |
| `form.njk` | 243 | Generic form renderer (renders fields from config passed via Nunjucks `set`) | All form njk components |
| `framework-section.njk` | 85 | Social design framework visual section | `journey.html` (imported but may not be used directly) |
| `gathering-section.njk` | 77 | Macro rendering a gathering event section | `journey.html` |
| `gatherings-preview.njk` | 70 | Gatherings overview cards for homepage and gatherings index | `index.html`, `gatherings.html` |
| `half-circle.njk` | 28 | Decorative half-circle SVG divider | `index.html`, `journey.html` |
| `header.njk` | 197 | Site header/nav with mobile menu, dropdowns | `base.njk` |
| `image-carousel.njk` | 77 | Image slideshow (about page, gatherings) | `about.html`, `gatherings.html` |
| `image-credit.njk` | 21 | Photo credit overlay macro | `insight-post.njk`, `rebuild-2.html`, `rebuild-3.html` |
| `insights-preview.njk` | 37 | Featured insights cards for homepage | `index.html` |
| `jobs.njk` | 24 | Job listings macro | `open-positions.html` |
| `outcomes.njk` | 26 | Outcomes/metrics section macro | `index.html`, `journey.html` |
| `page-header.njk` | 8 | Simple page header with title and description | `insights.njk` layout, `get-in-touch.html`, `tools.html` |
| `person-card.njk` | 26 | Person/team member card macro | `people.html` |
| `programmes-preview.njk` | 47 | Programmes display with staggered animation | `index.html`, `journey.html` |
| `quote-carousel.njk` | 130 | Testimonial/quote slideshow | `rebuild-2.html`, `rebuild-3.html` |
| `splash-alt.njk` | 93 | Homepage hero with rotating background images | `index.html` |
| `text-section.njk` | 2 | Simple text block macro | `index.html`, `journey.html` |
| `tool-card.njk` | 76 | Tool card with description, link, and image | `tools.html` |

### `src/_includes/components/forms/`

| File | Description | Used in |
| --- | --- | --- |
| `builder-application-form.njk` | Builder directory application form config | `apply.html`, `forms/builder-application.html` |
| `builder-promo-form.njk` | Suggest-a-platform form config | `suggest.html`, `forms/builder-promo.html` |
| `gathering-invitation-form.njk` | Rebuild 2 invitation request form | `forms/gathering-invitation.html` |
| `gathering-invitation-rebuild3-form.njk` | Rebuild 3 invitation request form | `gathering-request.html`, `forms/gathering-invitation-rebuild3.html` |
| `newsletter-form.njk` | Newsletter signup (standard + inline variant) | `newsletter.html`, `forms/newsletter.html`, `engage.njk` |
| `simple-registration-form.njk` | Rebuild 1 event registration form | `rebuild1-application.html`, `forms/application-rebuild1.html` |

### `src/_includes/partials/`

| File | Lines | Description |
| --- | --- | --- |
| `signal-field.njk` | 13 | Canvas-based dot-matrix animation partial | `data.html` |

---

## 3. Layouts

All layouts live in `src/_includes/layouts/`.

| Layout | Extends | Purpose |
| --- | --- | --- |
| `base.njk` | — (root) | HTML document skeleton: `<head>`, meta, OG tags, Pirsch analytics, font preload, header, footer, form sidebar, global scripts |
| `default.njk` | `base.njk` | Pass-through wrapper — adds nothing, just inherits base |
| `home.njk` | `base.njk` | Home layout (identical to default; appears unused — homepage uses `default.njk`) |
| `event.njk` | `base.njk` | Event page with article wrapper and header (not currently used by any page) |
| `insight-post.njk` | `base.njk` | Individual insight article: featured image, credit, title, date, author, tags, rich-text body |
| `insights.njk` | `base.njk` | Insights listing page — page header + content |

### Inheritance chain

```
base.njk
├── default.njk
├── home.njk       (unused)
├── event.njk      (unused)
├── insight-post.njk
└── insights.njk
```

---

## 4. Client-side scripts

| File | Lines | Description | Loaded in |
| --- | --- | --- | --- |
| `animate-numbers.js` | 55 | IntersectionObserver-based number counter animation | `data.html` (`<script>`) |
| `carousel.js` | 221 | Homepage carousel: slide navigation, dots, auto-rotate, swipe | `base.njk` (all pages) |
| `category-colors.js` | 63 | Maps platform categories to consistent colour pairs | `directory.html` (`<script>`), also imported by `.eleventy.js` as a filter |
| `countdown.js` | 46 | Generic countdown timer for `[data-target-date]` elements | Not loaded anywhere (dead code — see Discrepancies) |
| `directory-filter.js` | 264 | Multi-select category filter for the directory page | `directory.html` (`<script>`) |
| `edge-script.js` | 935 | Bunny Edge Script: server-side form handler + Notion/MailerLite sync (not loaded client-side) | Deployed to Bunny CDN separately |
| `form-handler.js` | 115 | AJAX form submission with validation and feedback | `base.njk` (all pages) |
| `form-triggers.js` | 61 | Maps `data-form` attributes to sidebar form loading | `base.njk` (all pages) |
| `gathering-countdown.js` | 69 | Countdown timer for gathering event dates | `journey.html`, `rebuild-2.html`, `rebuild-3.html` |
| `header-scroll.js` | 40 | Transparent-to-solid header transition on scroll | `base.njk` (homepage only) |
| `insights-filter.js` | 91 | Tag filter and sort controls for insights listing | `insights.html` |
| `masonry.js` | 59 | CSS-less masonry layout for insights card grid | `insights.html` |
| `mobile-menu.js` | 101 | Hamburger menu toggle, accessibility, body-scroll lock | `base.njk` (all pages) |
| `programmes-animation.js` | 43 | Staggered fade-in for programme items on scroll | `programmes-preview.njk` (homepage, journey) |
| `signal-field.js` | 194 | Canvas matrix-style dot animation for data page hero | `data.html` (`defer`) |
| `splash-rotation.js` | 178 | Rotating background images for homepage splash | `base.njk` (homepage only) |

---

## 5. Data sources

### `src/_data/` files

| File | Type | Provides | Cache/Fallback |
| --- | --- | --- | --- |
| `builders.js` | JS with fetch (Notion API) | Directory of European social platforms; filtered to `PUBLISHED? = true`. Returns: id, name, description, imageUrl, link, tags, category, stage, country, yearFounded, published, order. Shuffled randomly each build. | Yes — `.cache/builders.json`. Falls back to cache if Notion creds missing or API fails; returns `[]` if no cache. |
| `carousel.json` | JSON | Homepage carousel slide data (5 slides): headline, subheader, image, CTA text/link, bg colour | No (static) |
| `espea.js` | JS with fetch (Google Apps Script) | European social platform economy stats: revenue, europeanShare, jobs, metaShare | Yes — `.cache/espea.json`. Falls back to cache, then hardcoded `FALLBACK` object. |
| `events.json` | JSON | Event details for Rebuild 1, 2, 3: dates, locations, proof points, schedules, speakers | No (static) |
| `gatherings.json` | JSON | Gathering cards for preview sections: id, slug, title, status, location, dates, image | No (static) |
| `jobs.json` | JSON | Open positions listing (currently 1 active job) | No (static) |
| `programmes.json` | JSON | Programme categories: investor, talent, public funds, media, accelerator (5 items) | No (static) |
| `site.js` | JS computed | Global site config: title, description, url, apiUrl, defaultImage, logo, language, navigation, newsletter success message | No — uses `process.env.SITE_URL` and `process.env.API_URL` |
| `splashImages.js` | JS computed | Array of splash images for homepage rotation (11 entries, some duplicates) | No (static) |

### Content collections

**`src/insights/` — 15 Markdown files**

Directory-level data file: `insights.json` sets `layout: layouts/insight-post.njk`.

Frontmatter fields (all 16 files share the same set):

| Field | Required | Example |
| --- | --- | --- |
| `title` | Yes | `"Love at Rebuild"` |
| `date` | Yes | `2026-06-30` |
| `author` | Yes | `"Sophia Epstein"` |
| `tags` | Yes | `["Stories"]` or `["Interviews"]` |
| `excerpt` | Yes | One-sentence summary |
| `featured_image` | Yes | `/assets/images/...` path |
| `published` | Yes | `true` (all are `true`) |
| `featured_image_credit` | Rare | Only on `a-word-from-margrethe.md` |
| `featured_image_credit_theme` | Rare | Only on `a-word-from-margrethe.md` |

> No `featured: true` field found on any insight — the `featuredInsights` collection (defined in `.eleventy.js`) will always be empty.

**`src/journal/` — Does not exist.** No journal directory or collection despite being mentioned in the task brief.

---

## 6. Forms

### Summary: 6 forms, all using the same architecture

All forms submit via AJAX (`form-handler.js`) to the Bunny Edge Script (`edge-script.js`), which routes to Notion and/or MailerLite.

| # | Form name (`data-form`) | Page(s) | Submit endpoint | Backend(s) | Fields |
| --- | --- | --- | --- | --- | --- |
| 1 | `newsletter` | `/newsletter/`, footer (inline), engage component, sidebar | `{API_URL}/api/newsletter-signup` | MailerLite | email, first_name, last_name, interest (select), consent |
| 2 | `builder-application` | `/apply/`, sidebar | `{API_URL}/api/builder-application` | Notion | builder_name, email, phone, website, category, location, description, impact, stage, team_size, consent, newsletter |
| 3 | `builder-promo` | `/suggest/`, sidebar | `{API_URL}/api/builder-promotion` | Notion | builder_name, builder_website, why_promote, your_name, your_email, your_relationship, newsletter_signup |
| 4 | `gathering-invitation` | sidebar only | `{API_URL}/api/gathering-invitation` | Notion | name, email, phone, platform_link, country, group, contribution, consent, newsletter + hidden: form_type, gathering ("Rebuild 2") |
| 5 | `gathering-invitation-rebuild3` | `/gathering-request/`, sidebar | `{API_URL}/api/gathering-invitation` | Notion | name, email, phone, platform_link, country, group, contribution, consent, newsletter + hidden: form_type, gathering ("Rebuild 3") |
| 6 | `application-rebuild1` | `/rebuild1-application/`, sidebar | `{API_URL}/api/application-rebuild1` | Notion + MailerLite | name, email, organisation, role, country, newsletter + hidden: form_type |

### Form submission flow

1. User clicks `<button data-form="...">` → `form-triggers.js` fetches `/forms/<name>.html` → injects into `form-sidebar.njk` slide-in panel
2. Or: form rendered inline on a dedicated page (e.g. `/apply/`)
3. `form-handler.js` intercepts submit → AJAX `POST` to `{API_URL}/api/<endpoint>`
4. Bunny Edge Script (`edge-script.js`) receives request → writes to Notion DB and/or subscribes to MailerLite group

### Edge Script API routes (6 + 1 webhook)

| Route | Handler | Backends |
| --- | --- | --- |
| `/api/newsletter-signup` | `handleNewsletterSubmission` | MailerLite (group: `MAILERLITE_GROUP_ID`) |
| `/api/builder-application` | `handleFormSubmission` | Notion (`NOTION_BUILDERS_DB_ID`) |
| `/api/builder-promotion` | `handleFormSubmission` | Notion (`NOTION_BUILDERS_DB_ID`) |
| `/api/gathering-invitation` | `handleFormSubmission` | Notion (`NOTION_GATHERING_DB_ID`) |
| `/api/application-rebuild1` | `handleFormSubmission` | Notion (`NOTION_REBUILD1_DB_ID`) + MailerLite (`MAILERLITE_REBUILD1_GROUP_ID`) |
| `/api/notion-mailerlite-sync` | `handleNotionMailerliteSync` | Notion webhook → MailerLite (`MAILERLITE_NOTION_SYNC_GROUP_ID`) |

### Footer newsletter — hardcoded URL

The footer's inline newsletter form has a **hardcoded** action URL: `https://rebuild-production.b-cdn.net/api/newsletter-signup`, bypassing `site.apiUrl`. This is a discrepancy (see §11).

---

## 7. Static assets

### `src/public/` contents

| Category | Count | Notes |
| --- | --- | --- |
| Images (jpg/jpeg/png/JPG) | 93 | Site photos, splash images, social/OG images, SVGs, missing-image placeholders |
| Videos (mp4/mov) | 5 | `loop1.mp4`, `loop2.mp4`, `loop3.mp4`, `circles.mov`, `circles3.mov` |
| Fonts | 1 | `ABCSocialMono-Book.woff2` |
| Downloads (PDF/zip) | 5 | `Briefing1.pdf`, `Programme_v0.pdf`, `Programme_v09.pdf`, `Programme_v011.pdf`, `rebuild-press-kit-dec25.zip` |
| SVGs | 2 | `new-logo.svg`, logo |
| Favicon | 1 | `favicon.ico` |
| `robots.txt` | 1 | Static file |

### Bunny CDN references in templates

The only hardcoded Bunny CDN URL in templates is in `footer.njk`:
```
https://rebuild-production.b-cdn.net/api/newsletter-signup
```

All other API calls use `site.apiUrl` (from `process.env.API_URL`).

### External resources loaded

- **Pirsch analytics**: `https://api.pirsch.io/pa.js` (hardcoded in `base.njk`, data-code `7MINshjhivqQWUXqrMyKqKbUBcHP3LAB`)
- **Google Apps Script**: ESPEA data endpoint (hardcoded in `espea.js`)

---

## 8. Build config & plugins

### `.eleventy.js`

**Plugins:**
| Plugin | Purpose |
| --- | --- |
| `@11ty/eleventy-plugin-syntaxhighlight` | Code syntax highlighting in Markdown |
| `@11ty/eleventy-plugin-rss` | RSS feed generation (provides filters but no feed template exists — see Discrepancies) |

**Collections:**
| Name | Source | Filter |
| --- | --- | --- |
| `insights` | `src/insights/**/*.md` | `date <= now`, sorted newest first |
| `featuredInsights` | `src/insights/**/*.md` | `featured === true && date <= now` (currently empty — no posts have `featured: true`) |

**Filters:**
| Name | Purpose |
| --- | --- |
| `dateFormat` | Formats date as "Month Day, Year" (en-US) |
| `isoDate` | Returns `YYYY-MM-DD` |
| `shortDate` | Returns "Mon DD" |
| `excerpt` | Strips HTML, truncates to 150 chars |
| `limit` | Array slice |
| `isPast` | Returns true if date is before now |
| `shuffle` | Fisher-Yates random shuffle |
| `categoryColors` | Maps categories to colour pairs (from `category-colors.js`) |

**Shortcodes:**
| Name | Purpose |
| --- | --- |
| `image` | Responsive image generation via `@11ty/eleventy-img` (webp + jpeg, 300/600/1200px widths) |

**Pass-through copies:**
| Source | Destination |
| --- | --- |
| `src/scripts` | `/scripts/` |
| `src/public` | `/` (root) |

**Directories:**
| Setting | Value |
| --- | --- |
| Input | `src` |
| Output | `dist` |
| Includes | `_includes` |
| Data | `_data` |
| Markdown engine | Nunjucks |
| HTML engine | Nunjucks |

**Watch targets:** `src/scripts/`

**Ignores:** `src/public/assets/images/README.md`

### CSS build

CSS is built separately via Tailwind CLI (not through Eleventy):
- Input: `src/styles/main.css`
- Output: `dist/styles/main.css`
- Dev: `tailwindcss --watch`
- Prod: `tailwindcss --minify`

---

## 9. SEO artifacts

| Artifact | Exists | Path | How generated |
| --- | --- | --- | --- |
| `sitemap.xml` | Yes | `/sitemap.xml` | Custom Nunjucks template (`src/sitemap.njk`) — iterates `collections.all`, excludes `eleventyExcludeFromCollections` |
| RSS/Atom feed | **No** | — | The `@11ty/eleventy-plugin-rss` is installed and loaded, but **no feed template exists** (no `feed.njk`, `feed.xml`, `rss.xml`, or `atom.xml` anywhere in `src/`). The plugin only provides Nunjucks filters (`dateToRfc3339`, etc.) — it does not auto-generate a feed. **No RSS feed is generated.** |
| `robots.txt` | Yes | `/robots.txt` | Static file at `src/public/robots.txt`. Blocks GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web, Google-Extended. **Bug: sitemap URL is `https://yoursite.com/sitemap.xml`** (placeholder, not `rebuild.net`). |
| OG/social meta | Yes | In `<head>` | `base.njk` handles: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. Uses `site.url` + page data. |

---

## 10. Environment variables

### Found by grepping the codebase

| Variable | File(s) | Line(s) | Purpose | Build/Runtime | Documented |
| --- | --- | --- | --- | --- | --- |
| `NOTION_TOKEN` | `src/_data/builders.js` | 10, 24 | Notion API auth token for directory data | Build-time | **Undocumented** — no `.env.example` exists |
| `NOTION_BUILDERS_DB_ID` | `src/_data/builders.js` | 10, 30 | Notion database ID for builders/platforms directory | Build-time | **Undocumented** |
| `SITE_URL` | `src/_data/site.js` | 4 | Canonical site URL (e.g. `https://www.rebuild.net`) | Build-time | **Undocumented** |
| `API_URL` | `src/_data/site.js` | 5 | Bunny Edge Script base URL for form submissions | Build-time | **Undocumented** |

### Edge Script environment (Bunny-hosted, not in repo `.env`)

These are `Deno.env.get()` calls inside `edge-script.js` — they run on Bunny's edge, not during the Eleventy build:

| Variable | Line(s) | Purpose |
| --- | --- | --- |
| `NOTION_TOKEN` | (used via builders handling) | Notion API auth for form submissions |
| `NOTION_BUILDERS_DB_ID` | 553 | Notion DB for builder applications/promotions |
| `NOTION_GATHERING_DB_ID` | 550 | Notion DB for gathering invitations |
| `NOTION_REBUILD1_DB_ID` | 547 | Notion DB for Rebuild 1 registrations |
| `MAILERLITE_API_KEY` | 790 | MailerLite API authentication |
| `MAILERLITE_GROUP_ID` | 791 | MailerLite group for general newsletter |
| `MAILERLITE_REBUILD1_GROUP_ID` | 322 | MailerLite group for Rebuild 1 registrations |
| `MAILERLITE_NOTION_SYNC_GROUP_ID` | 192 | MailerLite group for Notion-synced subscribers |
| `NOTION_WEBHOOK_SECRET` | 133 | Secret for validating Notion automation webhooks |

### Hardcoded service URLs (implicit config)

| Service | URL | Found in |
| --- | --- | --- |
| Pirsch analytics | `https://api.pirsch.io/pa.js` (code: `7MINshjhivqQWUXqrMyKqKbUBcHP3LAB`) | `base.njk:56` |
| ESPEA Google Apps Script | `https://script.google.com/macros/s/AKfycbz.../exec` | `espea.js:6` |
| Bunny CDN (hardcoded) | `https://rebuild-production.b-cdn.net/api/newsletter-signup` | `footer.njk:20` |
| MailerLite API | `https://api.mailerlite.com/api/v2/subscribers` | `edge-script.js:861` |
| Bunny SDK | `https://esm.sh/@bunny.net/edgescript-sdk@0.11` | `edge-script.js:1` |

### `.env.example`

**Does not exist.** All 4 build-time env vars are undocumented. Confirm with maintainer.

---

## 11. Discrepancies found

### Code vs. README / expected behaviour

1. **No RSS feed generated.** The `@11ty/eleventy-plugin-rss` plugin is installed but there is no feed template. The plugin only provides Nunjucks filters — without a template, no feed file is output. If a feed is expected, a `feed.njk` must be created.

2. **`robots.txt` sitemap URL is a placeholder.** The file contains `Sitemap: https://yoursite.com/sitemap.xml` instead of `https://www.rebuild.net/sitemap.xml`.

3. **Footer newsletter has a hardcoded Bunny CDN URL.** `footer.njk:20` uses `https://rebuild-production.b-cdn.net/api/newsletter-signup` instead of `{{ site.apiUrl }}/api/newsletter-signup`. This bypasses the environment variable and will break if the API URL changes.

4. **`featuredInsights` collection is always empty.** `.eleventy.js` defines a `featuredInsights` collection filtering for `featured === true`, but no insight post has a `featured` frontmatter field. The collection exists but matches zero posts.

5. **`home.njk` and `event.njk` layouts are unused.** No page references either layout. `home.njk` is identical to `default.njk`. `event.njk` wraps content in an article but no page uses it.

6. **`countdown.js` is dead code.** It is in `src/scripts/` (and passthrough-copied to `/scripts/`) but no template loads it. The separate `gathering-countdown.js` is used instead.

7. **`dating-platorms.md` filename has a typo** (missing "f" in "platforms"). This means the generated URL is `/insights/dating-platorms/` — a misspelling in a permanent URL.

8. **Duplicate splash images.** `splashImages.js` contains `splash-9.jpeg` and `splash-11.jpeg` twice each.

9. **`site.js` navigation lists `/changelog/` with `clickable: true`**, but the changelog page exists at `src/changelog.md` — this is fine, but `open-positions` is marked `clickable: false`, meaning it renders but isn't linked in the footer nav. Confirm intent.

10. **No `.env.example` file.** Four build-time env vars (`NOTION_TOKEN`, `NOTION_BUILDERS_DB_ID`, `SITE_URL`, `API_URL`) are required but completely undocumented. New developers cannot set up the project without insider knowledge.

11. **Pirsch analytics code is hardcoded** in `base.njk` — not configurable via env var. This is fine for a single-domain site but should be noted for the rebuild.

12. **ESPEA Google Apps Script URL is hardcoded** in `espea.js` — not configurable via env var.

13. **The `image` shortcode outputs to `./dist/assets/images/`** which is the build output dir. This works but means processed images are regenerated every clean build. Not a bug, but worth noting for build performance.

14. **Journal collection does not exist.** The task brief mentions `journal/` Markdown files, but no `src/journal/` directory exists in the repo. This may refer to an earlier plan or the `insights/` collection may have replaced it.

---

## 12. Redirect map (draft)

### Static pages

| Current URL | Source | Notes |
| --- | --- | --- |
| `/` | `src/index.html` | Homepage |
| `/about/` | `src/pages/about.html` | |
| `/apply/` | `src/pages/apply.html` | Builder application |
| `/data/` | `src/pages/data.html` | Platform economy data |
| `/directory/` | `src/pages/directory.html` | Builder directory (Notion-powered) |
| `/gathering-request/` | `src/pages/gathering-request.html` | Rebuild 3 invitation form |
| `/gatherings/` | `src/pages/gatherings.html` | Gatherings index |
| `/gatherings/rebuild-2/` | `src/pages/gatherings/rebuild-2.html` | Rebuild 2 event page |
| `/gatherings/rebuild-3/` | `src/pages/gatherings/rebuild-3.html` | Rebuild 3 event page |
| `/get-in-touch/` | `src/pages/get-in-touch.html` | Contact page |
| `/insights/` | `src/pages/insights.html` | Insights listing |
| `/journey/` | `src/pages/journey.html` | Rebuild journey/approach |
| `/newsletter/` | `src/pages/newsletter.html` | Newsletter signup |
| `/open-positions/` | `src/pages/open-positions.html` | Jobs page |
| `/people/` | `src/pages/people.html` | Team page |
| `/privacy/` | `src/pages/privacy.html` | Privacy policy |
| `/rebuild1-application/` | `src/pages/rebuild1-application.html` | Rebuild 1 registration |
| `/suggest/` | `src/pages/suggest.html` | Suggest a platform |
| `/tools/` | `src/pages/tools.html` | Tools and frameworks |
| `/changelog/` | `src/changelog.md` | Digital platform changelog |

### Insight posts (collection)

| Current URL | Source |
| --- | --- |
| `/insights/a-word-from-margrethe/` | `src/insights/a-word-from-margrethe.md` |
| `/insights/andre-ribeirinho/` | `src/insights/andre-ribeirinho.md` |
| `/insights/christian-lindholm/` | `src/insights/christian-lindholm.md` |
| `/insights/collaboration/` | `src/insights/collaboration.md` |
| `/insights/cooperative-ownership/` | `src/insights/cooperative-ownership.md` |
| `/insights/daniela-hinrichs/` | `src/insights/daniela-hinrichs.md` |
| `/insights/dating-platorms/` | `src/insights/dating-platorms.md` |
| `/insights/felix-petersen/` | `src/insights/felix-petersen.md` |
| `/insights/irl-platforms/` | `src/insights/irl-platforms.md` |
| `/insights/katharina-birkenbach/` | `src/insights/katharina-birkenbach.md` |
| `/insights/linda-liukas/` | `src/insights/linda-liukas.md` |
| `/insights/social-design-framework/` | `src/insights/social-design-framework.md` |
| `/insights/social-travel/` | `src/insights/social-travel.md` |
| `/insights/thomas-madsen-mygdal/` | `src/insights/thomas-madsen-mygdal.md` |
| `/insights/ville-muitarri/` | `src/insights/ville-muitarri.md` |

### Form partials (fetched via JS, not navigated directly)

| Current URL | Source |
| --- | --- |
| `/forms/newsletter.html` | `src/forms/newsletter.html` |
| `/forms/builder-application.html` | `src/forms/builder-application.html` |
| `/forms/builder-promo.html` | `src/forms/builder-promo.html` |
| `/forms/gathering-invitation.html` | `src/forms/gathering-invitation.html` |
| `/forms/gathering-invitation-rebuild3.html` | `src/forms/gathering-invitation-rebuild3.html` |
| `/forms/application-rebuild1.html` | `src/forms/application-rebuild1.html` |

### Generated files

| Current URL | Source | Notes |
| --- | --- | --- |
| `/sitemap.xml` | `src/sitemap.njk` | Custom template |
| `/robots.txt` | `src/public/robots.txt` | Static file (passthrough) |

### API endpoints (Bunny Edge Script — not generated by Eleventy)

| Endpoint | Notes |
| --- | --- |
| `/api/newsletter-signup` | MailerLite |
| `/api/builder-application` | Notion |
| `/api/builder-promotion` | Notion |
| `/api/gathering-invitation` | Notion |
| `/api/application-rebuild1` | Notion + MailerLite |
| `/api/notion-mailerlite-sync` | Notion webhook (server-to-server) |

**Total URL surface: 20 static pages + 15 insight posts + 6 form partials + 2 generated files + 6 API endpoints = 49 URLs.**
