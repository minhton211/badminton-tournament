# Friendly Badminton Tournament — requirements register

Last reviewed: 2026-09-25

This file records the must-have behavior agreed during development conversations and the actual status of the current codebase. “Implemented” means it is available end-to-end; “Partial” means the backend or a portion of the UI exists, but the full organizer/public workflow does not.

## Current product decisions

- Players and Elo are **tournament-local**, not persistent across events.
- Every entrant has an organizer-assigned `startingElo`; no implicit 1000 default is used for imports.
- Elo updates after completed **Singles** matches only, including Singles playoffs. Doubles uses entrant Elo for team balancing but must not update individual Elo.
- Playoff qualification and tie resolution are organizer decisions. Standings are informational and must not automatically choose qualifiers.
- Entrant management and all tournament mutations require organizer authentication. Public visitors can view live tournament information and Elo.
- New storage uses schema version 3. Earlier version-2 data is intentionally treated as a fresh store rather than migrated inaccurately.

## Must-have requirements and status

| Requirement | Status | Current implementation / remaining work |
| --- | --- | --- |
| Create, list, activate, feature, and complete tournaments | Partial | Backend supports lifecycle and featured events. The current organizer screen lists/creates events but does **not** expose activate, feature, or complete actions. |
| Organizer login and server-side protection | Implemented | `/organizer` shows a password login; API mutations call `requireOrganizer`; sessions are signed HTTP-only cookies. |
| Tournament-local entrants and Elo | Implemented | `Tournament.players` owns `startingElo` and current `elo`; rebuilding ratings never reads another tournament. |
| Fresh start for old global-Elo data | Implemented | Only store version 3 is accepted; any older payload normalizes to an empty store. |
| Import roster from a headed CSV | Implemented | File import requires `name,elo`; preview validates names, duplicates, and non-negative integer Elo before server import. |
| Paste roster without a header | Implemented | The organizer can paste one `Name,Elo` row per line, preview/edit it, then import; no `name,elo` row is required. |
| Edit imported entrant name and starting Elo before results | Partial | The secured `editPlayer` API supports it, but the current organizer table is read-only after import and needs edit controls restored. |
| Prevent entrant replacement after setup has begun | Implemented | Import is blocked once any division has entrants, teams, fixtures, or results. |
| Configure tournament court count and Elo formula | Implemented | Organizer UI exposes court count and K factor/rating scale/margin weight; settings lock after the first result. |
| Add Singles/Doubles round-robin divisions | Implemented | Organizer configures group count, slots per group, and playoff size. |
| Register entrants and assign draw slots | Implemented | A registration matrix feeds Singles player slots and manual Doubles pair slots. |
| Build Doubles teams | Implemented | Organizers form pairs directly in Doubles draw slots. |
| Generate fixtures and assign courts safely | Implemented | Placeholder round-robin fixtures become schedulable only after their slots are complete. |
| Enter, hold, and move match results from organizer UI | Missing | API supports `result`, `hold`, and `move`, but the organizer UI currently has no live-match/result controls. This blocks operating a tournament end-to-end. |
| Automatically update standings, Elo, bracket, and queue after a result | Partial | Backend recalculates these values and exposes match Elo deltas. It cannot currently be triggered through the organizer UI because result entry is missing. |
| Singles-only Elo; no individual Elo change from Doubles | Implemented | `rebuild` skips Doubles matches; tests verify a completed Doubles match preserves all player Elo values. |
| Public Elo view with starting/current/change | Partial | Public page has a collapsible “Show Elo” section with the required values. It should be promoted to a real tab alongside divisions to match the agreed UX. |
| Public standings, groups, playoffs, live courts, and match history | Partial | Public views render these payloads. Playoffs/history work when backend data exists; no organizer UI currently completes scores or creates playoffs. |
| Organizer chooses every playoff qualifier and seed order | Partial | API validates an ordered, full qualifier list and creates playoffs from it. The organizer UI has no qualifier selection/reordering or create-playoff controls. |
| Tie-breaks never auto-decide qualification | Implemented | Qualification API requires an explicit ordered list. Standings sorting is display-only. |
| Complete tournament becomes read-only | Implemented | Backend guards mutations when lifecycle is `completed`; UI also disables controls where exposed. |
| Concurrency-safe storage and local-development fallback | Implemented | Vercel Blob writes use ETag retries; local JSON is used without a Blob token outside production. |

## Priority implementation plan

1. Restore the organizer operations panel: active/featured/completed lifecycle actions, live match list, score entry, hold/move, and confirmation feedback.
2. Complete division operations: display/edit generated doubles teams, manually select and order playoff qualifiers, create playoff brackets, and render bracket progression in organizer view.
3. Restore entrant editing before first result, including visible validation feedback; keep the successful CSV/paste import path unchanged.
4. Make “Elo” a first-class public tab next to division tabs rather than a separate collapsed section.
5. Add end-to-end browser or route tests for the organizer workflow: import/paste → configure → group entrants → fixtures → results → qualification → playoffs → completion. Extend unit tests for lifecycle and qualifier ordering.
6. Update `README.md` to remove superseded global-Elo, fixed-format, and automatic-qualification language, and document the CSV/paste workflow.

## Verification baseline

- `npm run typecheck` passes.
- `npm test` passes, including tournament-local Elo isolation, Doubles non-updating Elo, and validation unit tests.
- Production build was previously verified after the rating-model changes; rerun `npm run build` after the remaining organizer UI restoration.
