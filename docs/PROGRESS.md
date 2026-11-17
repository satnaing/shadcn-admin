# admin2 — progress

Independent copy of the v1 shell (never import from `../admin`). Mock-first (`VITE_API_MOCK=1`), dev server **http://localhost:5180** (strict port).

## Stages (task/admin/prompts/03)
| Stage | Status |
|---|---|
| A. Front analysis (`docs/front-analysis.md`) | **done** |
| B. Shell | **done** |
| C1 Dashboard · C2 Pages · C3 Blogs · C4 Themes · C5 Modules · C6 Settings · C7 Role & Permission | **done** (03) |
| 03b mock writes, server-side tables, editors, variants, language/currency, disabled menu items, browser walkthrough | **done** |
| 04 module migration (one module per session) | **14 modules done** (qrcode-event … seller-package); core groups (catalog, orders, customers, …) remain — see `task/admin/08-admin2-status-and-remaining.md` |

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

- Module menu items without a route render disabled with a "soon" badge (03b); the `/admin/$` splat is only a fallback.
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

## Module #2 `refund` (2026-11-15)
Folder = pilot layout (`src/features/refund/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/refund.api.ts`, `src/mocks/refund.{data,routes}.ts`, `public/locales/*/refund.json`, `docs/aec-diff/refund.md`). Routes: `/admin/refund`, `/disputes`, `/reasons`, `/categories`, `/settings` (5). Detail/pay/reject are dialogs (AEC uses modals too).

### Pattern changes (read before the next module)
| Change | Why |
|---|---|
| `components/forms/form-input-field.tsx`, `form-select-field.tsx` (shared RHF fields; copies of the pilot's `qr-*-field`) | every module needs them; the pilot's `qr-*` copies can be migrated later (not touched here) |
| `components/data-table/select-column.tsx` (`selectColumn(selectAll, selectRow)`) | `EntityDataTable` only enables selection state; bulk tables need the checkbox column |
| Toolbar filters need a **column id** per filter: add hidden filter-only columns (`defaultColumnVisibility`) or the table logs `Column with id '…' does not exist` | seen on `/refund/categories` |
| Numeric-looking search params (`?main=1`) are parsed by the router as numbers → use `z.coerce.string()` in the route schema | otherwise the filter is dropped (URL shows `"1"`, works) |
| New module needs its icon in `api/adapters/menu.adapter.ts` `ICONS` | unknown icons fall back to Package |
| The extras placeholder row for the module id must be removed from `mocks/modules.extra.ts` when its manifest is registered | avoids a duplicate card |
| `merge-sidebar.node.test.ts` no longer hard-codes the module list (derives it from `menuFor`) | every migrated module would break it |
| One kind-aware list hook per module (`useRefundList(kind, params)`) instead of two hooks both fetching | avoids a wasted request |

### Verification (Chrome, dev :5198, console tracked from first navigation)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/refund` (tabs, 10 rows/page, detail dialog) | ✅ | 0 | n/a |
| `/disputes`, `/reasons`, `/settings` | ✅ rendered with data | 0 | n/a |
| `/categories` | ✅ after fix (first run logged 28× missing-column errors; hidden filter columns + coerced params fixed them; `?main&unassigned` → 1 row) | 0 | n/a |
| Offline pay: empty submit → "required"; with TRX id → toast, row leaves Pending tab | ✅ | 0 | n/a |
| Reject: preset list shows active Russian presets, "Others" shows textarea, confirm → toast, row leaves Pending | ✅ | 0 | n/a |
| Reasons: create (AZ only) → appears first, toast | ✅ | 0 | n/a |
| Category days: edit 14→21 saved | ✅ | 0 | n/a |
| Modules: toggle off + save → sidebar group gone; SPA navigation to `/admin/refund/reasons` → 404 page | ✅ | 0 | n/a |
Not clicked live: wallet "Refund now" confirm, dispute pay/reject, reason edit/delete/bulk activate, bulk category days, settings save, sticker picker (node tests cover the mock layer). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 104 node tests pass (13 new in `refund.node.test.ts`), `tsc -b` clean, eslint 0 errors (2 `watch()` compiler warnings like the pilot).

## Module #3 `preorder` (2026-11-16)
Folder = pilot layout (`src/features/preorder/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/preorder.api.ts`, `src/mocks/preorder.{data,orders,routes}.ts`, `public/locales/*/preorder.json`, `docs/aec-diff/preorder.md`). 13 routes: `/admin/preorder` (dashboard), `/products`, `/products/new`, `/products/$id`, `/orders`, `/orders/$id`, `/commissions`, `/conversations`, `/queries`, `/reviews`, `/faqs`, `/notifications`, `/settings`. AEC source tree is `D:\www\aec` (not `public_html`).

### Pattern additions
| Change | Why |
|---|---|
| `components/forms/form-switch-field.tsx`, `form-textarea-field.tsx`, `form-image-field.tsx` (shared RHF fields) | every module form needs them |
| `hooks/use-<m>-action.ts`: one `use<M>Action(fn, toastKey, onDone?)` wrapper (invalidate module key + toast) instead of hand-written `onSuccess` per mutation; large mutation sets split by area (`use-preorder-order-mutations.ts`) | keeps the files under the `max-lines` lint limit |
| Server-filter tab bar `PreorderTabs` (URL param + optional counts) | scope/stage/owner/state tabs; copy for the next module that needs it (refund has its own `RefundTabs`) |
| Dialog-style detail for small entities (thread, query, reviews, FAQ, notification type), page routes only for list/detail workflows and big forms | AEC uses separate pages for these; dialogs are faster |
| A tall form = stacked `PreorderFormSection` cards (no tabs) | validation errors never hide in an inactive tab |
| Bulk bar needing a per-list option: build the component per option and `useMemo` it (`makeOrdersBulkActions(scope)`) — never create a component inside render | `EntityDataTable` only passes `{table}` |

### Verification (Chrome, dev :5199)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/preorder` (14 cards, sales chart lazy, top products) | ✅ | 0 | n/a |
| `/orders` (scope + stage tabs with counts; Delayed deposits → 4 rows) | ✅ | 0 | n/a |
| `/orders/1`: accept "Deposit" through the dialog → badge Accepted, toast | ✅ | 0 | n/a |
| `/products` (switches, filters), `/products/new` (empty submit → 3 field errors, 6 sections), `/products/1` | ✅ | 0 | n/a |
| `/commissions`, `/conversations`, `/queries`, `/reviews`, `/faqs`, `/notifications`, `/settings` | ✅ rendered with data | 0 | n/a |
| FAQ create (dialog) → row appears; conversation reply; query answer (pending 8 → 7); review hide/show switch; settings save; notification dialog opens | ✅ | 0 | n/a |
| Modules: toggle off + save → sidebar group gone; `/admin/preorder/faqs` → 404 page | ✅ | 0 | n/a |
Not clicked live: product create/edit save, bulk order delete / reminders, step deny with shipping proof, invoice download, notification save, route-by-route direct reload of every URL (they were reached by SPA navigation except dashboard/orders/detail/products/new). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 20 files / 131 node tests pass (27 new in `preorder*.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #4 `affiliate` (2026-11-16)
Folder = pilot layout (`src/features/affiliate/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/affiliate.api.ts`, `src/mocks/affiliate.{data,routes}.ts`, `public/locales/*/affiliate.json`, `docs/aec-diff/affiliate.md`). 6 routes: `/admin/affiliate` (configuration), `/form`, `/users`, `/referrals`, `/withdraws`, `/logs`. Verification, payout, payment history and withdraw reject are dialogs. AEC source tree is `D:\www\aec`.

### Pattern additions
| Change | Why |
|---|---|
| `AffiliateList` (title + optional tab bar + server-side `EntityDataTable`, driven by `kind`) + one kind-aware `useAffiliateList(kind, params)` + typed `ListItemMap` in the api file | four list screens share everything except columns; each page file is only its columns + dialogs |
| `AffiliateOptionCard` (card + RHF form + save, read-only without the `config_manage` permission via `usePermissionStore`) | several independent settings cards on one screen, each with its own save; cards are keyed by their own server data so a refetch after another card's save does not reset unsaved edits |
| In-cell permission checks with `PermissionGuard` (switch → read-only badge, action buttons hidden) instead of passing `canX` props through the table | same approach as `FlagSwitch` in preorder |
| Dialog that needs fetched data renders its form only after the data arrives (`PayForm` mounts with `user`) | the zod schema depends on the fetched balance (`payoutSchema(max)`), so the form must be created with the final limit |
| `useAction(fn, toastKey)` mutation wrapper (invalidate module key + toast), one hook returning all mutations | same as preorder's `use-<m>-action` |

### Verification (Chrome, dev :5200)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/affiliate` (4 cards), `/form`, `/users`, `/referrals`, `/withdraws`, `/logs` (10 rows each) | ✅ reached by SPA navigation | 0 | n/a |
| Users: Pending tab (5) → verification dialog → Accept → toast, row leaves Pending (4) | ✅ | 0 | n/a |
| Users: Pay dialog (due amount + PayPal e-mail), empty submit → "required" on method, Bank → "Payment recorded", balance → 0.00 | ✅ | 0 | n/a |
| Withdraws: Pending tab (6), pay dialog with fixed amount, reject confirm → toast, row leaves Pending (5) | ✅ | 0 | n/a |
| Registration form: add "Select" field, empty save → label + choices errors | ✅ | 0 | n/a |
| Config: min withdraw 20 → 45 saved; enabling product sharing turns category-wise off | ✅ | 0 | n/a |
| Modules: toggle Affiliate off + save → sidebar group gone, `/admin/affiliate/users` → 404 | ✅ | 0 | n/a |
Not clicked live: withdraw pay confirm, payment history with rows, category commission edit, registration form save with valid data, verification Reject, approval switch from the list, route-by-route hard reload (sweep used SPA navigation). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 21 files / 147 node tests pass (16 new in `affiliate.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #5 `club-point` (2026-11-16)
Folder = pilot layout (`src/features/club-point/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/club-point.api.ts`, `src/mocks/club-point.{data,routes}.ts`, `public/locales/*/club_point.json`, `docs/aec-diff/club-point.md`). 3 routes: `/admin/club-point` (earnings, lines dialog), `/products` (range card + all-products card + table + edit dialog), `/config`. Namespace is `club_point` (snake) while the module id / URL is `club-point`. AEC source tree is `D:\www\aec`.

### Pattern additions
| Change | Why |
|---|---|
| `ClubPointFormCard` takes the write `permission` as a prop (copy of `AffiliateOptionCard`) | the same card serves screens with different `_manage` permissions; the card is read-only without it |
| Hand-written `Edit` of generated files is not needed: `routeTree.gen.ts` is regenerated by starting `vite` (the `tsr generate` CLI fails here) | new module routes appear in the tree only after the dev server has run once |
| Bulk write answers `{message, data:{updated}}`; the shared `useAction` toasts `{{count}}` | UI tells how many rows a range / all update touched |

### Verification (Chrome, dev :5201)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/club-point` (status tabs, 10 rows/page, lines dialog of order #202611100) | ✅ | 0 | n/a |
| `/products` (16 products, range + all cards, table) | ✅ | 0 | n/a |
| Range: min 300 > max 100 → "Maximum price must not be below the minimum"; min 300 max 400 → toast "Points updated for 1 products", only the 399 product changed | ✅ | 0 | n/a |
| Product edit dialog: -3 → "Must be 0 or more"; 88 → saved, row shows 88 | ✅ | 0 | n/a |
| All products × 0.5 → toast "16 products", 449.00 → 224.5 | ✅ | 0 | n/a |
| `/config`: 0 → "Must be greater than 0"; 250 saved | ✅ | 0 | n/a |
| Modules: toggle Club points off + save → sidebar group gone, `/admin/club-point/products` → 404; on again → group back (3 links) | ✅ | 0 | n/a |
Not clicked live: lines dialog for an order with a deleted product, earnings status tabs / search, sort by column, role without `_manage` (read-only cards). Console was read after the flows (tracking starts on first read), no errors; fresh-load sweep of each URL not repeated. Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 22 files / 162 node tests pass (15 new in `club-point.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #6 `courier` (2026-11-16)
Folder = pilot layout (`src/features/courier/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/courier.api.ts`, `src/mocks/courier.{data,routes}.ts`, `public/locales/*/courier.json`, `docs/aec-diff/courier.md`). Replaces the old `delivery-boy` placeholder (`modules.data.ts`, `PERMISSIONS.DELIVERY_BOYS`, `deliveryBoy*` nav keys). 10 routes: `/admin/courier`, `/new`, `/$id`, `/payments`, `/collections`, `/cancel-requests`, `/config`, `/deliveries` (`?tab=` stages), `/cash`, `/earnings`. Admin and courier-panel screens live in one module; the courier role (panel `courier`) sees only its own items.

### Pattern additions
| Change | Why |
|---|---|
| `CourierList` + `ListItemMap` / `CourierListKind` in `data/courier.type.ts`, `courierApi.list(kind)` | one generic list shell for 7 tables (same as affiliate), typed per kind |
| `FormInputField` accepts `type='email' \| 'password'` | create/edit forms need them (additive) |
| Cascading selects: reset children from `form.watch` callback, only when `type === 'change'` | prefilled edit must not reset the region |
| Use `useWatch` instead of `form.watch()` in components (React Compiler warning) | keeps eslint at 0 warnings |
| `use_*` mutation toasts: `created/saved/collected/paid` | one `useAction` wrapper, refetch all module queries |

### Verification (Chrome, dev :5202, console tracked after first navigation)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| 8 menu routes (couriers, payments, collections, cancel requests, config, deliveries, cash, earnings) | ✅ rendered with data | 0 | n/a |
| Collect cash: over-limit → "Cannot be more than…"; 100 → balance 592.50 → 492.50 | ✅ | 0 | n/a |
| Create: empty submit shows all required errors; country→state→city lists only children; save → first row | ✅ | 0 | n/a |
| Ban + confirm → "Banned" badge | ✅ | 0 | n/a |
| Deliveries stage tab, request cancel + confirm → appears in cancel requests | ✅ | 0 | n/a |
| Config: commission saved (toast), latitude 95 → "valid coordinate" error | ✅ | 0 | n/a |
| Edit `/courier/3`: all fields and region prefilled | ✅ | 0 | n/a |
| Modules: toggle off + save → sidebar group gone, `/admin/courier/payments` → 404 | ✅ | 0 | n/a |
Not clicked live: edit save, unban, pay dialog, pay/collect history rows after write, notification/pickup card save, settle dialog with zero balance (shows "Nothing to settle" but the submit button remains). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.

## Module #7 `pos` (2026-11-17)
Folder = pilot layout (`src/features/pos/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/pos.api.ts`, `src/mocks/pos.{data,routes}.ts`, `public/locales/*/pos.json`, `docs/aec-diff/pos.md`). Replaces the `pos` placeholder in `modules.data.ts` (keys `posTerminal`, `posOrders`, `posProducts` kept, `posConfig` added). 4 routes: `/admin/pos` (terminal), `/orders`, `/products`, `/config`. Admin and seller panel share the screens (seller role = same routes, permission filtered; `pos.activation_manage` is admin only). AEC source tree is `D:\www\aec`.

### Pattern additions
| Change | Why |
|---|---|
| `components/forms/form-card.tsx` (shared `FormCard`: card + RHF form + save, read-only without the write permission, `labels` prop) | third copy of `AffiliateOptionCard` / `ClubPointFormCard` / `CourierFormCard`; the old copies are untouched (PM may migrate them) |
| Stateless terminal: cart, customer, shipping and discount live in the browser (`use-pos-cart`, `use-pos-customer`, pure rules in `data/pos-cart.ts`, `data/pos-payload.ts`), ONE `POST /admin/pos/orders` places the order | AEC kept them in PHP session + `carts` table; fewer endpoints, nothing to sync |
| `useInfiniteQuery` + "Load more" for the catalogue grid (16 per page) | AEC behaviour; data-table is the wrong tool for a card grid |
| Pure logic split from React so it can be tested in node (`pos.logic.node.test.ts`) | cart rules, totals and payload are the money part |
| Toolbar filters on a table whose column is displayed differently: hidden filter-only columns (`categoryFilter`, `sellerFilter`) | the visible `category` column shows a name, the filter value is an id |
| `BulkActions` that needs a callback from the table owner: `useCallback` wrapper component at the owner | `EntityDataTable` only passes `{table}` |

### Verification (Chrome, dev :5203, console tracked)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/pos` terminal (16 cards, filters, Load more present) | ✅ | 0 | n/a |
| Walk-in order: add to cart, empty "Place order" → phone/address errors, fix → summary dialog → Offline: empty submit → "required"; with method → toast "Order … placed", cart + customer reset | ✅ | 0 | n/a |
| Registered order: phone search (≥3 chars) → customer → 2 addresses → "New address" dialog (country → state lists only its children) → saved + auto selected → COD → order placed | ✅ | 0 | n/a |
| Place order without address → toast "Select a customer and a shipping address" | ✅ | 0 | n/a |
| `/orders` (tabs All / Paid / Unpaid, new orders first) | ✅ rendered with data | 0 | n/a |
| `/products` (filters, sort, row remove with confirmation → toast, row gone; Import dialog → add → card appears on the terminal) | ✅ | 0 | n/a |
| `/config`: width 8 → "between 30 and 300 mm"; 58 → "Saved" | ✅ | 0 | n/a |
| Modules: toggle POS off + save → sidebar group gone; SPA navigation to `/admin/pos/orders` → 404 page | ✅ | 0 | n/a |
Not clicked live: cash payment, bulk remove from the products table, category / seller toolbar filters, tab filters on orders, receipt print (toast action + row button), seller activation switch, quantity +/- and discount / shipping inputs beyond defaults, seller role view, route-by-route hard reload (reached by SPA navigation except `/admin/pos`). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 26 files / 207 node tests pass (25 new in `pos.node.test.ts` and `pos.logic.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #8 `otp` (2026-11-17)
Folder = pilot layout (`src/features/otp/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/otp.api.ts`, `src/mocks/otp.{data,routes}.ts`, `public/locales/*/otp.json`, `docs/aec-diff/otp.md`). Replaces the `otp` row of `mocks/modules.extra.ts`. 4 routes: `/admin/otp` (3 switches), `/gateways` (9 provider cards), `/templates` (table + edit dialog), `/bulk-sms`. AEC source tree is `D:\www\aec`. 

### Pattern additions
| Change | Why |
|---|---|
| Data-driven credential forms: `data/otp.gateways.ts` (`GATEWAY_FIELDS` per provider) + `gatewaySchema(key)` builds the zod object from the field specs; one `OtpGatewayCard` renders any provider | nine provider forms differ only in field names/options; labels resolve under `gateways.fields.<name>` so shared names (`api_key`, `sender_id`) are translated once |
| Secrets masked by the API: `maskCredentials` / `mergeCredentials` (`SECRET_MASK`), sending the mask back = "unchanged" | AEC printed every key into the HTML; contract documented in `aec-diff/otp.md` |
| `FormCard` (shared) used for every settings card; the card is keyed by the stored credentials JSON, so toggling activation (a refetch) does not wipe unsaved edits | same reasoning as the affiliate option cards |
| Zod schema built from the loaded row (`templateSchema(original.body)`): the set of `[[variables]]` must stay the same | rule that depends on server data; dialog mounts only after the row is chosen |
| Server-searched multi-select (`OtpRecipientPicker`: debounced input → list of checkboxes → removable badges) | replaces AEC's "every user in one select"; reusable for other recipient pickers (no new package) |

### Verification (Chrome, dev :5204)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/otp` (3 cards), switch guest checkout on → persisted on next read | ✅ | 0 | n/a |
| `/gateways` (9 cards); empty Twilio save → 2 required errors, its activation switch disabled ("save first"); activating Vonage turned Fast2SMS off (only one `aria-checked`) | ✅ | 0 | n/a |
| `/templates` (10 rows, always-sent badges, search "password" → server filter); edit dialog: text without the variable → "must stay exactly as in the original", valid text saved and row updated | ✅ | 0 | n/a |
| `/bulk-sms`: empty submit → recipient + text errors; search "Rauf" → pick → badge → send → toast, form reset | ✅ | 0 | n/a |
| Modules: toggle OTP & SMS off + save → sidebar group gone; SPA navigation to `/admin/otp/gateways` → 404 page | ✅ | 0 | n/a |
Not clicked live: saving valid gateway credentials (node tests cover mask / merge / exclusivity), template switch in the table, template id field, sort by columns, recipients beyond one result, read-only view without `_manage` permissions. Screens were reached by hard navigation (the screenshot lags the first paint, waited 5 s) except the 404 check (SPA). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 27 files / 224 node tests pass (17 new in `otp.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #9 `payments` (2026-11-17)
Folder = pilot layout (`src/features/payments/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/payments.api.ts`, `src/mocks/payments.{data,routes}.ts`, `public/locales/*/payments.json`, `docs/aec-diff/payments.md`). AEC addons `offline_payment` + `payriff` in one module; the two placeholder rows (`payriff`, `offline-payment`) were removed from `modules.extra.ts`. Routes (7): `/admin/payments` (manual methods), `/offline-orders`, `/wallet-requests`, `/seller-packages`, `/customer-packages`, `/payout-methods`, `/payriff`. Create / edit of manual and payout methods and the admin wallet recharge are dialogs (AEC had create / edit pages).

### Pattern additions
| Change | Why |
|---|---|
| `PaymentsTabs` (generic): tab list from a const array, first = default (no `?tab=`), labels from `<prefix>.<tab>`; the tab is a server filter | `RefundTabs` was refund-specific; offline orders and wallet requests both need it |
| One kind-aware page / hook for two lookalike lists (`PaymentsPackagesPage kind="seller" \| "customer"`, `usePaymentsPackages(kind, p)`) | same shape, two endpoints; avoids a copy |
| `useFieldArray` inside a dialog for repeatable rows (`PaymentsBankRows`) | bank accounts of a `bank_payment` method |
| Bulk action component owns its `ConfirmDialog` (`PaymentsPayoutBulk`) | `EntityDataTable` passes only `{ table }` to `BulkActions`; an inline component would remount every render |
| Secret mask contract reused for Payriff (`payments.payriff.ts`: `maskPayriff` / `mergePayriff` / `isPayriffConfigured`) | same rule as `otp`; the gateway card is keyed by the stored JSON |
| Server-searched single picker (`PaymentsCustomerPicker`, 2+ characters, debounced) | sibling of `OtpRecipientPicker` (multi); candidates for a shared component once a third one appears |
| Wallet approval is idempotent in the mock (`POST …/wallet-requests/approve {ids}` skips approved rows) | AEC credited twice on a repeated single approve |

### Verification (Chrome, dev :5205, console tracked from the first navigation of the walk)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/payments` (7 rows, thumbnails, bank-account count), create dialog: Bank payment without rows → "Add at least one bank account", add account + save → row on top | ✅ | 0 | n/a |
| `/offline-orders`, `/seller-packages`, `/customer-packages`, `/payout-methods`, `/payriff` | ✅ rendered with data | 0 | n/a |
| `/wallet-requests?tab=pending`: select two rows → "Approve selected (2)" → rows leave the tab; recharge dialog: empty submit → 3 errors, server search "Ays" → pick → 40 + `ADM-777` → toast, row on top of "Recharged by admin" (Admin / Approved) | ✅ | 0 | n/a |
| Seller package: first "Approve" → toast, pending count 7 → 6 | ✅ | 0 | n/a |
| Payout methods: delete → confirmation text names the method → row gone (8 → 7) | ✅ | 0 | n/a |
| Payriff: switch mode to Production + Save with empty live keys → two "required" errors | ✅ | 0 | n/a |
| Modules: toggle Payments off + save → sidebar group gone; SPA navigation to `/admin/payments/payout-methods` → 404 page | ✅ | 0 | n/a |
Not clicked live: manual-method edit and delete, payout create / edit / bulk delete, customer-package approve, saving valid Payriff credentials and the activation switch (node tests cover mask / merge / activation rules), the wallet / order tabs other than Pending, column sorting, the read-only view of a role without the `_manage` permissions, receipt links. The first part of the walk ran before console tracking started (the tool begins capturing on its first call). Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 28 files / 240 node tests pass (16 new in `payments.node.test.ts`), `tsc -b` clean, eslint 0 errors (11 pre-existing warnings).

## Module #10 `ai` (2026-11-17)
Folder = pilot layout (`src/features/ai/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/ai.api.ts`, `src/mocks/ai.{data,routes}.ts`, `public/locales/*/ai.json`, `docs/aec-diff/ai.md`). AEC core "AI" (Gemini content) + addon `ai_translate` in ONE module; replaces the `ai-tools` placeholder row of `modules.extra.ts`. 4 routes: `/admin/ai` (two settings cards), `/prompts`, `/usage` (`?kind=content|translation`, `?from=&to=`), `/translate`. The product-form "Generate with AI" button and the two-link hub page are not built (catalog module, see aec-diff §1 #6/#7).

### Pattern additions
| Change | Why |
|---|---|
| `components/data-table/date-range-filter.tsx` (`DateRangeFilter`, labels as props, `?from=&to=` in the URL) | shared version of `PreorderDateRange`; the preorder copy is untouched |
| Column hooks must list `t` (from `useTranslation(ns)`) in the `useMemo` deps | `translatedColumnHeader` calls `t('ns:key')` with the default namespace; a lazily loaded module namespace shows raw keys in the headers until the columns are rebuilt |
| i18n keys never contain dots: model ids → `models.gemini-2_5-flash` via `modelKey()` | i18next reads `.` as nesting |
| Long-running client loop (`useAiTranslateRun`): one idempotent request per page, `stop` ref, result state (`done / stopped / failed / disabled / no_key`) | AEC "Translate All"; the admin can stop and re-run |
| API "soft errors" modelled as `data.state` (AEC answered `result:false` with HTTP 200) | the mock has no error path; the UI shows a localised reason |
| `CardAction` (not `flex-row` on `CardHeader`) to put a button at the right of a card title | shadcn `CardHeader` is a grid |
| Number inputs (`FormInputField type='number'`) cannot be typed negative (the `-` becomes `0`); minimums are enforced by the schema and node tests | known shared-component limit, untouched |

### Verification (Chrome, dev :5206)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/ai`: two cards, keys masked; seller limit 777 saved ("Saved") | ✅ | 0 | n/a |
| `/admin/ai/prompts`: edit dialog; text without all variables → "Keep the variables exactly…"; valid text saved and shown | ✅ | 0 | n/a |
| `/admin/ai/usage`: content (24 rows, 3 cards), Translation tab (18 rows, 4 cards), date 15.11 → 2 rows and stats follow | ✅ after fix (headers showed raw keys until `t` was added to the column deps) | 0 | n/a |
| `/admin/ai/translate`: Turkish run → bar 100 %, "Finished: 197 strings translated", button disabled | ✅ | 0 | n/a |
| Modules: AI toggle off + save → sidebar group gone, SPA navigation to `/admin/ai/prompts` → 404 page | ✅ | 0 | n/a |
Not clicked live: translation settings card save, model selects, Google engine, stop button mid-run, the `disabled` / `no_key` / `failed` results (node tests cover the mock; the run hook has no test), content/translation sort by column, pagination beyond page 1, role without `ai.*_manage` (read-only cards), hard reload of each URL after the first. Console was read after the flows. Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 29 files / 257 node tests pass (17 new in `ai.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #11 `classified` (2026-11-17)
Folder = pilot layout (`src/features/classified/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/classified.api.ts`, `src/mocks/classified.{data,routes}.ts`, `public/locales/*/classified.json`, `docs/aec-diff/classified.md`). Routes: `/admin/classified` (listings), `/admin/classified/packages` (cards). The placeholder manifest in `modules.data.ts` was replaced by the real one; `PERMISSIONS.CLASSIFIED` now has 5 keys (`index`, `publish`, `delete`, `packages`, `packages_manage`).

### Pattern additions
None. Used as-is: shared `selectColumn`, `ConfirmDialog` for single and bulk delete, `EntityFormDialog` + `FormInputField` / `FormImageField` for the package dialog, rows from `createCollection`. Offline payment requests of customer packages stay in `payments` (cross-referenced in the aec-diff).

### Verification
| Check | Result |
|---|---|
| `tsc -b`, eslint (module, mocks, api), 30 files / 267 node tests (10 new in `classified.node.test.ts`) | ✅ |
| Dev server `:5207` (VITE_API_MOCK=1) served both route modules, all components, mock routes and locale files with HTTP 200 and no Vite errors; `routeTree.gen.ts` regenerated by vite | ✅ |
| Chrome walk-through of the routes, switches, delete/bulk dialogs, package dialog, module toggle | ❌ not done: the Chrome extension was not connected in this session |

## Module #12 `wholesale` (2026-11-17)
Folder = pilot layout (`src/features/wholesale/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/wholesale.api.ts`, `src/mocks/wholesale.{data,routes}.ts`, `public/locales/*/wholesale.json`, `docs/aec-diff/wholesale.md`). Routes: `/admin/wholesale` (list with `?owner=all|inhouse|seller&seller=` tabs), `/admin/wholesale/new`, `/admin/wholesale/$id`. The placeholder manifest in `modules.data.ts` (routes `/admin/wholesale-products*`, keys `wholesale.index|create`, panels admin+seller) was replaced; `PERMISSIONS.WHOLESALE` now has the 6 AEC keys (`index`, `inhouse`, `sellers`, `create`, `edit`, `delete`). Source of the web controller/blades is `D:\www\prielaz\priel-az` (`D:\www\aec` only has the routes, API controllers and the unit-fix addon).

### Pattern additions
| Change | Why |
|---|---|
| `components/forms/form-section-card.tsx` (`FormSectionCard`: titled card for one section of a long form page) | every long product form needs it; preorder keeps its own copy (`PreorderFormSection`), untouched |
| Owner/permission tabs (`WholesaleOwnerTabs` + `useOwnerTabs` hook): one list, tab = URL param, tab hidden without its own permission | AEC had three menu items for three permissions; hook lives in `hooks/` (a hook next to a component trips `react-refresh/only-export-components`) |
| Server sort is **whitelisted** in the mock (`SORTABLE`) and the aec-diff says the API must do the same | AEC passed `?type=col,dir` straight into `orderBy` |
| Array field with `useFieldArray` + schema-level `superRefine` for cross-row rules (min ≤ max, no overlap) and root error rendered below the rows | price bands |

### Verification (Chrome, dev :5208, console tracked from the first navigation)
| Route / flow | Result | Console errors | ≥400 |
|---|---|---|---|
| `/admin/wholesale` (All tab, 10 rows, owner/price/rating/bands/stock/Low badge/4 switches) | ✅ | 0 | n/a |
| Sellers tab (`?owner=seller`): Approved column appears; Approved switch on → saved | ✅ | 0 | n/a |
| Edit page `/admin/wholesale/2`: all sections filled from the record (general, price, stock, 3 bands, categories + main, shipping, options) | ✅ | 0 | n/a |
| `/admin/wholesale/new`: empty Save → required errors for name, unit, base price, band price, categories, main category | ✅ | 0 | n/a |
| Delete: confirm dialog, row leaves the list | ✅ | 0 | n/a |
| Modules: one Wholesale card; toggle off + save → sidebar group gone, SPA navigation to `/admin/wholesale/new` → 404 | ✅ | 0 | n/a |
Not clicked live: create save with valid data, edit save, band add/remove and overlap error, seller filter, In-house tab, sort by column, bulk delete, the Low badge row's flows, role without `wholesale.edit` (read-only badges), hard reload of each URL. Create/update/flag/delete/bulk and every schema rule are covered by node tests on the mock layer. Mock adapter bypasses XHR → no network ≥400 data. Playwright suite not run.
Tests: 31 files / 281 node tests pass (14 new in `wholesale.node.test.ts`), `tsc -b` clean, eslint 0 errors.

## Module #13 `map-provider` (2026-11-17)
Folder = pilot layout (`src/features/map-provider/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/map-provider.api.ts`, `src/mocks/map-provider.routes.ts`, `public/locales/*/map_provider.json`, `docs/aec-diff/map-provider.md`). One route: `/admin/map-provider` (two cards: map settings, default location). The placeholder row `map-provider` in `modules.extra.ts` was removed; `PERMISSIONS.MAP_PROVIDER` = `index`, `manage`; icon `MapPin` registered in `menu.adapter.ts`. `google-one-tap` is not part of this target (user decision). Source: `D:\www\aec\addons\map_provider` (README, controller, blades).

### Pattern additions
None. Shared `FormCard` / `FormSwitchField` / `FormSelectField` / `FormInputField`; secrets use the otp mask contract (`maskKeys` / `mergeKeys`, own small copy in `data/map-provider.secrets.ts`). Two cards on one page are keyed by their own stored values so saving one never wipes unsaved edits in the other.

### Verification
| Check | Result |
|---|---|
| `tsc -b`, eslint (module, mocks, api, route), 32 files / 291 node tests (10 new in `map-provider.node.test.ts`) | ✅ |
| Dev server `:5209` (VITE_API_MOCK=1) served the route module, page, mock routes and index with HTTP 200 and no Vite errors; `routeTree.gen.ts` regenerated by vite | ✅ |
| Browser walk-through (route, save flows, module toggle) | ❌ not done on purpose: the user asked for no browser verification |

## Module #14 `seller-package` (2026-11-17)
Folder = pilot layout (`src/features/seller-package/{data,hooks,components}`, `module.manifest.ts`, `src/api/modules/seller-package.api.ts`, `src/mocks/seller-package.{data,routes}.ts`, `public/locales/*/seller_package.json`, `docs/aec-diff/seller-package.md`). One route: `/admin/seller-package` (card grid; create/edit are one dialog, delete a confirm dialog). No placeholder row existed in `modules.extra.ts`; `PERMISSIONS.SELLER_PACKAGE` = `index`, `create`, `edit`, `delete` (AEC's four staff permissions); icon `Crown` registered in `menu.adapter.ts`. Source: `D:\www\aec\addons\seller-subscription-addon`. Offline payment requests stay in Payments (`/admin/payments/seller-packages`).

### Pattern additions
None. Closest copy of `classified` packages (card grid + dialog). Form field keys live in `data/seller-package.type.ts` arrays (`EXTRA_LIMITS`, `FEATURE_FLAGS`) so the form, defaults and edit mapping share one list; the preorder limit field/line shows only while `useModuleEnabled('preorder')`.

### Verification
| Check | Result |
|---|---|
| `tsc -b`, eslint (module, mocks, api, route), 33 files / 302 node tests (11 new in `seller-package.node.test.ts`) | ✅ |
| Dev server `:5210` served the page, dialog, card, limits fields, mock routes, route module and locale JSON with HTTP 200, no Vite errors; `routeTree.gen.ts` regenerated by vite | ✅ |
| Browser walk-through (route, dialog saves, module toggle) | ❌ not done on purpose: the user asked for no browser verification |

## Prompt 05 — cleanup + sweep (2026-11-17)
Details: `docs/sweep-2026-11-17.md`.
- Checks (PowerShell `D:\`): `tsc -b` ✅ · `eslint` 0 errors / 12 warnings · `npm run build` ✅ · `test:node` 33 files / 302 tests ✅. Browser-mode `npm test` still not run (port 63315 in use / hangs).
- Route sweep: 95 hard reloads + 92 router navigations + 77 sidebar clicks (admin), seller (8 links) and courier (6 links): 0 console errors, 0 error pages.
- Module toggle: 14/14 (group disappears, URL 404, comes back). Dependency dialog not testable with the current seed (all `requires` are locked core modules).
- Write flows clicked live: seller-package, classified, map-provider, wholesale, qrcode-event, preorder, courier, payments, affiliate (pay), otp, ai (10/14 modules; refund disputes not drivable, pos / club-point not repeated).
- Fixed: `FormImageField` swallowed its validation message (silent failed save); numeric search params dropped by `z.string().catch` (qr batches/codes/logs, blogs).
- Added: collapsible sidebar group headers (user request).

## Prompt 06 — shared components (2026-11-17)
Details: `docs/shared-components.md`. TagInput, EntityPicker, MediaPicker (`/admin/media` mock), RichTextEditor (TipTap), MapPicker (Leaflet) in `src/components/shared/`; existing forms switched over (see doc). Packages added: `@tiptap/*`, `leaflet`, `react-leaflet`, `@types/leaflet`. Small fixes: seller seed rights, i18n namespace preload, dev mock persistence (`?mockReset=1`). Checks: tsc, eslint (0 errors), build, 321 node tests.
