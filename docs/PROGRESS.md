# admin2 — progress

Independent copy of the v1 shell (never import from `../admin`). Mock-first (`VITE_API_MOCK=1`), dev server **http://localhost:5180** (strict port).

## Stages (task/admin/prompts/03)
| Stage | Status |
|---|---|
| A. Front analysis (`docs/front-analysis.md`) | **done** |
| B. Shell | **done** |
| C1 Dashboard · C2 Pages · C3 Blogs · C4 Themes · C5 Modules · C6 Settings · C7 Role & Permission | **done** (03) |
| 03b mock writes, server-side tables, editors, variants, language/currency, disabled menu items, browser walkthrough | **done** |
| 04 module migration (one module per session) | in progress — pilot `qrcode-event` |

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
- Module menu items without a route render disabled with a "soon" badge (03b); the `/admin/# admin2 — progress

Independent copy of the v1 shell (never import from `../admin`). Mock-first (`VITE_API_MOCK=1`), dev server **http://localhost:5180** (strict port).

## Stages (task/admin/prompts/03)
| Stage | Status |
|---|---|
| A. Front analysis (`docs/front-analysis.md`) | **done** |
| B. Shell | **done** |
| C1 Dashboard · C2 Pages · C3 Blogs · C4 Themes · C5 Modules · C6 Settings · C7 Role & Permission | **done** (03) |
| 03b mock writes, server-side tables, editors, variants, language/currency, disabled menu items, browser walkthrough | **done** |
| 04 module migration (one module per session) | in progress — pilot `qrcode-event` |

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
 splat is only a fallback.
- Mock adapter bypasses XHR: no network-level (≥400) data is collectable in dev.
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
| Banners: edit / delete / drag reorder / server search typing | ✅ | 0 | n/a | delete now asks for confirmation (fixed) |
| Banner deal/features/perks/schedule persist on reopen | ✅ | 0 | n/a | |
| Header: mobile tab bar edit persists; no variant select (1 variant) | ✅ | 0 | n/a | |
| Footer: paymentMethods add row + save persists | ✅ | 0 | n/a | |
| Menu tree drag-drop | ❌→✅ | 0 | n/a | dropping a node on the next sibling was a no-op; fixed `fc7df5b`; order persists |
| Topbar, Tokens (edit + persist), Custom code (edit + persist) | ✅ | 0 | n/a | contrast warning not triggered with the sample colour |
| Pages: list, create from template (3 sections), revisions drawer | ✅ | 0 | n/a | restore was a no-op in the mock; fixed `729bf5d` (mock trims to the revision's section count — no snapshots) |
| Builder: Layers (drag reorder, hide), Page tab, undo/redo, duplicate, delete | ✅ | 0 | n/a | |
| Builder: palette click-add + palette drag-drop, field edit → canvas live, RU payload, Source/Style tabs, Publish | ✅ | 0 | n/a | Preview opens mock `/preview/:id` page (fixed) |
| Blog categories: create/edit/delete | ❌→✅ | 0 | n/a | save silently failed when EN name was empty (error hidden on EN tab); form now jumps to the tab with the error `e63129b` |
| Blogs: create persists, server search | ✅ | 0 | n/a | |
| Blog list | ❌→✅ | 1 (fixed) | n/a | `<img src="">` for posts without cover; `cfde882` |
| Modules: dependency dialog (POS off → Delivery boys), toggle + save, sidebar updates | ✅ | 0 | n/a | |
| Modules: zip dialog (dummy 2 KB zip injected via DataTransfer; 4 validation steps), update, delete | ✅ | 0 | n/a | upload dialog closes after success; update badge is a working button (fixed) |
| Settings: default language RU → UI switches to Russian | ✅ | 0 | n/a | Georgian has no UI locale |
| Settings: default currency USD | ⚠ | 0 | n/a | saved, but no core screen shows money, so formatter reaction not visible live |
| Roles: create (group select-all) / edit dialog opens | ✅ | 0 | n/a | |
| Sweep (fresh load each): /admin, pages, builder, blogs ×4, themes ×8, modules, settings, roles, permissions | ✅ 19/19 | 0 after fixes | n/a | |

## Module migration pattern (set by the pilot `qrcode-event`, 2026-11-15)
One module = one session. Copy this layout; deviations go to the PM.

| Piece | Where | Rule |
|---|---|---|
| Manifest | `src/features/<module>/module.manifest.ts` exports `Omit<ModuleRaw,'enabled'>` (id kebab-case, name, icon, version, `required`, `requires[]`, `admin_menu` = ONE group named after the module + ordered sub-items with `route` + `permission`) | registered in `src/mocks/modules.data.ts` as `{ ...manifest, enabled: true }` (this also feeds `GET /admin/modules` and `GET /admin/menu`) |
| Permissions | group in `src/shared/permissions.ts`: `PERMISSIONS.<MODULE>` with keys `<module_snake>.<action>` (`index`, `<screen>`, `<screen>_manage` …), exactly `Object.values` = manifest permissions; no `*_own` | tested |
| Folder | `data/` (types, zod schemas) · `hooks/` (`use-<m>.ts` queries + keys, `use-<m>-mutations.ts`) · `components/` (`<prefix>-*.tsx`, one exported component per file, ≤150 lines) · `index.ts` (public exports) | API client in `src/api/modules/<module>.api.ts`; endpoints in `src/api/endpoints.ts` |
| Routes | `src/routes/_authenticated/admin/<module>/**`; every route body is `<XRouteGuard permission=…>` = `ModuleGuard` (module enabled → else 404) + `PageGuard` | `ModuleGuard` / `useModuleEnabled` live in `components/guard` + `hooks`; list routes use `createListSearchSchema({ filters… })` (now generic, typed keys) |
| Mocks | `src/mocks/<module>.data.ts` (seed 10–30 rows) + `<module>.routes.ts` (default-export route map, `createCollection` per table, `paginate(rows(...))` with cloned rows, counts computed on read, lists/detail `{data}` envelope, writes visible on next GET) | picked up by the `*.routes.ts` glob |
| Tables | `EntityDataTable` + `toServerListParams(search, { filters })`; extra filters live in the URL (`QrListFilters` pattern) | server does q/sort/page |
| i18n | `public/locales/{az,en,tr,ru}/<module_snake>.json` + sidebar labels in `nav.json` (group key + item keys) + roles label in `roles.json` | key parity tested |
| Validation messages | zod `message` = i18n key; `FormMessage` resolves `common:validation.<key>` or `ns:key` | |
| Downloads | API returns `{download_url, filename}`; UI does `window.location.assign` (no DOM access) | mock uses a blob URL |
| Docs | `docs/aec-diff/<module>.md` (AEC screens table, status tam/natamam/yox, field diff, open questions) | |
| Tests (`npm run test:node`, PowerShell `D:\`) | manifest ↔ permission tree ↔ nav keys, menu hides when disabled, mock shapes + in-memory writes, locale parity | see `src/features/qrcode-event/qrcode-event.node.test.ts` |

Disable test: Modules → toggle off → Save → sidebar group disappears and the module's URLs render 404 (`ModuleGuard`), verified live for `qrcode-event`.

### Pilot `qrcode-event` — verification (Chrome, dev :5197, console tracked from first navigation)
| Route | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/qrcode-event` (stats: 8 cards, chart, prize table) | ✅ | 0 | n/a |
| `/campaigns`, `/campaigns/new`, `/campaigns/$id/prizes`, `/batches`, `/batches/new?campaign_id=1`, `/codes`, `/codes/4`, `/logs`, `/settings` | ✅ rendered with data | 0 | n/a |
| Module toggle off → save | ✅ sidebar group gone, route → 404 | 0 | n/a |
| `/campaigns/$id` (edit form) | rendered, field values not asserted | 0 | n/a |
Not clicked through live: campaign create/edit save, prize dialog save, batch generate, claim dialog, export download (covered by node tests on the mock layer only). Mock adapter bypasses XHR → no network ≥400 data.
