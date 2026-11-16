# payments — AEC vs v1 vs admin2

Module id `payments` · AEC addons `offline_payment` (source: `D:\www\aec\addons\offline_payment` — `controllers/ManualPaymentMethodController.php`, `OfflinePayoutMethodController.php`, `views/manual_payment_methods/*`, plus the wallet / package / order controllers that `routes/offline_payment.php` points at) and `payriff` (`D:\www\aec\addons\payriff` — `routes/payriff.php`, `controllers/PayriffController.php`, `views/payriff/*`). The path `public_html\addons\...` named in the prompt does not exist. v1 source: `admin/src/features/payments` (gateway grid, manual-methods table, offline order / wallet / seller-package tables, payout-methods table, "integrations" dashboard).
Scope: **admin panel** screens only. Out of scope: customer / seller side (`submit_offline_payment`, the `*_modal` partials, `payment_receipt_show`, `purchase_package_offline`, `offline_recharge`), the Payriff checkout flow (`pay`, `callback`, `PayriffService`, mobile API) and the core "Payment Methods" gateway grid (`payment_method.index`, ~20 gateways — it belongs to the core settings group; Payriff is the only gateway migrated here because it is an addon).

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **21** (11 pages + 10 write actions); v1 **0 tam / 13 natamam / 8 yox**; admin2 **20 tam / 1 natamam** (the offline-orders list, see §4).

## 1. AEC screens (step 1)

| # | Blade / partial | Route | HTTP | Controller@method | Inputs | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|---|
| 1 | `manual_payment_methods/index` + `table` | `/admin/manual_payment_methods` (`view_all_manual_payment_methods`) | GET | ManualPaymentMethodController@index | — (no paging, no search) | natamam | tam — `/admin/payments` (`PaymentsManualPage`, server table) |
| 2 | `create` | `/admin/manual_payment_methods/create` (`add_manual_payment_method`) | GET | @create | — | natamam (dialog, invented fields) | tam — dialog `PaymentsManualDialog` |
| 3 | `create` form | `/admin/manual_payment_methods` | POST | @store | `type` (custom_payment / bank_payment / check_payment), `heading`, `photo`, `description`, `bank_name[]`, `account_name[]`, `account_number[]`, `routing_number[]` | natamam | tam — `POST /admin/payments/manual-methods` |
| 4 | `edit` | `/admin/manual_payment_methods/{id}/edit` (`edit_manual_payment_method`) | GET | @edit | — | natamam | tam — same dialog, edit mode |
| 5 | `edit` form | `/admin/manual_payment_methods/{id}` | PUT | @update | same as store | natamam | tam — `PUT …/manual-methods/{id}` |
| 6 | delete link | `/admin/manual_payment_methods/destroy/{id}` (`delete_manual_payment_method`) | **GET** | @destroy | — | natamam | tam — `DELETE …/manual-methods/{id}` behind a confirmation |
| 7 | `sales/index` filtered | `/admin/offline-payment-orders` (`view_all_offline_payment_orders`) | GET | OrderController@all_orders (`manual_payment = 1`) | search, delivery / payment status, seller type, date range | natamam (invented approve/reject) | natamam — `/admin/payments/offline-orders` (read-only, payment-status tabs + search + sort) |
| 8 | `wallet_request` + `table` (5 tabs) | `/admin/offline-wallet-recharge-requests` (`view_all_offline_wallet_recharges`) · `/admin/requests-filter` | GET | WalletController@offline_recharge_request, @filter_request | `search`, `request_status` (all / pending / approved / recharged_by_admin / recharged_by_customer) | natamam | tam — `/admin/payments/wallet-requests` (`?tab=`, server search / sort / paging) |
| 9 | row approve | `/admin/offline-wallet-recharge/approved` (`approve_offline_wallet_recharge`) | POST | WalletController@updateApproved | `request_id` | natamam (approve/reject) | tam — `POST …/wallet-requests/approve` `{ids:[id]}` |
| 10 | bulk approve | `/admin/bulk-wallet-requests-approve` | POST | WalletController@bulk_approve | `id[]` | yox | tam — same endpoint, several ids |
| 11 | `wallet_modal` (offcanvas) + make payment | `/admin/wallet-recharge/modal` · `/admin/wallet-recharge/make-payment` | POST · POST | ManualPaymentMethodController@wallet_recharge_modal, @wallet_recharge_make_payment | `user_id`, `amount`, `trx_id`, `photo` | yox | tam — dialog `PaymentsRechargeDialog` + `POST …/wallet-recharges` |
| 12 | `seller_package_payment_request` | `/admin/offline-seller-package-payment-requests` (`view_all_offline_seller_package_payments`) | GET | SellerPackagePaymentController@offline_payment_request | — (10 per page, no search) | natamam | tam — `/admin/payments/seller-packages` |
| 13 | approve switch | `/admin/offline-seller-package-payment/approved` (`approve_offline_seller_package_payment`) | POST | SellerPackagePaymentController@offline_payment_approval | `id`, `status` | natamam | tam — `POST …/seller-package-requests/{id}/approve` |
| 14 | `customer_package_payment_request` | `/admin/offline-customer-package-payment-requests` (`view_all_offline_customer_package_payments`) | GET | CustomerPackagePaymentController@offline_payment_request | — | yox | tam — `/admin/payments/customer-packages` |
| 15 | approve switch | `/admin/offline-customer-package-payment/approved` (`approve_offline_customer_package_payment`) | POST | CustomerPackagePaymentController@offline_payment_approval | `id`, `status` | yox | tam — `POST …/customer-package-requests/{id}/approve` |
| 16 | `refund_request/offline/index` + `table` | `/admin/refund-method-for-customer-index` (`view_all_payout_method_for_customer`) · `…-filter` | GET | OfflinePayoutMethodController@index, @filter | `search` | natamam | tam — `/admin/payments/payout-methods` |
| 17 | `offline/create` + store | `…-create` · `…-store` (`add_payout_method_for_customer`) | GET · POST | @create, @store | `type` (bank_payment / others), `name`, `logo` — all required | natamam (dialog, invented `fields[]`) | tam — dialog `PaymentsPayoutDialog` |
| 18 | `offline/edit` + update | `…-edit/{id}` · `…-update/{id}` (`edit_payout_method_for_customer`) | GET · POST | @edit, @update | same | natamam | tam — same dialog, edit mode |
| 19 | delete | `…-delete/{id}` · `…-bulk-delete` (`delete_payout_method_for_customer`) | **GET** · POST | @delete, @bulk_delete | `id[]` | natamam / yox | tam — `DELETE …/payout-methods/{id}`, `POST …/payout-methods/bulk-delete` |
| 20 | `payriff/index` + `payment_method/payriff` | `/admin/payriff_configuration` (`payriff_payment_gateway_configuration`, `payriff.index`) | GET | PayriffController@credentials_index | — | yox | tam — `/admin/payments/payriff` (`PaymentsPayriffPage`) |
| 21 | credentials form · activation switch | `/admin/payriff_configuration_update` · `/admin/payment-activation` (`payment.activation`, core) | POST · POST | PayriffController@update_credentials; core `updatePaymentActivationSettings` | `types[]` + `PAYRIFF_DISPLAY_NAME`, `PAYRIFF_MODE`, `PAYRIFF_TEST_MERCHANT_ID`, `PAYRIFF_TEST_SECRET_KEY`, `PAYRIFF_PRODUCTION_MERCHANT_ID`, `PAYRIFF_PRODUCTION_SECRET_KEY`; `id`, `value` | yox | tam — `PUT …/payriff`, `PUT …/payriff/activation` `{active}` |

## 2. Field diff (step 4)

| Screen | AEC field | v1 field | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| manual method | `type` | — (`name`) | `type` ∈ `custom_payment` · `bank_payment` · `check_payment` | enum | v1 invented `name`, `bankDetails`, `accountNumber`, `status` | AEC model |
| manual method | `heading`, `description` (HTML textarea), `photo` (upload id) | `name`, `bankDetails`, `photo` | `heading`, `description`, `photo` (URL, image picker) | text | no validation in AEC | required ≤ 120 / ≤ 2000 |
| manual method | `bank_info` (JSON text of `[{bank_name, account_name, account_number, routing_number}]`) | `accountNumber` | `bank_info[]` (real array; required ≥ 1 row for `bank_payment`, emptied for other types) | array | AEC crashed on an empty list and kept stale rows when the type changed | validated |
| offline order | order code, user name, `manual_payment_data` (`name`, `amount`, `trx_id`, `photo`), `payment_type`, `payment_status` (`Submitted` / paid / unpaid) | `orderCode`, `customer{}`, `methodName`, `amount`, `transactionId`, `receiptImage`, `status` pending / approved / rejected | `code`, `customer`, `method`, `amount`, `trx_id`, `receipt`, `payment_status` submitted / paid / unpaid | — | v1 reject state does not exist in AEC | AEC values |
| wallet request | `user.name`, `amount`, `payment_method`, `payment_details` (trx), `reciept` (sic), `approval`, `added_by`, `offline_payment` | `customer{}`, `amount`, `methodName`, `transactionId`, `receiptImage`, `status` | `customer`, `amount`, `method`, `trx_id`, `receipt`, `approved`, `added_by` (admin / customer) | — | typo `reciept` not copied | |
| wallet recharge (admin) | `user_id`, `amount`, `trx_id`, `photo` | — | `user_id` (server-searched customer), `amount` > 0, `trx_id` ≤ 100, `photo` | — | AEC took any amount, any user id | validated |
| package request | `user.name`, `seller_package.name` / `customer_package.name`, `payment_method`, `payment_details`, `reciept`, `approval` | `seller{}`, `packageName`, … | `customer` (seller or customer name), `package` (null → "Package unavailable"), `method`, `trx_id`, `receipt`, `approved` | — | | |
| payout method | `type` (bank_payment / others), `name`, `image` (form field `logo`) | `name`, `type` bank / card / wallet, `status`, `instructions`, `fields[]` | `type`, `name`, `logo` | enum / text / image | v1 `status`, `instructions`, `fields[]`, card / wallet types do not exist in AEC | dropped |
| Payriff | `PAYRIFF_DISPLAY_NAME`, `PAYRIFF_MODE` (`test` / `production`), `PAYRIFF_TEST_MERCHANT_ID`, `PAYRIFF_TEST_SECRET_KEY`, `PAYRIFF_PRODUCTION_MERCHANT_ID`, `PAYRIFF_PRODUCTION_SECRET_KEY` (env, + legacy `PAYRIFF_MERCHANT_ID` / `PAYRIFF_SECRET_KEY` fall-backs) | gateway grid `credentials{}`, `isSandbox` | `display_name`, `mode`, `test_merchant_id`, `test_secret_key`🔒, `production_merchant_id`, `production_secret_key`🔒 | text / enum | legacy fall-back keys dropped | |
| Payriff | `payment_methods.active` (via core `payment.activation`) | `status` | `active` | bool | | switch disabled until the chosen mode has an id and a secret |
| Payriff | secrets printed as `value="{{ env(…) }}"` in the HTML | — | secrets (🔒) come back as `********`; the mask sent back unchanged keeps the stored secret | — | AEC leaked every key into the page | masked |

## 3. AEC defects fixed (not copied)

| # | AEC behaviour | admin2 |
|---|---|---|
| 1 | `WalletController@updateApproved` has no "already approved" check: approving a request twice credits the balance twice (only `bulk_approve` skips approved rows) | the single and the bulk approve share one endpoint that skips approved rows; the button disappears once approved |
| 2 | Package approval takes `status` from the browser and always extends the seller's `invalid_at` / adds uploads, even for `status = 0`, and again on every repeat click | approve is one-way (`POST …/{id}/approve`); the API must make it idempotent |
| 3 | `wallet_recharge_make_payment` has no validation: negative amount lowers the balance, any `user_id`, no transaction around the wallet row and the balance update | amount > 0, transaction id required, customer chosen from a server search; the API must wrap both writes in one DB transaction |
| 4 | Manual method `store` / `update` validate nothing (heading only `required` in the browser); a `bank_payment` without rows crashes on `count(null)`; changing type away from bank keeps stale `bank_info` | zod validation (≥ 1 bank row for bank payments), rows dropped for other types |
| 5 | Deletes are **GET** links (`manual_payment_methods/destroy/{id}`, `refund-method-for-customer-delete/{id}`) — CSRF-less, prefetchable | `DELETE` (and bulk `POST`) behind a confirmation dialog |
| 6 | `PayriffController@update_credentials` rewrites `.env` with `str_replace` (duplicate lines, quotes corrupt the file) and has **no permission middleware** (only `credentials_index` is guarded) | credentials are API data (`PUT /admin/payments/payriff`), needs `payments.payriff_manage`; the API should store them encrypted, not in `.env` |
| 7 | Payriff secrets are rendered into the HTML (`input type=password value=env(…)`) | masked on read |
| 8 | `credentials_index` creates the `payment_methods` row on a GET (a read writes) | none: the API seeds the row on install |
| 9 | Payriff can be switched on with empty keys, or with the production mode chosen and only test keys filled | the switch needs the chosen mode's id and secret; saving the production mode requires the production fields; switching to a mode without credentials turns the gateway off |
| 10 | Offline orders list: `Auth::user()->can(...)` chain shared with five other routes, aborts 403 for anything else | own permission `payments.offline_orders` |
| 11 | Manual method list, payout list and package lists have no search / sort; package lists show 10 rows with no filter | server-side `?q=&sort=&page=` everywhere |

## 4. Notes on the single `natamam`

The offline-orders list (#7) shows the AEC columns (order, customer, method, amount, transaction id, receipt, payment status, date), payment-status tabs, search and sort. It is read-only: AEC changes the payment status on the order page (`update_payment_status`, which also pays seller commissions, notifies the customer and touches club points), and that belongs to the orders module. AEC's other filters of the shared sales list (delivery status, seller type, date range) are not repeated here.

## 5. Open questions

1. The core "Payment Methods" gateway grid (`payment_method.index`: PayPal, Stripe, Razorpay, … ~20 gateways with env-based credentials) is a core settings screen, not part of these two addons. Which module owns it — a separate `payment-gateways` module or the core settings group? v1's gateway grid was left out of `payments` for that reason.
2. The offline-orders list needs a link to the order page and the "mark as paid" action; both wait for the orders module (the `#code` is plain text for now).
3. Seller-package requests belong to the `seller-package` module (#14) and customer-package requests to `classified` (#11) in the migration order. They live here now because AEC groups them under "Offline Payment System"; move them when those modules are migrated?
4. Payout methods are the refund module's "offline refund" options in AEC (`refund_request.offline.*` views). Keep them here (the addon `offline_payment` owns the controller) or move into `refund`?
5. Credentials (Payriff keys) live in `.env` in AEC; the real API needs an encrypted settings store and a migration of the existing values.
6. Manual-method `description` is HTML in AEC (rich text); it is a plain textarea here until the rich-text editor decision (Q-P2) is made.
7. Customer-side flows (receipt upload at checkout, order re-payment modal, wallet recharge request) are storefront work, not admin screens.
8. The "Offline" button of the POS terminal (`pos` module) should only appear when this module is enabled; the module toggle does not know that dependency yet.
9. The mock registers the module enabled so it can be looked at; `00-sidebar-architecture.md` implies add-on payment modules are off until configured. Change the seed?
