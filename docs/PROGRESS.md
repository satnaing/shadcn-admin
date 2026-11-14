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
