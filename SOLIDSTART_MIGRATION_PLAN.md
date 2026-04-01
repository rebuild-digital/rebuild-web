# SolidStart Migration Plan

## Context

This plan migrates the rebuild-web Eleventy static site to SolidStart for long-term maintainability and expandability. The current site uses Nunjucks templates (28 components, 14 pages) with vanilla JavaScript for interactivity (800+ LOC across 4 files). The migration to SolidStart will provide:

- **Component-based architecture** with JSX (familiar to maintainer's React/Next.js background)
- **Fine-grained reactivity** replacing manual DOM manipulation and class-based state
- **Type safety** and better developer experience
- **No corporate backing** (European/open-source priority satisfied)
- **Long-term expandability** with a mature ecosystem

**Why now:** Vanilla JS patterns are becoming unmaintainable as the site grows. SolidStart provides the modern component framework needed while maintaining static site generation and Vercel deployment compatibility.

---

## Migration Strategy

This is a **full replacement** migration, not incremental. We'll build the SolidStart version in parallel, then switch over once complete. The migration follows 8 phases executed sequentially.

---

## Phase 1: Project Setup & Foundation

### Actions

1. **Initialize SolidStart with TailwindCSS:**
   ```bash
   npm create solid@latest rebuild-web-solidstart -- --template=with-tailwindcss
   cd rebuild-web-solidstart
   ```

2. **Install dependencies:**
   ```bash
   npm install @solidjs/router @solidjs/start @solidjs/meta
   npm install @notionhq/client dotenv rss
   npm install -D vite-plugin-mdx @mdx-js/rollup remark-frontmatter remark-mdx-frontmatter
   ```

3. **Configure static export** in `app.config.ts`:
   ```typescript
   export default defineConfig({
     ssr: true,
     server: {
       preset: "static",
       prerender: {
         crawlLinks: true,
         routes: ["/", "/directory", "/insights", "/journey", "/tools", "/people", "/about"]
       }
     }
   });
   ```

4. **Copy static assets:**
   - `/home/user/rebuild-web/src/public/*` → `public/`
   - `/home/user/rebuild-web/src/styles/main.css` → `src/styles/main.css`
   - `/home/user/rebuild-web/tailwind.config.js` → `tailwind.config.js`

5. **Setup environment variables** (`.env`):
   ```
   VITE_SITE_URL=https://rebuild.net
   NOTION_TOKEN=<token>
   NOTION_BUILDERS_DB_ID=<db_id>
   ```

### Critical Files
- New: `app.config.ts`, `vite.config.ts`, `.env`

---

## Phase 2: Base Layout System

### Actions

1. **Convert base layout:** `/home/user/rebuild-web/src/_includes/layouts/base.njk` → `src/components/layout/Layout.tsx`
   - Meta tags with `@solidjs/meta` (Title, Meta, Link)
   - Props: `title`, `description`, `featuredImage`, `isHomepage`
   - Include Header, Footer, FormSidebar components

2. **Convert Header:** `/home/user/rebuild-web/src/_includes/components/header.njk` → `src/components/layout/Header.tsx`
   - Mobile menu toggle state with `createSignal`
   - Navigation from `siteConfig.main_navigation`

3. **Convert Footer:** `/home/user/rebuild-web/src/_includes/components/footer.njk` → `src/components/layout/Footer.tsx`
   - Newsletter form trigger
   - Second navigation links

### Conversion Pattern
```tsx
// Nunjucks: {% if condition %}...{% endif %}
// Solid: <Show when={condition}>...</Show>

// Nunjucks: {% for item in items %}...{% endfor %}
// Solid: <For each={items()}>{(item) => ...}</For>

// Nunjucks: {{ variable }}
// Solid: {variable()}
```

### Critical Files
- Source: `/home/user/rebuild-web/src/_includes/layouts/base.njk`
- Source: `/home/user/rebuild-web/src/_includes/components/header.njk`
- Source: `/home/user/rebuild-web/src/_includes/components/footer.njk`
- New: `src/components/layout/Layout.tsx`, `Header.tsx`, `Footer.tsx`

---

## Phase 3: Data Layer Migration

### Actions

1. **Site configuration:** `/home/user/rebuild-web/src/_data/site.js` → `src/data/site.ts`
   - Export typed `SiteConfig` interface
   - Navigation arrays, meta defaults

2. **Notion builders API:** `/home/user/rebuild-web/src/_data/builders.js` → `src/data/builders.ts`
   - Keep build-time fetching logic
   - Export `fetchBuilders(): Promise<Builder[]>`
   - Maintain cache fallback to `.cache/builders.json`

3. **Static JSON imports:**
   - `carousel.json`, `events.json`, `programmes.json` → direct ESM imports
   - Place in `src/data/` directory

4. **Markdown content setup:**
   - Configure MDX in `vite.config.ts` with `vite-plugin-mdx`
   - Add remark plugins: `remarkFrontmatter`, `remarkMdxFrontmatter`
   - Create collection utility: `src/lib/collections.ts`
   - Function: `getAllInsights()` using `import.meta.glob('*.mdx', { eager: true })`

5. **Utility functions:**
   - `src/lib/dateFormat.ts`: `dateFormat()`, `shortDate()`, `isPast()`
   - `src/lib/categoryColors.ts`: `categoryColors` map, `getCategoryColors()`

### Critical Files
- Source: `/home/user/rebuild-web/src/_data/builders.js`
- Source: `/home/user/rebuild-web/src/_data/site.js`
- New: `src/data/builders.ts`, `src/data/site.ts`, `src/lib/collections.ts`

---

## Phase 4: Interactive Components (Core Migration)

### 4.1 DirectoryFilter

**Source:** `/home/user/rebuild-web/src/scripts/directory-filter.js` (293 lines)  
**Target:** `src/components/interactive/DirectoryFilter.tsx`

**Conversion:**
```tsx
// Class with Set → createSignal with Set
const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());

// Computed categories → createMemo
const categories = createMemo(() => {
  // Extract unique categories from builders
  // Sort by customOrder array
});

// Filtered builders → createMemo
const visibleBuilders = createMemo(() => {
  if (activeFilters().size === 0) return props.builders;
  return props.builders.filter(builder => 
    Array.from(activeFilters()).some(filter => builder.category.includes(filter))
  );
});

// Toggle filter
const handleFilterClick = (category: string) => {
  setActiveFilters(prev => {
    const next = new Set(prev);
    next.has(category) ? next.delete(category) : next.add(category);
    return next;
  });
};

// No manual render() - reactivity is automatic
```

**Key change:** Remove all DOM manipulation (`.classList`, `.style.display`). Use `<For each={visibleBuilders()}>` with conditional rendering.

### 4.2 InsightsFilter

**Source:** `/home/user/rebuild-web/src/scripts/insights-filter.js` (186 lines)  
**Target:** `src/components/interactive/InsightsFilter.tsx`

**Conversion:**
```tsx
const [activeTag, setActiveTag] = createSignal<string | null>(null);
const [activeSort, setActiveSort] = createSignal<"recency" | "alphabetical">("recency");

const visibleInsights = createMemo(() => {
  let filtered = props.insights;
  
  // Apply tag filter
  if (activeTag()) {
    filtered = filtered.filter(insight => insight.tags.includes(activeTag()!));
  }
  
  // Apply sort
  const sorted = [...filtered];
  if (activeSort() === "alphabetical") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  return sorted;
});
```

**Key change:** Color hashing logic moves to utility, sorting is reactive via `createMemo`.

### 4.3 Carousel

**Source:** `/home/user/rebuild-web/src/scripts/carousel.js` (179 lines)  
**Target:** `src/components/interactive/Carousel.tsx`

**Conversion:**
```tsx
const [currentSlide, setCurrentSlide] = createSignal(0);

const startAutoplay = () => {
  autoplayInterval = setInterval(() => setCurrentSlide(prev => (prev + 1) % props.slides.length), 7000);
};

onMount(() => {
  startAutoplay();
  document.addEventListener("keydown", handleKeydown);
});

onCleanup(() => {
  clearInterval(autoplayInterval);
  document.removeEventListener("keydown", handleKeydown);
});

// Render
<For each={props.slides}>
  {(slide, index) => (
    <div class={index() === currentSlide() ? "opacity-100" : "opacity-0"}>
      {/* slide content */}
    </div>
  )}
</For>
```

**Key change:** Lifecycle hooks (`onMount`, `onCleanup`) replace manual setup. State-driven classes replace manual DOM manipulation.

### 4.4 FormSidebar

**Source:** `/home/user/rebuild-web/src/_includes/components/form-sidebar.njk` + `/home/user/rebuild-web/src/scripts/form-triggers.js`  
**Target:** `src/components/interactive/FormSidebar.tsx`

**Conversion:**
```tsx
const [isOpen, setIsOpen] = createSignal(false);
const [activeForm, setActiveForm] = createSignal<string | null>(null);

const formComponents = {
  "builder-promo": BuilderPromoForm,
  "builder-application": BuilderApplicationForm,
  "newsletter": NewsletterForm
};

onMount(() => {
  document.addEventListener("click", (e) => {
    const trigger = (e.target as HTMLElement).closest("[data-form]");
    if (trigger) {
      e.preventDefault();
      const formType = trigger.getAttribute("data-form");
      setActiveForm(formType);
      setIsOpen(true);
    }
  });
});

// Render
<Show when={activeForm()}>
  {(formType) => {
    const FormComponent = formComponents[formType()];
    return <FormComponent />;
  }}
</Show>
```

**Key change:** Replace fetch + HTML injection with lazy-loaded Solid components. Dynamic component rendering with `<Dynamic>`.

### Critical Files
- Source: `/home/user/rebuild-web/src/scripts/directory-filter.js`
- Source: `/home/user/rebuild-web/src/scripts/insights-filter.js`
- Source: `/home/user/rebuild-web/src/scripts/carousel.js`
- Source: `/home/user/rebuild-web/src/scripts/form-triggers.js`
- New: `src/components/interactive/{DirectoryFilter,InsightsFilter,Carousel,FormSidebar}.tsx`

---

## Phase 5: Pages & Routing

### Actions

1. **Homepage:** `/home/user/rebuild-web/src/index.html` → `src/routes/index.tsx`
   - Import Carousel with `carouselData.slides`
   - Include DirectoryPreview, ProgrammesPreview, InsightsPreview sections
   - Pass `isHomepage={true}` to Layout

2. **Directory page:** `/home/user/rebuild-web/src/pages/directory.html` → `src/routes/directory.tsx`
   ```tsx
   const builders = createAsync(() => fetchBuilders());
   return <DirectoryFilter builders={builders() || []} />;
   ```

3. **Insights listing:** `/home/user/rebuild-web/src/pages/insights.html` → `src/routes/insights/index.tsx`
   ```tsx
   const insights = createAsync(() => Promise.resolve(getAllInsights()));
   return <InsightsFilter insights={insights() || []} />;
   ```

4. **Dynamic insight posts:** `src/routes/insights/[slug].tsx`
   ```tsx
   const params = useParams();
   const insight = createAsync(() => getAllInsights().find(p => p.slug === params.slug));
   return <Dynamic component={insight()?.content} />;
   ```

5. **Simple static pages:** Convert remaining 10 pages
   - `about.tsx`, `journey.tsx`, `tools.tsx`, `people.tsx`, `get-in-touch.tsx`
   - `privacy.tsx`, `changelog.tsx`, `open-positions.tsx`

### Critical Files
- Source: `/home/user/rebuild-web/src/index.html`
- Source: `/home/user/rebuild-web/src/pages/directory.html`
- Source: `/home/user/rebuild-web/src/pages/insights.html`
- New: `src/routes/index.tsx`, `src/routes/directory.tsx`, `src/routes/insights/*.tsx`

---

## Phase 6: Forms & API Routes

### Actions

1. **Form components:** Create `src/components/forms/`
   - `NewsletterForm.tsx`, `BuilderPromoForm.tsx`, `BuilderApplicationForm.tsx`
   - Use `createSignal` for form state
   - Submit to `/api/forms` endpoint

2. **API route:** `src/routes/api/forms.ts`
   ```typescript
   export async function POST(event: APIEvent) {
     const body = await event.request.json();
     const { type, ...formData } = body;
     // Process form submission
     return json({ success: true });
   }
   ```

3. **Backend integration:**
   - Maintain existing MailerLite/Notion integrations
   - Port from Bunny Edge Script logic if needed

### Critical Files
- New: `src/components/forms/*.tsx`, `src/routes/api/forms.ts`

---

## Phase 7: Build Configuration & Utilities

### Actions

1. **RSS feed:** `src/routes/rss.xml.ts`
   ```typescript
   export async function GET() {
     const feed = new RSS({...});
     getAllInsights().forEach(insight => feed.item({...}));
     return new Response(feed.xml(), { headers: { "Content-Type": "application/xml" }});
   }
   ```

2. **Sitemap:** `src/routes/sitemap.xml.ts`
   - Generate static pages + dynamic insight posts
   - Return XML with proper headers

3. **Image optimization:**
   - Install `vite-imagetools`
   - Configure in `vite.config.ts`
   - Use for responsive images

4. **Vercel configuration:** `vercel.json`
   - Set buildCommand, outputDirectory
   - Configure security headers

### Critical Files
- New: `src/routes/rss.xml.ts`, `src/routes/sitemap.xml.ts`, `vercel.json`

---

## Phase 8: Testing & Deployment

### Actions

1. **Local testing:**
   ```bash
   npm run dev        # Development server
   npm run build      # Production build
   npm run preview    # Preview production build
   ```

2. **Test critical paths:**
   - Homepage loads with carousel
   - Directory page filters 100+ builders correctly
   - Insights page sorts and filters
   - Forms submit successfully
   - Mobile menu works
   - All routes accessible

3. **Deploy to Vercel:**
   - Push to staging branch first
   - Verify staging deployment
   - Push to production branch

---

## Project Structure

```
rebuild-web-solidstart/
├── src/
│   ├── routes/                    # Pages (file-based routing)
│   │   ├── index.tsx
│   │   ├── directory.tsx
│   │   ├── insights/
│   │   │   ├── index.tsx
│   │   │   └── [slug].tsx
│   │   ├── api/
│   │   │   └── forms.ts
│   │   └── [other pages].tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── interactive/
│   │   │   ├── DirectoryFilter.tsx
│   │   │   ├── InsightsFilter.tsx
│   │   │   ├── Carousel.tsx
│   │   │   └── FormSidebar.tsx
│   │   ├── forms/
│   │   │   └── [form components].tsx
│   │   └── ui/
│   │       └── [reusable components].tsx
│   ├── data/
│   │   ├── builders.ts
│   │   ├── site.ts
│   │   └── [static JSON files]
│   ├── lib/
│   │   ├── collections.ts
│   │   ├── dateFormat.ts
│   │   └── categoryColors.ts
│   ├── content/
│   │   └── insights/*.mdx
│   ├── styles/
│   │   └── main.css
│   └── entry-server.tsx
├── public/                        # Static assets
├── app.config.ts                  # SolidStart config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # TailwindCSS config
└── package.json
```

---

## Key Conversion Patterns

| Eleventy/Vanilla JS | SolidStart/Solid.js |
|---------------------|---------------------|
| `{% if condition %}` | `<Show when={condition}>` |
| `{% for item in items %}` | `<For each={items()}>` |
| `{{ variable }}` | `{variable()}` |
| `class Component { this.state = ... }` | `const [state, setState] = createSignal(...)` |
| `this.setState(); this.render()` | `setState(value)` (auto-renders) |
| `addEventListener("click", fn)` | `<button onClick={fn}>` |
| `onMount() { ... }` | `onMount(() => { ... })` |
| `.querySelector()` manipulation | Reactive JSX |
| Nunjucks macros | Solid components with props |

---

## Verification Steps

After completing all phases:

1. **Build verification:**
   ```bash
   npm run build
   # Check .output/public/ contains all pages
   # Verify no build errors
   ```

2. **Functionality tests:**
   - ✅ Directory page filters 100+ builders without performance issues
   - ✅ Insights page sorts alphabetically and by recency
   - ✅ Carousel auto-rotates every 7 seconds
   - ✅ Keyboard navigation works (arrow keys on carousel)
   - ✅ Mobile menu toggles on small screens
   - ✅ Forms open in sidebar and submit successfully
   - ✅ All links work (internal navigation + external links)

3. **SEO verification:**
   - ✅ Meta tags present on all pages
   - ✅ Sitemap generates at `/sitemap.xml`
   - ✅ RSS feed generates at `/rss.xml`
   - ✅ Social share images work

4. **Performance:**
   - ✅ Lighthouse score > 90 on homepage
   - ✅ Directory filtering < 50ms for 100 items
   - ✅ Page load time comparable to current site

5. **Deployment:**
   - ✅ Vercel build succeeds
   - ✅ Environment variables configured
   - ✅ Production site accessible at rebuild.net
   - ✅ No console errors in production

---

## Rollback Plan

- Keep existing Eleventy site running on current branch
- Deploy SolidStart to staging URL first (e.g., `next.rebuild.net`)
- Parallel run for 1 week before DNS switch
- Vercel allows instant rollback if issues arise

---

## Critical Files Reference

**Source files to migrate:**
- `/home/user/rebuild-web/.eleventy.js` (build config)
- `/home/user/rebuild-web/src/_includes/layouts/base.njk`
- `/home/user/rebuild-web/src/_includes/components/header.njk`
- `/home/user/rebuild-web/src/_includes/components/footer.njk`
- `/home/user/rebuild-web/src/scripts/directory-filter.js` (293 lines)
- `/home/user/rebuild-web/src/scripts/insights-filter.js` (186 lines)
- `/home/user/rebuild-web/src/scripts/carousel.js` (179 lines)
- `/home/user/rebuild-web/src/scripts/form-triggers.js` (61 lines)
- `/home/user/rebuild-web/src/_data/builders.js`
- `/home/user/rebuild-web/src/_data/site.js`
- `/home/user/rebuild-web/src/index.html`
- `/home/user/rebuild-web/src/pages/*.html` (14 pages)
- `/home/user/rebuild-web/src/styles/main.css`
- `/home/user/rebuild-web/tailwind.config.js`

**New SolidStart structure:**
- All TypeScript/TSX files in new `rebuild-web-solidstart/` directory
- Maintains same public asset structure
- Preserves TailwindCSS configuration and classes
