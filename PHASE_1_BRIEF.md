# Phase 1 Brief — SolidStart rebuild on Risved (feature parity)

Standalone brief for executing Phase 1. Pairs with `REBUILD_PLATFORM_TRANSITION_PLAN.md` (§Phase 1) and `AGENTS.md`. Written to be run solo, one step at a time, verifying before moving on.

## Goal
Rebuild the current rebuild.net exactly as it behaves today — in server-rendered SolidStart, deployed to a Risved **staging** subdomain. **No new features.** Still reads Notion + the JSON data files; forms still hit the existing Bunny Edge / MailerLite / Notion backends. The live Eleventy site stays untouched and in production the whole time.

## Guardrails (what Phase 1 does NOT do)
- ❌ No DNS change (that's Phase 2). ❌ No Postgres/database (Phase 3). ❌ No auth (Phase 4). ❌ No CMS (Phase 5).
- ✅ Server preset, staging only, feature parity, reversible at any moment.

## What changed vs. the old `SOLIDSTART_MIGRATION_PLAN.md` (important — don't follow the old doc blindly)
The old 8-phase doc is superseded on three points. If you or Claude Code reference it, override these:
1. **Server preset, not static.** Old doc used `preset: "static"` + prerender. Use **`preset: "node-server"`** — auth in Phase 4 needs a live runtime, and we're not deploying to Vercel.
2. **Deploy to Risved/Hetzner, not Vercel.** Everywhere the old doc says Vercel, it's now Risved on a Hetzner box.
3. **Build the block registry during the rebuild.** New requirement (reorderable components). Convert repeating page sections into registered blocks (see plan §4).
Everything else about Phase 1 (Notion still the directory source, forms unchanged) is as the old doc describes.

---

## Step 0 — Prep & inventory (do this before writing any code)

**0a. Risved smoke test.** Create the Risved account, connect a throwaway repo, and deploy a bare `npm create solid` hello-world with the node-server preset. Confirm it builds and serves.
→ *Verify:* the hello-world is reachable at a Risved URL over HTTPS.

**0b. Capture current DNS now.** In Cloudflare, export/screenshot every record for rebuild.net — A/AAAA, CNAME, **MX, SPF, DKIM, DMARC**, TXT — and note the current Cloudflare nameservers. Save as `compliance/dns-current.md` (or similar).
→ *Verify:* you have a complete record list and the nameservers written down. (This is Phase 2 insurance, captured cheaply now.)

**0c. Inventory the current site.** List every page/route, every component, every client script, every data file, and every form. Confirm against the live site (the docs may have drifted). Note specifically:
- Exact page list + their URLs (for the redirect map).
- The real RSS path (`/feed.xml` or `/rss.xml`?).
- The five forms and which backend each hits.
- The data files: `builders.js` (Notion), `site.js`, `carousel.json`, `events.json`, `gatherings.json`, `jobs.json`, `programmes.json`, `splashImages.js`, plus `insights/` and `journal/` markdown.
→ *Verify:* a written inventory exists; it's the checklist you'll rebuild against and the source of the redirect map.

---

## Step 1 — Scaffold SolidStart (server preset)
Scaffold with TypeScript + Tailwind. Set `app.config.ts` to the node-server preset:
```ts
import { defineConfig } from "@solidjs/start/config";
export default defineConfig({ server: { preset: "node-server" } });
```
→ *Verify:* `npm run build` produces a node server output (not a static-only `dist/`); `npm run dev` serves locally.

## Step 2 — Assets & styling
Copy `public/*`, `styles/main.css`, and `tailwind.config.js` from the Eleventy repo. Get global styles rendering.
→ *Verify:* a blank page shows the correct fonts/colours/background.

## Step 3 — Layout, Header, Footer
Convert `base.njk` → `Layout.tsx`, `header.njk` → `Header.tsx` (mobile menu via `createSignal`, nav from `site` config), `footer.njk` → `Footer.tsx`. Meta via `@solidjs/meta`.
→ *Verify:* layout, nav (incl. mobile toggle), and footer match the live site on desktop and mobile.

## Step 4 — Block registry + repeating sections
Stand up `src/components/blocks/` + `registry.ts` and render pages' repeating sections (hero, previews, carousel, feature grids) as registered blocks via `<Dynamic>` (plan §4).
→ *Verify:* at least the homepage renders from an ordered block array; reordering blocks in data reorders the page.

## Step 5 — Data layer (sources unchanged)
Port each data source, keeping Notion + JSON exactly as today:
- `builders.js` → `src/data/builders.ts` (server/build-time Notion fetch **with the cache fallback**; status = "Published" only).
- `site.js` → typed `src/data/site.ts`. JSON files → typed imports. `insights/`/`journal/` markdown → MDX.
→ *Verify:* directory shows the same count as live; insights/journal lists match; nav/config identical.

## Step 6 — Interactive components
Rebuild as Solid components with signals/memos: directory filter, insights filter, carousel (autoplay + keyboard nav), form sidebar overlay.
→ *Verify:* directory filters 100+ entries smoothly; insights sort/filter; carousel autoplays + arrow keys; sidebar opens/closes.

## Step 7 — Forms (reuse existing backends)
Wire the five forms (`newsletter`, `builder-promo`, `builder-application`, `gathering-invitation`, `application-rebuild1`) to the **existing** Bunny Edge / MailerLite / Notion endpoints. Do **not** rebuild the backend.
→ *Verify:* each form validates client-side and submits successfully to its current backend (test with a real submission).

## Step 8 — SEO & URL preservation gate (plan §1.7)
- Build the **redirect map** from the Step 0c inventory; 301 anything whose URL changed.
- Canonical tags correct; `sitemap.xml` + RSS generate (at the confirmed path); meta/OG tags on every page.
- **Staging is `noindex`** (flip to indexable only at Phase 2 cutover).
→ *Verify:* redirect map complete and tested; canonicals correct; sitemap/RSS validate; staging returns `noindex`.

## Step 9 — Deploy to Risved staging & parallel-run
Deploy to a staging subdomain (e.g. `next.rebuild.net`). Set env vars in Risved (encrypted): `NOTION_TOKEN`, `NOTION_BUILDERS_DB_ID`, Bunny CDN vars, Pirsch, MailerLite, `VITE_SITE_URL` (staging). Run it in parallel against the live site for ~1 week.
→ *Verify:* every acceptance-criteria item below passes on staging.

---

## Acceptance criteria (phase is done only when ALL pass, on staging)
- [ ] Every page renders at parity with the live site (desktop + mobile).
- [ ] Directory filters 100+ entries without lag; insights sort/filter; carousel autoplay + keyboard nav; mobile menu.
- [ ] All five forms submit successfully to their existing backends.
- [ ] RSS + sitemap generate at the correct paths; meta/OG tags present everywhere.
- [ ] Redirect map complete and tested; canonicals correct; **staging is `noindex`**.
- [ ] Lighthouse ≥ 90 on the homepage; load time comparable to live.
- [ ] Notion cache fallback works (site still builds if Notion is down).
- [ ] No console errors.

## Rollback
Nothing to roll back — the live Eleventy site is untouched on its current host throughout. If Phase 1 is abandoned, staging is simply discarded. Zero production impact.

## Solo-execution notes
- Work in small commits, one step at a time; don't start a step until the previous one verifies.
- Good place to lean on Claude Code: the mechanical Nunjucks→JSX conversions (Steps 3–6) and the redirect map. Hand it one step at a time with this brief's verify line as the acceptance test.
- Decisions only you should make: the block breakdown (which sections become which blocks), and confirming form behaviour matches.
