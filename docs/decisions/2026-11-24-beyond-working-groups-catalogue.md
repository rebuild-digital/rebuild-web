# /beyond working groups live in a Notion catalogue, with approval

**Date:** 2026-11-24 · **Status:** accepted

## Context
People who choose "Other" on the /beyond contribution form propose a new working group with a name and a description. Once accepted, a proposed group should become a choice on the form. Before this change the list was hardcoded in the page and in the edge script.

## Decision
- The list lives in a Notion database, the "working groups catalogue" (`NOTION_INDUSTRY_ORG_GROUPS_DB_ID`), with Status `Proposed | Approved | Declined`.
- **Approval required.** A proposal is created as `Proposed`, and only `Approved` groups are shown. The form is public and has no login, so publishing straight away would invite spam.
- **Exposure: on request, not on a schedule.** The Bunny edge script serves the approved groups at `GET /api/industry-org-working-groups`, returning only name and description. It caches the list for 5 minutes per instance. The form refreshes its cards from that endpoint in the browser, so a group appears within about 5 minutes of approval, with no rebuild. Each build also bakes the current list into the HTML (`src/_data/workingGroups.js`), so the form works without JavaScript. That file also has a built-in list for when the endpoint isn't available.
- Contributions keep storing the group **name** in their `Working group` select. Notion creates new select options on first use. We chose not to switch to a relation property, so existing rows and views don't need migrating.

## Consequences
- Michael edits group names and descriptions in Notion, not in code.
- Renaming an approved group doesn't rename it on earlier contributions, because those store the name as plain text.
- If the catalogue isn't configured, the form and the handler fall back to the built-in list, and proposals are stored only as text on the contribution.
