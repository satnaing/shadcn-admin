# aec-diff — refund (AEC addon `refund_system` → admin2 module `refund`)

Date: 2026-11-15 · Sources: AEC `D:\www\aec\addons\refund_system` (`routes/refund_request.php`, `controllers/RefundRequestController.php` 1134 lines, `RefundReasonController.php`, `views/refund_request/**`, `sql/*.sql`) + core `resources/views/backend/product/category_wise_refund/*`; v1 `admin/src/features/refunds` (`admin-refunds-page.tsx` 551 lines, `seller-refunds-page.tsx` 284, `refunds.type.ts`).
Out of scope: customer screens (`frontend/refund_request/*`, `sent-refund-request`, `refund-request/{id}`, `dispute-refund-request/{id}`, `request_store`, `dispute_request_store`) and **seller panel screens** (admin2 has no seller panel yet: `vendor_index`, `seller_filter`, `seller_refund_configuration`, `request_approval_vendor`, seller pay/reject/offline pay, seller category days, `frontend/recieved_refund_request/*`) → recorded, to be built with the seller panel.
Not routed by this addon (`views/refund_request/offline/*` = offline payout-method CRUD, belongs to `offline-payment`): not migrated here.

## 1. AEC admin screens (step 1)
| # | Blade | Route (name) | HTTP | Controller method | Inputs (name · type · rule) | Modal / partial |
|---|---|---|---|---|---|---|
| 1 | `index` + `table` | `/admin/refund-request-all` (`refund_requests_all`), `/refund-requests-filter` | GET | `admin_index`, `filter_refund_request` | `search` (code, order code, seller, product) · `refund_request_status` in all/admin_refunds/seller_refunds/pending/approved/rejected/wallet/offline | row: details, view order, payment info |
| 2 | `modal` / `view` | `/refund-request-view` | POST | `refund_request_view` | `refund_id`, `order_code` | detail modal: product, amount, channel, customer, reason + photos, seller/admin decision, payment info, actions |
| 3 | `view` (pay) | `/refund-request-pay` (`refund_request_money_by_admin`) | POST | `refund_pay` | `refund_id` | wallet credit (+ club-point correction, seller `admin_to_pay`), e-mails |
| 4 | `view` (offline) | `/offline-refund-request-pay` | POST | `refund_offline_pay` | `refund_id`, `trx_id` req, `photo` (receipt) | offline modal |
| 5 | `reject_refund_modal` | `/admin/reject-refund-request` | POST | `reject_refund_request` | `refund_id`, `reject_reason` req (preset select or "others" + text) | reject modal |
| 6 | `payment_info_modal` | `/payment-info-modal` | POST | `payment_info_modal` | `refund_id` | offline payment info |
| 7 | `dispute_index` + `dispute_table` | `/dispute-refund-request-all`, `/dispute-refund-requests-filter` | GET | `admin_dispute_index`, `filter_dispute_refund_request` | same filters (`admin_dispute_refunds`, `seller_dispute_refunds`) | dispute detail, pay (`/dispute-refund-request-pay`, `/offline-dispute-refund-request-pay`), reject (same reject route when `refund_status=2 && dispute_refund_status=1`) |
| 8 | `reason/index` + `table` | `/admin/refund-reason-index`, `/refund-reason-filter` | GET | `RefundReasonController@index`, `filter` | `refund_reason_type` customer_refund_reason / admin_seller_reject_refund_reason · `search` | row: edit, status switch, bulk toggle |
| 9 | `reason/create`, `edit` | `/refund-reason-store|update/{id}`, `-store-ajax` | POST | `store`, `update`, `storeAjax` | `type` req · `reason` req max120 · `lang` (translation) | – |
| 10 | `reason` status/bulk | `/refund-reason-update-status`, `/refund-reason-bulk-update` | POST | `update_status`, `bulk_update` | `id`,`status` · `id[]` (**toggles** each) | – |
| 11 | `config` | `/admin/refund-request-config` + `business_settings.update` | GET / POST | `refund_config`, `refund_time_update`, `dispute_refund_time_update`, `refund_sticker_update` | `seller_product_refund_approval` (admin_approval_required / seller_can_refund_directly) · `refund_type` (global_refund / category_based_refund) · `refund_request_time` int ≥0 · `enable_dispute_refund` bool · `dispute_refund_request_time` int ≥0 · `refund_sticker` (image) · preset reason inline editors | – |
| 12 | `category_wise_refund/set_refund` + `table` | `/categories-wise-product-refund`, `/categories-filter` | GET | `categoriesWiseProductRefund`, `filter_categories` | `category_status` main_categories · `unassigned` 1 · `search` | inline days edit |
| 13 | same | `/categories/update-refund-settings` | POST | `updateRefundSettings` | `id` req exists · `refund_request_time` int ≥0 (applies to **all descendants**) | – |
| 14 | same | `/categories/bulk-refund-days-assign` | POST | `updateBulkRefundDaysAssign` | `id[]` req · `bulk_refund_days` int ≥0 (+ descendants) | bulk bar |
| 15 | helper | `/admin/products/check-refundable-category` | POST | `checkRefundableCategory` | `category_id` | product-form helper → belongs to products module (out of scope) |
AEC permissions: `view_refund_reason, add_refund_reason, edit_refund_reason, can_update_refund_reason_status, view_dispute_refund_requests, accept_dispute_refund_request, reject_dispute_refund_request, can_set_category_based_refund_days` (+ legacy menu gates for 1–6, 11).

## 2. Screen status (step 4)
| Screen | v1 | v2 now |
|---|---|---|
| 1–2 Requests list + detail | natamam (one 551-line page, invented model: `status` pending/approved/rejected/disputed, no tabs by seller type/channel, no photos/payment info) | tam (`/admin/refund`) |
| 3–4 Pay (wallet / offline) | natamam (approve button only; no trx id/receipt) | tam (detail → Refund now) |
| 5 Reject with preset reason | natamam (free text) | tam |
| 6 Payment info | yox | tam (inside detail) |
| 7 Dispute list + pay/reject | yox (`is_disputed` flag only) | tam (`/admin/refund/disputes`) |
| 8–10 Reasons CRUD, status, bulk | natamam (`reason_text`, `is_active`, `display_order`; no type, no translations, no bulk) | tam (`/admin/refund/reasons`) |
| 11 Settings | natamam (`refund_days_limit`, `auto_approve_hours`, `allow_vendor_dispute`, `customer_can_cancel`, `requires_product_return` — **none exist in AEC**) | tam (`/admin/refund/settings`) |
| 12–14 Category-wise days + bulk | yox | tam (`/admin/refund/categories`) |
| 15 refundable-category check | yox | out of scope (products module) |
**AEC 15 admin items: v1 tam 0 · natamam 5 · yox 4 (+6 sub-actions) → v2 tam 14 / 14 in scope (15 = products module).**

## 3. Field diff (screen · AEC field · v1 · v2 name · type · diff · action)
| Screen | AEC field | v1 | v2 (our name, D11) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| request | `refund_code` | `order_code` shown | `code` + `order_code` | string | v1 lacked the refund code | added |
| request | `refund_status` 0/1/2 | `status` + `disputed` | `status` pending/approved/rejected | enum | v1 mixed dispute into status (**yanlış**) | rebuilt |
| request | `seller_approval`, `admin_approval` 0/1/2 | `seller_approved` bool, `admin_decision` | `seller_decision`, `admin_decision` pending/approved/rejected/na | enum | `na` for admin-owned products (AEC table logic) | rebuilt |
| request | `refund_amount` | `refund_amount` | `amount` | decimal | name | `amount` |
| request | `reason` (text or id → `reason_text`), `images` | `reason` | `reason`, `images[]` | text, urls | photos missing | added |
| request | `preferred_payment_channel` wallet/null/offline, `payment_information_id` | – | `payment_channel` wallet/offline, `payment_info{method,account_name,account_number,note}` | enum/object | missing | added (null → wallet) |
| request | `transaction_id` (`trx_id`), `photo` | – | `transaction_id`, `receipt` | string/image | missing | added |
| request | `reject_reason`, `admin_reject_reason` | – | `reject_reason` (single; API keeps who rejected) | text | AEC splits by actor | merged for admin screen |
| request | `*_datatime` (typo) , `created_at` | `created_at` | `requested_at`, `decided_at`, `paid_at` | datetime | typo, D11 `*_at` | renamed |
| dispute | `dispute_refund_status` 1/2/3, `dispute_reason`, `dispute_images`, `admin_dispute_reject_reason`, `dispute_photo`, `dispute_refund_approval_datatime` | `is_disputed` | `dispute{status,reason,images[],requested_at,decided_at,reject_reason,transaction_id,receipt}` | object | missing | added; AEC reuses the reject route for disputes → we have **separate** `…/disputes/{id}/reject` |
| reason | `type` (`customer_refund_reason`, `admin/seller_reject_refund_reason`), `reason` ≤120, `status`, translations (`lang`) | `reason_text`, `is_active`, `display_order` | `kind` customer/rejection, `translations{az,en,tr,ru}`, `is_active` | enum/object | v1 `display_order` not in AEC (**artıq**); AEC type strings contain `/` | renamed, 4 languages |
| reason | bulk update (blind toggle) | – | `PATCH /reasons/status {ids, is_active}` | action | AEC toggles each row (race-prone) | explicit target state |
| category | `refund_request_time` (days) on `categories` | – | `refund_days`; descendants updated by API | int ≥0 | missing | added; 0 = not refundable |
| settings | `seller_product_refund_approval` | – | `approval_mode` admin_approval / seller_direct | enum | missing | added |
| settings | `refund_type` | – | `refund_type` global / category | enum | missing; switching marks all products non-refundable (warning shown) | added |
| settings | `refund_request_time`, `dispute_refund_request_time`, `enable_dispute_refund`, `refund_sticker` | – | `refund_days`, `dispute_days`, `dispute_enabled`, `sticker` | int/bool/image | missing | added |
| settings | v1-only `auto_approve_hours`, `customer_can_cancel`, `requires_product_return`, `allow_vendor_dispute` | yes | – | – | **artıq** — no AEC counterpart | dropped (ask PM if wanted as new features) |
| settings | inline preset reason editors | – | moved to Reasons screen | – | UI move only | equivalent |

## 4. Naming / permissions
- Module id `refund`; routes `/admin/refund/**`; API prefix `/admin/refund/*`; `requires: ["order","payment"]` (`modules.extra.ts` row moved into the manifest).
- Permission group `refund` (single tree): `index` (requests), `requests_manage` (pay/reject), `disputes`, `disputes_manage`, `reasons`, `reasons_manage`, `categories`, `settings` (AEC's 8 fine-grained + legacy menu gates → 8; seller ownership = API policy, no `*_own`).
- API shape: `GET /requests|/disputes?tab=&q=&page=&per_page=&sort=` · `GET /requests/{id}` · `POST /requests/{id}/pay {method: wallet|offline, transaction_id?, receipt?}` · `POST /requests/{id}/reject {reason}` · `POST /disputes/{id}/pay|reject` · reasons CRUD + `PATCH /reasons/status` · `GET /categories?main=&unassigned=&q=` · `PUT /categories/{id} {refund_days}` · `POST /categories/bulk-days {ids, refund_days}` · `GET|PUT /settings`.
- AEC side effects the real API must keep on **pay**: credit customer wallet (`Wallet` row + `User.balance`), reduce club-point conversion (`club-point` module, if enabled), decrease seller `admin_to_pay` when seller approved, send e-mails (`refund_*` templates). On **reject**: store reason, e-mails. All in one DB transaction (AEC is not).
- AEC GET filters via JSON-html endpoints (`/…-filter` returning rendered HTML) → plain JSON lists.

## 5. Performance (AEC slow)
- AEC loads 15 rows with `with(['order','seller','user','orderDetail.product'])` and re-renders an HTML table per filter; admin2: server-side `tab/q/page/sort`, 300 ms debounced search, `keepPreviousData`, one list query + lazy detail query only when a row is opened, product thumbs `loading=lazy` with fixed size.
- Category list: server filters `main`/`unassigned`; descendant propagation happens server-side (AEC recursion per request).

## 6. Open questions
1. Seller-side refund screens (approve/reject/pay/config/category days) wait for the seller panel — which module owns them (`refund` with `panels: ['admin','seller']`)?
2. v1-only settings (`auto_approve_hours`, `customer_can_cancel`, `requires_product_return`) do not exist in AEC — new features or drop?
3. "View order" link from the detail dialog needs the orders module (shows `#order_code` text for now).
4. Wallet payout needs the wallet/customer module; confirm the API owns the wallet credit inside the refund transaction.
5. Rejection reason presets are stored as text on the refund (AEC stores text, not an id) — keep?
