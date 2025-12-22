# CLAUDE.md - AI Assistant Guide

Last Updated: 2025-12-21

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
- **Hosting**: StaticHost.eu (staging) / Bunny CDN (production)

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
├── _includes/components/   # Reusable Nunjucks components
├── _includes/layouts/      # Page layouts
├── _data/                  # Data files (JSON, JS)
├── styles/                 # TailwindCSS source
├── scripts/                # Client-side JS
└── public/                 # Static assets
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
date: 2025-12-21
author: "Author Name"
tags: [Stories, Resources]
excerpt: "Brief description"
---
```

### Builders Directory

Managed via Notion database. Fetched at build time via `src/_data/builders.js`.

### Carousel Slides

Edit `src/_data/carousel.json` directly.

### Events

Edit `src/_data/events.json` directly.

## Forms System

### Sidebar Forms

Trigger with data attributes:
```html
<button data-form="newsletter">Subscribe</button>
<button data-form="builder-promo">Nominate</button>
```

### Available Forms

- `newsletter` - Newsletter signup
- `builder-promo` - Nominate a builder
- `builder-application` - Apply to directory
- `gathering-invitation` - Request invitation

### Form Processing

1. Client-side validation
2. Submit to Bunny Edge Script
3. Edge Script validates and routes to:
   - MailerLite (for newsletter signups)
   - Notion (for form submissions)
4. Return success/error to client

## Bunny Edge Scripts

Located in `bunny-edge-scripts/`:
- `newsletter-handler.js` - MailerLite integration
- `bunny-edge-scripts-no-loop.js` - Combined handler

Deploy via Bunny CDN dashboard with environment variables.

## Common Tasks

### Adding a New Component

1. Create component in `src/_includes/components/`
2. Use Nunjucks syntax with TailwindCSS
3. Document usage in component file comments
4. Test in development mode

### Adding a New Page

1. Create `.html` or `.njk` file in `src/`
2. Add frontmatter with layout
3. Use existing components
4. Test responsive design

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

## Documentation

For detailed guides, see:
- [README.md](README.md) - Project overview and setup
- [FORMS_GUIDE.md](FORMS_GUIDE.md) - Form system details
- [SIDEBAR_FORMS.md](SIDEBAR_FORMS.md) - Sidebar form implementation
- [CAROUSEL.md](CAROUSEL.md) - Carousel component
- [NEWSLETTER_IMPLEMENTATION.md](NEWSLETTER_IMPLEMENTATION.md) - MailerLite integration
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Deployment checklist

## Quick Reference

### File Paths

Commonly edited files:
- `src/index.html` - Homepage
- `src/_includes/components/footer.njk` - Footer
- `src/_includes/components/header.njk` - Header
- `src/_data/carousel.json` - Carousel content
- `src/styles/main.css` - Main stylesheet

### URLs

- **Staging**: (Configure in deployment settings)
- **Production**: www.rebuild.net
- **API Endpoint**: Bunny CDN pull zone URL

## Support

For questions:
1. Check existing documentation files
2. Review component code for examples
3. Search recent commits for context
4. Ask the user for clarification
