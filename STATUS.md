# Rebuild Platform — Status

_Last updated: 2026-09-09_

## Where we are
**Phase 0 (architecture + planning) is complete. Starting Phase 1 (SolidStart rebuild).**
Authoritative plan: `REBUILD_PLATFORM_TRANSITION_PLAN.md`. Agent conventions: `AGENTS.md` / `CLAUDE.md`.

## Locked decisions (quick reference)
- **Framework:** SolidStart, **server preset** (not static).
- **Hosting:** Hetzner via Risved. **DNS:** Cloudflare → Bunny (registration stays at GoDaddy).
- **DB:** Scaleway Managed PostgreSQL + Drizzle. **Auth:** Better Auth, magic-link, invite-only.
- **Email:** Scaleway TEM. **Media:** Bunny Storage. **CMS (later):** Decap. **Analytics:** Pirsch now, Umami optional later.
- **Curation:** Drizzle Studio (solo) → Directus (team/PII, from Phase 4) → optional custom admin later.

## Phase status
| Phase | What | Status |
| --- | --- | --- |
| 0 | Decisions + plan | ✅ Done |
| 1 | SolidStart rebuild on Risved, feature-parity, still Notion+forms | ▶️ **In progress** |
| 2 | DNS cutover to Bunny + domain → Risved | ⬜ Pending |
| 3 | Postgres + migrate directory off Notion | ⬜ Pending |
| 4 | Auth (Better Auth, invite-only, profiles, association, registration, badges) | ⬜ Pending — Rebuild 2 target |
| 5 | Decap CMS for editorial | ⬜ Deferred |

## Immediate next steps (Phase 1 — see `PHASE_1_BRIEF.md`)
1. Create Risved account, connect the repo, confirm a hello-world SolidStart deploys.
2. Capture current Cloudflare DNS records now (cheap insurance for Phase 2).
3. Inventory the current site (pages, components, scripts, data, forms) → this feeds the redirect map.
4. Scaffold SolidStart with the **server preset**, port assets, rebuild feature-by-feature.

## Open items (from plan §9)
1. Platform-association rigor (self-serve vs approval).
2. Event-registration fields (reuse gathering form vs streamlined).
3. Who administers invites.
4. Scaleway PG sizing / HA before Rebuild 2.
5. Notion retirement confirmation post-Phase 3.
6. Which external datasets feed badge matching.

## Needs confirmation
- Current live-site inventory: has rebuild.net changed since the docs were written (page/component count, RSS path `feed.xml` vs `rss.xml`, any new pages/forms)?
