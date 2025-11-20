# Setup Checklist

This checklist covers all accounts, tools, and configurations needed to build and deploy your site with the chosen stack.

## Current Implementation Status

**✅ COMPLETED:**

- Local development environment fully set up
- All core Eleventy dependencies installed
- Project structure created with proper directories
- Eleventy configuration complete with plugins, collections, filters, and image shortcode
- Component architecture implemented (7 components with TailwindCSS)
- Layout templates created (5 layouts including base, journal, event)
- Global site data configured
- Notion API integration built with caching fallback
- Events data structure ready
- Git repository initialized
- Build scripts configured in package.json

**⚠️ IN PROGRESS / PARTIALLY COMPLETE:**

- Environment variables (`.env` file exists but may need all values configured)
- CSS processing setup (PostCSS plugins installed but may need configuration)
- Forms (architecture defined but Cloudflare Workers not deployed yet)

**❌ NOT STARTED:**

- External service accounts (StaticHost.eu, Cloudflare Workers, Bunny CDN, Pirsch)
- Notion databases creation and setup
- Actual content (journal posts, images, videos)
- Production deployment
- Custom domain configuration

## Recommended Next Steps

### Priority 1 (Critical for functionality)

1. **Set up Notion databases** - Required for forms and builders data
2. **Configure environment variables** - Fill in `.env` with actual Notion credentials
3. **Create initial content** - At least 1-2 sample journal posts to test the system

### Priority 2 (Needed for deployment)

1. **Set up Cloudflare Workers** - Deploy form handlers for newsletter and contact
2. **Configure StaticHost.eu** - Connect repository and deploy the site
3. **Add Bunny CDN account** - For video and font hosting when ready

### Priority 3 (Can be deferred)

1. **Add Pirsch analytics** - Once site is live
2. **Custom domain** - After testing on default URLs
3. **Add custom fonts** - Currently using system fonts

---

## 1. Development Environment

### Local Tools Installation

- [x] **Node.js** (v18 or higher)
  - Download: <https://nodejs.org/>
  - Verify: `node --version`
- [x] **npm** or **pnpm**
  - Comes with Node.js
  - Verify: `npm --version`
- [x] **Git**
  - Download: <https://git-scm.com/>
  - Verify: `git --version`
- [x] **Code Editor**
  - VS Code, Cursor, WebStorm, or your preference
  - Recommended VS Code extensions: Nunjucks, Markdown All in One

### Project Setup

- [x] Initialize new project directory
- [x] Run `npm init -y`
- [x] Install Eleventy and core plugins:
  - `npm install --save-dev @11ty/eleventy`
  - `npm install --save-dev @11ty/eleventy-img` (image optimization)
  - `npm install --save-dev @11ty/eleventy-plugin-syntaxhighlight` (code blocks)
  - `npm install --save-dev @11ty/eleventy-plugin-rss` (RSS feed)
  - `npm install --save-dev @11ty/eleventy-plugin-sitemap` (sitemap)
- [x] Install CSS processing:
  - `npm install --save-dev postcss postcss-modules postcss-cli`
  - `npm install --save-dev cssnano` (CSS minification)
  - `npm install --save-dev eleventy-plugin-postcss`
- [x] Install JavaScript minification:
  - `npm install --save-dev terser` (JS minification)
- [x] Install Notion SDK:
  - `npm install @notionhq/client`
- [x] Install environment variables:
  - `npm install dotenv`
- [x] Create basic directory structure (see STACK_ARCHITECTURE.md)
- [x] Create `.env.example` file with placeholder values
- [x] Create `.gitignore` (ignore `node_modules/`, `dist/`, `.cache/`, `.env`)

## 2. Version Control & Repository

### Git Repository

- [x] Create **GitHub** or **GitLab** account (if you don't have one)
- [x] Create new repository for the project
  - Name: `rebuild-web`
  - Visibility: Private or Public
- [x] Initialize Git locally: `git init`
- [x] Connect to remote: `git remote add origin [repository-url]`
- [x] Create `.gitignore` file (ignore `node_modules/`, `dist/`, `.env`)
- [x] Make initial commit and push

## 3. Static Site Hosting

### StaticHost.eu Setup

- [ ] Create account at <https://www.statichost.eu/>
- [ ] Connect GitHub/GitLab repository
- [ ] Configure **Production** environment:
  - Branch: `main`
  - Build command: `npm run build`
  - Output directory: `dist` (or your Eleventy output folder)
  - Node version: 18.x or 20.x
- [ ] Configure **Staging** environment:
  - Branch: `staging` or `develop`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Same Node version
- [ ] Enable **Deploy Previews** for pull requests
- [ ] Configure **Build Caching**:
  - Cache `node_modules/`
  - Cache `.cache/` directory
- [ ] Set up environment variables (see Environment Variables section)
- [ ] Note your URLs:
  - Production: `https://[project-name].statichost.eu` or custom domain
  - Staging: `https://staging-[project-name].statichost.eu`
- [ ] (Optional) Configure custom domain if needed

**What to learn:**

- How to connect Git repository
- How to configure build commands
- How to set environment variables
- Branch-based deployments
- Build caching configuration

## 4. Serverless Functions (Form Handling)

### Cloudflare Workers Setup

- [ ] Create **Cloudflare** account at <https://dash.cloudflare.com/>
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Login to Wrangler: `wrangler login`
- [ ] Create Worker project: `wrangler init api`
- [ ] Configure two Workers:
  - `newsletter-handler` (for newsletter signups)
  - `contact-handler` (for contact form)
- [ ] Set up Worker routes/triggers
- [ ] Note Worker URLs (e.g., `https://[worker-name].[your-subdomain].workers.dev`)

**What to learn:**

- Cloudflare Workers basics: <https://developers.cloudflare.com/workers/>
- Handling POST requests
- Making external API calls (to Notion)
- CORS configuration for form submissions

## 5. Video & Font Hosting

### Bunny CDN Setup

- [ ] Create account at <https://bunny.net/>
- [ ] Create **Storage Zone** (choose EU region)
  - Name: `[project-name]-assets`
  - Region: Europe
  - Note Storage Zone name
- [ ] Create **Pull Zone** for video delivery
  - Name: `[project-name]-videos`
  - Link to Storage Zone
  - Note Pull Zone URL (e.g., `https://[pull-zone].b-cdn.net/`)
- [ ] Create separate **Pull Zone** for fonts
  - Name: `[project-name]-fonts`
  - Note Pull Zone URL
- [ ] Get **FTP/API credentials** for uploading
  - Storage Zone → FTP & API Access
  - Note: Hostname, Username, Password
- [ ] Get **API Key**
  - Account → API
  - Create new API key
  - Store securely

### Upload Initial Assets

- [ ] Upload custom fonts to fonts Storage Zone
- [ ] Test font URLs: `https://[fonts-pullzone].b-cdn.net/font-name.woff2`
- [ ] Configure CSS `@font-face` with Bunny CDN URLs

**What to learn:**

- Storage Zones vs Pull Zones
- FTP upload methods or API upload
- CDN URL structure
- Optimizing video formats for web (MP4, WebM)

## 6. Form Data Storage

### Notion Setup

- [ ] Create **Notion** account (if you don't have one)
- [ ] Create workspace or use existing
- [ ] Create database for **Newsletter Signups**
  - Properties: Email (text), Date Added (date), Source (select)
  - Note Database ID (from URL or share link)
- [ ] Create database for **Contact Form Submissions**
  - Properties: Name (text), Email (text), Message (text), Date (date)
  - Note Database ID
- [ ] Create database for **Builders/Projects** (fetched at build time)
  - Properties:
    - Name (Title)
    - Description (Rich Text)
    - Image (Files & Media)
    - Link (URL)
    - Status (Select: Draft, Published, Archived)
    - Tags (Multi-select)
    - Order (Number) - optional for sorting
  - Note Database ID
- [ ] Create **Notion Integration**
  - Visit: <https://www.notion.so/my-integrations>
  - Click "New integration"
  - Name: `[Project Name] Integration`
  - Select workspace
  - Note **Integration Token** (starts with `secret_...`)
- [ ] Connect integration to ALL THREE databases
  - Open each database → ••• menu → Add connections → Select your integration
- [ ] Store Integration Token securely (`.env` file, never commit!)

**What to learn:**

- Notion API basics: <https://developers.notion.com/>
- Database structure and properties
- Creating pages via API (for forms)
- Querying databases (for builders data)

## 7. Analytics

### Pirsch Setup

- [ ] Create account at <https://pirsch.io/>
- [ ] Create new website
  - Name: `[Your Project Name]`
  - URL: Your production URL
- [ ] Get **Tracking Code** or **JavaScript snippet**
- [ ] Choose integration method:
  - Option A: JavaScript snippet in `<head>` (easiest)
  - Option B: Server-side tracking via API (privacy-first, no cookies)
- [ ] Add tracking code to your Eleventy layout
- [ ] (If using server-side) Get API credentials from Pirsch dashboard
- [ ] Test analytics in staging/development

**What to learn:**

- Privacy-compliant analytics
- GDPR considerations (Pirsch is GDPR-compliant by default)
- Reading analytics dashboard

## 8. Environment Variables & Secrets

### Create `.env` File (Local Development)

```bash
# Notion
NOTION_TOKEN=secret_xxxxxxxxxxxxx
NOTION_NEWSLETTER_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CONTACT_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_BUILDERS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Bunny CDN
BUNNY_STORAGE_ZONE=your-storage-zone
BUNNY_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
BUNNY_PULL_ZONE_URL=https://yourzone.b-cdn.net
BUNNY_FONTS_PULL_ZONE_URL=https://fonts-yourzone.b-cdn.net

# Pirsch (if using server-side)
PIRSCH_CLIENT_ID=xxxxxxxxxxxxx
PIRSCH_CLIENT_SECRET=xxxxxxxxxxxxx
```

- [ ] Create `.env` file in project root
- [ ] Add to `.gitignore` (never commit!)
- [ ] Add these variables to:
  - **StaticHost.eu** environment variables (for build-time Notion fetch)
  - **Cloudflare Workers** secrets (only form-related ones):
    - `wrangler secret put NOTION_TOKEN`
    - `wrangler secret put NOTION_NEWSLETTER_DB_ID`
    - `wrangler secret put NOTION_CONTACT_DB_ID`

## 9. Domain & DNS (Optional)

### If Using Custom Domain

- [ ] Purchase domain (Cloudflare Registrar, Namecheap, etc.)
- [ ] Add domain to StaticHost.eu
  - Follow their DNS configuration guide
  - Update nameservers or add CNAME records
- [ ] Configure SSL certificate (usually automatic)
- [ ] Add custom domain to Cloudflare Workers (if needed)
- [ ] Update Pirsch with final domain

## 10. Testing & Pre-Launch

### Local Testing Checklist

- [ ] Eleventy builds successfully: `npm run build`
- [ ] All pages render correctly
- [ ] Videos load from Bunny CDN
- [ ] Fonts load from Bunny CDN
- [ ] Forms submit to Cloudflare Workers (test locally with ngrok or similar)
- [ ] Countdown timers work correctly
- [ ] Journal posts generate from markdown
- [ ] Navigation works across all pages

### Deployment Testing

- [ ] Push to Git repository
- [ ] Verify StaticHost.eu builds successfully
- [ ] Test live site URL
- [ ] Submit test forms (check Notion databases)
- [ ] Verify analytics tracking (check Pirsch dashboard)
- [ ] Test on mobile devices
- [ ] Check page load speed
- [ ] Validate HTML/CSS

## 11. Documentation & Credentials Storage

### Security & Access

- [ ] Store all credentials in password manager
  - Notion Integration Token
  - Bunny CDN API Key
  - Cloudflare Workers secrets
  - StaticHost.eu login
  - Pirsch login
- [ ] Document API endpoints and Worker URLs
- [ ] Create `README.md` with setup instructions
- [ ] Document environment variables needed

### Backup & Recovery

- [ ] Backup `.env.example` file (with placeholder values) in repository
- [ ] Document where production secrets are stored
- [ ] Create backup of Notion database structures

## Learning Resources Summary

### Priority Reading

1. **Eleventy Documentation**
   - <https://www.11ty.dev/docs/>
   - Focus: Collections, Nunjucks, Data Files, Frontmatter

2. **Cloudflare Workers**
   - <https://developers.cloudflare.com/workers/>
   - Focus: Handling POST requests, Environment variables, API calls

3. **Notion API**
   - <https://developers.notion.com/>
   - Focus: Authentication, Creating database pages

4. **Bunny CDN Dashboard**
   - Explore after account creation
   - Focus: Storage zones, Pull zones, Upload methods

### Secondary Resources

- Nunjucks templating: <https://mozilla.github.io/nunjucks/>
- Markdown syntax: <https://www.markdownguide.org/>
- StaticHost.eu docs (available after signup)
- Pirsch documentation: <https://docs.pirsch.io/>

## Quick Start Order (Recommended)

1. ✅ Set up local development environment (Node, Git, editor)
2. ✅ Create Git repository (GitHub/GitLab)
3. ✅ Initialize Eleventy project locally
4. ✅ Create Bunny CDN account (for assets)
5. ✅ Create Notion account + databases
6. ✅ Set up Cloudflare Workers for forms
7. ✅ Connect to StaticHost.eu for deployment
8. ✅ Add Pirsch analytics
9. ✅ Test everything locally
10. ✅ Deploy and test live

Good luck with your setup! Work through these one at a time and you'll have everything configured in a few hours.
