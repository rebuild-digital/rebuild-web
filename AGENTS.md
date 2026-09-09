# AGENTS.md

Conventions for any AI agent (Claude Code, etc.) working in this repository. Read this first, every session. The authoritative plan is `REBUILD_PLATFORM_TRANSITION_PLAN.md`.

## What this project is
The Rebuild platform: a directory of European social platforms plus, increasingly, an app with invited user accounts. Being rebuilt from Eleventy to **server-rendered SolidStart**, moved to **European self-hosted infrastructure**, and given **user accounts**. It is intended to be open-sourced and reskinned by others, so keep everything legible and self-hostable.

## Stack (do not substitute without a decision record)
- **Framework:** SolidStart (SolidJS), **server preset (Nitro/node-server)** — never the static preset (auth needs a runtime).
- **Hosting:** Hetzner via Risved (git-push deploys).
- **DB:** Scaleway Managed PostgreSQL, accessed via **Drizzle** (typed schema + migrations).
- **Auth:** Better Auth, **magic-link**, **invite-only** (no public signup).
- **Email:** Scaleway TEM. **DNS:** Bunny. **CDN/media:** Bunny Storage. **CMS (later):** Decap.

## The two data planes (never conflate)
- **Plane A — editorial content** (insights, page copy): lives as Markdown/YAML in git, edited via Decap. Renders through the block registry.
- **Plane B — application data** (users, platforms/directory, taxonomy, associations, registrations, badges): lives in Postgres via Drizzle.
- The **directory is Plane B** (Postgres), not CMS content.

## Hard rules
1. **Public vs internal columns.** Tables carry `[public]` and `[internal]` fields. Server load functions and APIs return **only the fields the page needs** — never whole rows. The public directory returns public columns only; **never** expose contact PII, `status`, `priority`, `notes`, or any `[internal]` field to the client.
2. **PII discipline.** Never log emails, tokens, or magic-link URLs (log user *ids*). No PII in analytics event props. See plan §7.
3. **TLS to DB** (`sslmode=require`). App connects with the **scoped app role**, not the master DB user.
4. **Block components live in code** (`src/components/blocks/` + `registry.ts`); the CMS only references them. Pages are ordered arrays of typed blocks rendered via `<Dynamic>`.
5. **Media:** store files in Bunny Storage, store only URLs in Postgres. Never persist expiring third-party (e.g. Notion) file URLs.
6. **Additive & reversible.** New tables, feature flags, staging first. Don't do destructive changes without a rollback path.
7. **Deletes cascade** across user-owned tables (`profiles`, `user_platforms`, `user_badges`, `event_registrations`).

## Workflow
- Work **one phase at a time** (see the plan's phases). A phase's **Verification list is its acceptance criteria** — not done until all pass in staging.
- Small, single-purpose PRs. Don't start the next phase until the current one is verified.
- Before Phase 4 ships, the **Security/PII checklist (§7)** must be satisfied — it's a hard gate.
- Record significant choices in `docs/decisions/` (one short ADR each).

## Testing (proportionate)
Unit: pure logic (slugs, dates, block registry, migration transforms). Integration: auth/invite flows + the "no `[internal]` column leaks" guarantee. E2E (Playwright): home/directory + invite→login→edit→register. Test the things that would be *quietly wrong* (PII leaks, auth gates, migration data loss).

## Verify current docs before trusting sketches
Schema and config in the plan are **sketches**. For Better Auth (now under new ownership) and Directus, check the current official docs before implementing.
