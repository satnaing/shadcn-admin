# admin2 — progress

Independent copy of the v1 shell (never import from `../admin`). Mock-first (`VITE_API_MOCK=1`), dev server **http://localhost:5180** (strict port).

## Stages (task/admin/prompts/03)
| Stage | Status |
|---|---|
| A. Front analysis (`docs/front-analysis.md`) | other fork |
| B. Shell | **done** (this commit) |
| C1 Dashboard · C2 Pages · C3 Blogs · C4 Themes · C5 Modules · C6 Settings · C7 Role & Permission | placeholders only (routes exist, see below) |

## Run
`pnpm install` (via `corepack pnpm`) · `npm run dev` · `npx tsc -b` · `npx eslint .` · `npm run build` · `npm run test:node` (pure-logic tests, fast).
`npm test` (vitest browser/playwright) did not run here: port 63315 already in use / hangs — unverified.

## Where parallel work plugs in (no shared-file edits)
| What | Do this |
|---|---|
| Route + page | replace the placeholder in `src/routes/_authenticated/admin/<section>/…` (keep `PageGuard`) |
| Mock routes | new `src/mocks/<section>.routes.ts`, default-export `Record<'GET /admin/x', Handler>`; helpers in `src/mocks/helpers.ts` (`paginate`, `single`, `ok`); body is ONE `{data: X}` envelope. Unmocked list GET → empty page, unmocked detail/write → 404 |
| Permissions | append your group to `src/shared/permissions.ts` (single tree, no `*_own`) |
| i18n | new `public/locales/{az,en,tr,ru}/<ns>.json`; sidebar labels live in `nav.json` |
| Sidebar | core tree is `components/layout/data/nav.core*.ts` (fixed order); module groups come from `GET /admin/menu?panel=` (`useModuleMenu`, `mocks/modules.data.ts`). After toggling a module invalidate `MENU_KEY` (`@/hooks/use-module-menu`) |
| Headers | use `AdminHeader`; role switcher (DEV) is in the sidebar footer; cookie `admin2-auth` |

## Known gaps / shortcuts
- No route-registry check for module menu items: module routes (`/admin/pos` …) fall into the `/admin/$` ComingSoon splat.
- Copied v1 browser tests (config-drawer, confirm-dialog, password-input, sign-out-dialog, panel-guard) not re-run.
- `shared/constant.ts` ERP tree and v1 `sidebar-data.*` removed; `panels.ts` has one shell (`/admin`) for all roles.

## Prompt 03 outcome (2026-11-14)
- A (front analysis), B (shell), C1–C7 (Dashboard, Pages+builder, Blogs, Themes, Modules, Settings, Role & Permission): built, committed locally.
- Checks: `tsc -b`, `eslint` (0 errors, 5 warnings), `npm run build` green; 57 node tests pass.
- Run node tests from a path with an UPPERCASE drive letter (PowerShell `D:\...`); from Git Bash (`/d/...`) vitest fails with "reading 'config'" (module-instance mismatch).
- Browser-mode `npm test` (playwright) not verified in this environment.
- Live sweep: 25 route URLs under `/admin` + `/admin/pos` (module placeholder) — no 403/500; console errors checked only on the final stretch of the sweep.
- Not driven end to end: themes activate/banner write flows, drag-drop, builder Layers/Page tabs, revision drawer, blog category/upload dialogs.

## 03b item 7 — manual browser walkthrough (2026-11-15)
Dev server :5180, own tab, console tracked from the first navigation. The mock adapter bypasses XHR, so there are no network requests to check; "≥400" = none observed, visible error text only.

| Route / flow | Result | Console errors | ≥400 | Note |
|---|---|---|---|---|
| Themes: activate senseihost (confirm + incompatibility report, 3 items) and back to xshop | ✅ | 0 | n/a | write survives SPA navigation |
| Banners: create (deal icon/percent, features, perks, schedule) | ❌→✅ | 1 (fixed) | n/a | form crashed on empty Select option (tone); fixed `61b223e` |
| Banners: edit / delete / drag reorder / server search typing | ✅ | 0 | n/a | delete has no confirm dialog (open question) |
| Banner deal/features/perks/schedule persist on reopen | ✅ | 0 | n/a | |
| Header: mobile tab bar edit persists; no variant select (1 variant) | ✅ | 0 | n/a | |
| Footer: paymentMethods add row + save persists | ✅ | 0 | n/a | |
| Menu tree drag-drop | ❌→✅ | 0 | n/a | dropping a node on the next sibling was a no-op; fixed `fc7df5b`; order persists |
| Topbar, Tokens (edit + persist), Custom code (edit + persist) | ✅ | 0 | n/a | contrast warning not triggered with the sample colour |
| Pages: list, create from template (3 sections), revisions drawer | ✅ | 0 | n/a | restore was a no-op in the mock; fixed `729bf5d` (mock trims to the revision's section count — no snapshots) |
| Builder: Layers (drag reorder, hide), Page tab, undo/redo, duplicate, delete | ✅ | 0 | n/a | |
| Builder: palette click-add + palette drag-drop, field edit → canvas live, RU payload, Source/Style tabs, Publish | ✅ | 0 | n/a | Preview opens a blank `about:` tab (mock) |
| Blog categories: create/edit/delete | ❌→✅ | 0 | n/a | save silently failed when EN name was empty (error hidden on EN tab); form now jumps to the tab with the error `e63129b` |
| Blogs: create persists, server search | ✅ | 0 | n/a | |
| Blog list | ❌→✅ | 1 (fixed) | n/a | `<img src="">` for posts without cover; `cfde882` |
| Modules: dependency dialog (POS off → Delivery boys), toggle + save, sidebar updates | ✅ | 0 | n/a | |
| Modules: zip dialog (dummy 2 KB zip injected via DataTransfer; 4 validation steps), update, delete | ✅ | 0 | n/a | upload dialog stays open after success; "vX.Y.Z-ə yenilə" badge on the card is not clickable (update is in the card menu) |
| Settings: default language RU → UI switches to Russian | ✅ | 0 | n/a | Georgian has no UI locale |
| Settings: default currency USD | ⚠ | 0 | n/a | saved, but no core screen shows money, so formatter reaction not visible live |
| Roles: create (group select-all) / edit dialog opens | ✅ | 0 | n/a | |
| Sweep (fresh load each): /admin, pages, builder, blogs ×4, themes ×8, modules, settings, roles, permissions | ✅ 19/19 | 0 after fixes | n/a | |
