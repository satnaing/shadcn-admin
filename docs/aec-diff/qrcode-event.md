# aec-diff — qrcode-event (AEC addon `qrcode_event` → admin2 module `qrcode-event`)

Date: 2026-11-15 · Sources: AEC `D:\www\aec\addons\qrcode_event` (`routes/qrcode_event.php`, `controllers/QrCodeEventController.php`, `views/qrcode_event/**`, `sql/update.sql`), v1 `admin/src/features/qrcode-events` (1 file, 322 lines, static tables, no actions).
Out of scope (public/frontend): `public/check.blade.php`, `/qr/{code?}`, `/qr-check`, `/.well-known/*` (served by the API; only their identifiers are edited in Settings).

## 1. AEC screens (step 1)
| # | Blade | Route (name) | HTTP | Controller method | Inputs (name · type · rule) | Modal / partial |
|---|---|---|---|---|---|---|
| 1 | `index` | `/admin/qrcode-event` (`qrcode_event.index`) | GET | `index` | `campaign_id` (select, optional) | stats cards, prize breakdown, 30-day chart |
| 2 | `settings` | `/qrcode-event/settings` | GET / POST | `settings` / `updateSettings` | `qrcode_event_android_package`, `qrcode_event_android_sha256`, `qrcode_event_ios_team_id`, `qrcode_event_ios_bundle_id` (text, free) | – |
| 3 | `campaigns/index` | `/campaigns` | GET | `campaigns` | – | row actions: edit, prizes, create batch, status switch (`GET /campaigns/{id}/status/{status}`), delete (`GET …/delete`) |
| 4 | `campaigns/form` | `/campaigns/create`, `/campaigns/{id}/edit` | GET / POST | `campaignCreate/Store/Edit/Update` | `name` req max191 · `slug` · `status` req in draft,active,paused,finished · `prize_delivery` req in manual,wallet · `starts_at`,`ends_at` datetime · `code_prefix` ≤6 normalised · `require_login` bool · `max_checks_per_hour` (30) · `max_failed_per_hour` (10) · `block_minutes` (60) · `description` · `terms` · `banner` (image) | – |
| 5 | `prizes/index` | `/campaigns/{campaign}/prizes` | GET / POST | `prizes`, `prizeStore`, `prizeUpdate`, `prizeDestroy` | `type` req cash,product,gift · `title` req max191 · `value` (cash) · `quantity` req int ≥1 · `product_ids[]` required_if product · `description` · `image` · `sort_order` | create + edit modal, delete |
| 6 | `batches/index` | `/batches` | GET | `batches` | – | row actions: export (xlsx/csv), QR zip, codes |
| 7 | `batches/form` | `/batches/create` | GET / POST | `batchCreate`, `batchStore` | `campaign_id` req exists · `quantity` req 1–200000 · `prize_allocation[prizeId]` · `product_id` · `note` | – |
| 8 | `codes/index` | `/codes` | GET | `codes`, `codesExport`, `codeToggle` | filters `campaign_id`,`batch_id`,`status`,`winner` (1/0),`prize_id`,`date_from`,`date_to`,`search` | enable/disable row action, export |
| 9 | `codes/show` | `/codes/{id}` | GET / POST | `codeShow`, `codeToggle`, `codeClaim` | `claim_note` (≤255) | claim form, last 50 checks |
| 10 | `logs` | `/logs` | GET | `logs`, `logsExport` | filters `campaign_id`,`result`,`ip`,`search`,`date_from`,`date_to` | export |
Permissions in AEC: `qrcode_event_configuration` (1–5), `qrcode_event_codes` (6–9), `qrcode_event_reports` (10, exports).

## 2. Screen status (step 4)
| Screen | v1 | v2 now |
|---|---|---|
| 1 Stats | yox | tam (`/admin/qrcode-event`) |
| 2 Settings | yox | tam (`/settings`) |
| 3 Campaigns list | natamam (columns only, no actions, no filters, client-side) | tam (`/campaigns`) |
| 4 Campaign form | yox | tam (`/campaigns/new`, `/campaigns/$id`) |
| 5 Prize pool | yox | tam (`/campaigns/$id/prizes`) |
| 6 Batches list | natamam (no export/QR zip) | tam (`/batches`) |
| 7 Batch form | yox | tam (`/batches/new?campaign_id=`) |
| 8 Codes list | yox | tam (`/codes`) |
| 9 Code detail | yox | tam (`/codes/$id`) |
| 10 Scan log | natamam (user/prize columns, no result/ip filters, no export) | tam (`/logs`) |
**AEC 10 screens: tam 0 · natamam 3 · yox 7 (v1) → tam 10 / 10 (v2).**

## 3. Field diff (screen · AEC field · v1 · v2 name · type · diff · action)
| Screen | AEC field | v1 | v2 (our name, D11) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| campaign | `name` | `title` | `name` | string ≤191 | v1 renamed wrongly | kept AEC meaning, `name` |
| campaign | `status` enum | `is_active` bool | `status` draft/active/paused/finished | enum | v1 wrong (lost 3 states) | rebuilt |
| campaign | `starts_at`/`ends_at` | `start_date`/`end_date` | `starts_at`/`ends_at` | datetime | name | D11 `*_at` |
| campaign | `require_login` | – | `is_login_required` | bool | missing; D11 `is_` | added |
| campaign | `prize_delivery` | – | `prize_delivery` manual/wallet | enum | missing | added |
| campaign | `max_checks_per_hour`, `max_failed_per_hour`, `block_minutes` | – | same | int ≥1 | missing | added (abuse limits block) |
| campaign | `description`, `terms`, `banner`, `slug`, `code_prefix` | `code_prefix` only | same | text/image | missing | added |
| campaign | `prize_pool_amount` (v1 only) | yes | – | – | **artıq** — AEC has no such column (derive from prizes) | dropped |
| prize | all (`type,title,value,quantity,product_ids[],description,image,sort_order`) | – | same (`product_ids` array) | see schema | missing screen | added; `allocated_count`/`claimed_count` read-only counters |
| batch | `quantity`, `product_id`, `note`, `prize_allocation[]` | `batch_name`,`generated_count` | `quantity`,`product_id`,`note`,`prize_allocation` | int/record | v1 `batch_name` not in AEC (**artıq**) | rebuilt; sum(allocation) ≤ quantity validated client-side |
| batch | export xlsx/csv, QR zip | `download_url` link | actions → API returns `{download_url, filename}` | file | v1 static | added |
| code | filters (8) | – | `?campaign_id&batch_id&status&winner&prize_id&date_from&date_to&q` | query | missing | added (server-side) |
| code | toggle, claim (`claim_note`) | – | `PATCH /codes/:id/toggle`, `POST /codes/:id/claim` | action | missing | added |
| log | `result` enum (7), `ip`, `source`, `user`, `code_input` | `user_phone`,`prize_title`,`prize_amount` | `result`,`ip`,`source`,`user_name`,`code_input` | enum | v1 columns not in log table (**artıq**) | rebuilt; prize info lives on the code |
| settings | 4 business_settings | – | `android_package`,`android_sha256`,`ios_team_id`,`ios_bundle_id` | string | missing | added (`GET/PUT /settings`) |
| stats | counts + prize breakdown + 30-day chart | – | `GET /stats?campaign_id` | object | missing | added (lazy recharts) |

## 4. Naming / permissions
- Module id `qrcode-event`; routes `/admin/qrcode-event/**`; API prefix `/admin/qrcode-event/*`; permission group `qrcode_event` (single tree): `index, settings, campaigns, campaigns_manage, batches, batches_create, codes, codes_manage, logs` (AEC 3 coarse permissions → 9; `logs` also guards exports, as AEC `reports`).
- AEC GET-with-side-effect routes (`/status/{s}`, `/delete`, `/toggle`) become `PATCH`/`DELETE` (CSRF-safe).

## 5. Performance
Every list is server-side (`?q&page&per_page&sort` + filters), debounced search, stats chart lazy-loaded; export links are generated server-side (no client row loading). Big batches (≤200 000) are generated by the API (mock materialises ≤40 rows).

## 6. Open questions for API / PM
1. Export endpoints return `{data:{download_url, filename}}` — API must produce a signed URL (queued for >10k rows?).
2. `prize_allocation` validation (`sum ≤ quantity`, per-prize remaining) is repeated server-side; error shape = Laravel 422 `errors.prize_allocation`.
3. Wallet prize delivery (`prize_delivery=wallet`) credits the wallet module — does `qrcode-event` then `requires: ["wallet"]`? Not declared yet (wallet module not defined).
4. Product prizes reference catalogue products: mock `GET /qrcode-event/products`; real API should reuse the catalogue search endpoint.
5. Prizes edit: AEC `prizeUpdate` forbids `quantity < allocated_count` — API rule, not enforced in the mock.
