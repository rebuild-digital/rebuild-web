# CLAUDE.md - AI Assistant Guide

Last Updated: 2025-12-22

## Project Overview

**rebuild-web** is a production Eleventy static site with:

- Nunjucks component architecture
- TailwindCSS styling
- Bunny CDN Edge Scripts for forms
- MailerLite integration for newsletters
- Notion API for build-time data

## Tech Stack

- **Static Site**: Eleventy (11ty) + Nunjucks
- **Styling**: TailwindCSS + PostCSS
- **Forms**: Bunny Edge Scripts + MailerLite API
- **Content**: Markdown + Notion API
- **Hosting**: Vercel

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Clean cache and dist
npm run clean
```

## Key Conventions

### Code Style

- Use semantic HTML5 elements
- Use TailwindCSS utility classes (no custom CSS unless necessary)
- Keep components small and focused
- Write accessible markup (ARIA, alt text, semantic structure)
- Color contrast must meet WCAG AA standards

### File Organization

```text
src/
├── _includes/
│   ├── components/   # Reusable Nunjucks components
│   │   └── forms/    # Form components (newsletter, applications, etc.)
│   └── layouts/      # Page layouts
├── _data/            # Data files (JSON, JS) - Notion, carousel, events
├── forms/            # Form HTML endpoints for sidebar
├── insights/         # Markdown insight posts
├── pages/            # Site pages (about, journey, etc.) - use permalink in frontmatter
├── scripts/          # Client-side JS and edge scripts
├── styles/           # TailwindCSS source
├── public/           # Static assets
└── index.html        # Homepage (kept in root)
```

### Component Patterns

**Include components**:

```njk
{% include "components/carousel.njk" %}
```

**Import macros**:

```njk
{% from "components/image-credit.njk" import imageCredit %}
{{ imageCredit("Photo by Name") }}
```

**Pass data to components**:

```njk
{% include "components/form.njk" with { formId: "contact", fields: myFields } %}
```

## Git Workflow

### Branch Strategy

- `main` - Production branch (auto-deploys)
- `staging` - Staging branch (auto-deploys to staging)
- `feature/*` - Feature branches

### Commit Messages

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `chore:` - Build/tooling changes

### Creating Commits

Follow the git commit protocol in the system instructions:

1. Run `git status` and `git diff` to see changes
2. Draft a clear commit message explaining why (not just what)
3. Add untracked files if needed
4. Create commit with proper attribution footer
5. Verify with `git status`

## Content Management

### Journal Posts

Create in `src/journal/` with frontmatter:

```yaml
---
title: "Post Title"
date: 2025-12-22
author: "Author Name"
tags: [Stories, Resources]
excerpt: "Brief description"
featured: false
---
```

### Insight Posts

Create in `src/insights/` with frontmatter:

```yaml
---
title: "Insight Title"
date: 2025-12-22
author: "Author Name"
tags: [Category, Topic]
excerpt: "Brief description"
featured: false
---
```

These appear on the insights page and can be featured on homepage.

### Builders Directory

Managed via Notion database. Fetched at build time via `src/_data/builders.js`.

### Carousel Slides

Edit `src/_data/carousel.json` directly.

### Events

Edit `src/_data/events.json` directly.

## Forms System

### Available Sidebar Forms

Trigger with data attributes on any element:

```html
<button data-form="newsletter">Subscribe</button>
<button data-form="builder-promo">
	Nominate a Builder
</button>
<button data-form="builder-application">
	Apply to Directory
</button>
<button data-form="gathering-invitation">
	Request Invitation
</button>
```

All forms are fetched from `/forms/{form-name}.html` endpoints and displayed in a responsive sidebar overlay.

### Form Processing

1. Client-side validation
2. Submit to Bunny Edge Script
3. Edge Script validates and routes to:
   - MailerLite (for newsletter signups)
   - Notion (for form submissions)
4. Return success/error to client

## Bunny Edge Scripts

Located in `src/scripts/edge-script.js` - a unified handler for all form endpoints.

Deploy via Bunny CDN dashboard with environment variables.

## Common Tasks

### Adding a New Component

1. Create component in `src/_includes/components/`
2. Use Nunjucks syntax with TailwindCSS
3. Document usage in component file comments
4. Test in development mode
5. **Consider downstream impacts**: If the component submits data or requires backend processing, update `src/scripts/edge-script.js` to handle the endpoint. If it uses new data sources, update relevant files in `src/_data/`.

### Adding a New Page

1. Create `.html` or `.njk` file in `src/pages/`
2. Add frontmatter with layout and `permalink` to control URL (e.g., `permalink: /my-page/index.html`)
3. Use existing components
4. Test responsive design
5. **Consider downstream impacts**: If adding forms, create corresponding form endpoint in `src/forms/` and update `src/scripts/form-triggers.js` to register it.

### Updating Styles

1. Edit `src/styles/main.css` (Tailwind directives)
2. Use `@layer components` for custom components
3. Run `npm run build:css` to rebuild
4. Verify in browser

### Deploying Changes

1. Push to `staging` branch
2. Verify on staging URL
3. Create PR to `main`
4. Merge triggers production deploy

## Environment Variables

Required for build:

- `NOTION_TOKEN` - Notion API key
- `NOTION_BUILDERS_DB_ID` - Builders database ID
- `BUNNY_*` - CDN configuration
- `MAILERLITE_*` - Newsletter integration

See `.env.example` for full list.

## Testing

### Before Committing

- Build succeeds: `npm run build`
- No console errors
- Forms work correctly
- Responsive design verified
- Accessibility checked

### Before Deploying

- Staging site loads
- All forms submit successfully
- Images and videos load
- No broken links
- Analytics tracking works

## Troubleshooting

### Build fails

- Clear cache: `npm run clean`
- Check for syntax errors in templates
- Verify data files are valid JSON

### Forms not working

- Check browser console for errors
- Verify Edge Scripts are enabled
- Check Bunny dashboard logs
- Confirm environment variables are set

### Styling issues

- Rebuild CSS: `npm run build:css`
- Check for Tailwind class typos
- Verify PostCSS config

## Best Practices

### DO:

- Read existing files before editing
- Follow established patterns
- Use TodoWrite for complex tasks
- Test changes locally before committing
- Write clear commit messages
- Keep components small and reusable
- Use semantic HTML

### DON'T:

- Commit secrets or API keys
- Create unnecessary files
- Use emojis unless requested
- Make breaking changes without discussion
- Skip testing before committing
- Add console.logs without removing them
- Create overly complex abstractions

## Components

### Carousel

Include the carousel component:

```njk
{% include "components/carousel.njk" %}
```

Customize slides via `src/_data/carousel.json`. Features auto-rotation, navigation, keyboard/swipe controls, and full accessibility.

### Image Credit

Add photo credits to images:

```njk
{% from "components/image-credit.njk" import imageCredit %}

<div class="relative">
  <img src="/assets/images/photo.jpg" alt="Description">
  {{ imageCredit("Photo by Photographer Name") }}
</div>
```

Supports positioning (default: `bottom-right`):

- `bottom-left`
- `bottom-right`
- `top-left`
- `top-right`

The component includes both light and dark variants for different backgrounds.

## Documentation

For detailed guides, see:

- [README.md](README.md) - Project overview and setup
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Deployment checklist

## Quick Reference

### File Paths

Commonly edited files:

- `src/index.html` - Homepage
- `src/pages/` - Site pages (about, journey, etc.)
- `src/_includes/components/footer.njk` - Footer
- `src/_includes/components/header.njk` - Header
- `src/_includes/components/forms/` - Form components
- `src/_data/carousel.json` - Carousel content
- `src/insights/` - Insight posts
- `src/forms/` - Form sidebar endpoints
- `src/scripts/edge-script.js` - Bunny Edge Script handler
- `src/styles/main.css` - Main stylesheet

### URLs

- **Staging**: (Configure in deployment settings)
- **Production**: www.rebuild.net
- **API Endpoint**: Bunny CDN pull zone URL

## Collaboration Workflow

### Working with Claude Code

When collaborating on this project with Claude Code:

1. **Exploration first**: For understanding features, Claude will explore the codebase before making changes
2. **Plan complex tasks**: Multi-step implementations use TodoWrite to track progress
3. **Read before edit**: Files are always read before modifications to preserve patterns
4. **Follow conventions**: Existing code patterns (Nunjucks components, TailwindCSS) are maintained
5. **Recommend next steps**: When changes have downstream impacts (e.g., new component requires edge script updates), Claude will proactively identify and suggest related updates across the codebase
6. **Ask for clarification**: When multiple approaches exist, Claude will ask for your preference
7. **Validate changes**: You'll be asked to review significant updates before committing

### When Claude Commits

Claude should proactively create commits for completed work and follows this process:

1. Reviews changes with `git status` and `git diff`
2. Writes conventional commit message (feat:, fix:, docs:, etc.)
3. Includes attribution footer with "🤖 Generated with Claude Code"
4. Verifies commit succeeded

**Git Workflow Rules**:

- ✅ **DO**: Create commits proactively after completing tasks
- ✅ **DO**: Perform other helpful Git actions (status, diff, branch management, etc.)
- ❌ **DON'T**: Push to remote without explicit user approval
- ❌ **DON'T**: Run destructive Git commands (force push, hard reset) without explicit request
- 💡 **ASK**: Before pushing to main branch, always ask for user confirmation first

## Support

For questions:

1. Check existing documentation files
2. Review component code for examples
3. Search recent commits for context
4. Ask the user for clarification
