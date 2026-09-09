# CLAUDE.md

**Start here, then read `AGENTS.md` (canonical conventions) and `REBUILD_PLATFORM_TRANSITION_PLAN.md` (the authoritative plan).**

This file is intentionally short: all project conventions live in `AGENTS.md` so there's a single source of truth. Below is only what's specific to working as Claude Code here.

## How to work in this repo
- **One phase at a time.** The plan is phased (1→5) and sequenced so each changes one variable. Do not jump ahead or bundle phases.
- **Acceptance criteria = the phase's Verification list.** Treat it as pass/fail. Show it's met (tests, screenshots, or a checklist) before opening the PR.
- **Small PRs, describe intent, wait for review.** Prefer many small changes over one large one.
- **Ask before assuming** on the plan's open items (§9) — especially platform-association rigor, event-registration fields, and which datasets feed badge matching.

## Non-negotiables (full detail in AGENTS.md §Hard rules)
- SolidStart **server preset**, never static.
- Never leak `[internal]`/PII columns to the client; return only the fields a page needs.
- Never log emails/tokens; log user ids.
- App uses the **scoped DB role**; `sslmode=require`.
- Store media in Bunny; store only URLs in Postgres.
- Deletes cascade across user-owned tables.

## Before implementing auth or CMS
Better Auth is under new ownership and Directus/Decap evolve — **check the current official docs** before writing the integration; the plan's config blocks are sketches, not verified snippets.

## When you finish a phase
Update `docs/decisions/` if a real choice was made, confirm the Verification list, and note anything that changed vs. the plan so `REBUILD_PLATFORM_TRANSITION_PLAN.md` can be kept accurate.
