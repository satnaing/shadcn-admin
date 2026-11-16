# affiliate — AEC vs v1 vs admin2

Module id `affiliate` · AEC addon `affiliate_system` (source: `D:\www\aec\addons\affiliate_system` + `routes/affiliate.php` + `AffiliateController`; the path `public_html\addons\affiliate_system` from the prompt does not exist, `D:\www\aec` is the live AEC tree) · v1 feature `admin/src/features/affiliate` (one 358-line page with hard-coded arrays) · admin2 `src/features/affiliate` (6 routes + 4 dialogs).
Scope: admin panel only. Customer/storefront routes (`/affiliate` apply form, `affiliate/user/*` dashboard, payment settings, withdraw request creation) and the order hooks `processAffiliatePoints` / `processAffiliateStats` (server side, not UI) are out of scope.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **11** (numbered rows; row actions belong to their screen); v1 **0 tam / 3 natamam / 8 yox**; admin2 **11 tam / 0 natamam / 0 yox**.

## 1. AEC screens (step 1)

All routes: prefix `admin`, middleware `auth` + `admin`, controller `AffiliateController`.

| # | Blade (`views/affiliate/…`) | Route | HTTP | Controller@method (staff permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `index` (3 commission cards + withdraw limit + link validity; modals none) | `/affiliate` · POST `/affiliate/affiliate_option_store` · POST `/affiliate/configs/store` | GET · POST · POST | @index (`affiliate_configurations`) · @affiliate_option_store · @config_store | natamam (a config tab with 3 invented fields) | tam — `/admin/affiliate`: four cards, each saves on its own |
| 2 | `configs` (registration form builder) | `/affiliate/configs` · POST `/affiliate/configs/store` | GET · POST | @configs (`affiliate_registration_form_config`) · @config_store | yox | tam — `/admin/affiliate/form` |
| 3 | `users` | `/affiliate/users` (paginate 12) · POST `/affiliate/approved` | GET · POST | @users (`view_affiliate_users`) · @updateApproved | natamam (table of 2 fake rows, no approval) | tam — `/admin/affiliate/users` (server q/sort/page, status tabs, approval switch) |
| 4 | `show_verification_request` | `/affiliate/verification/{id}` · GET `/affiliate/approve/{id}` · GET `/affiliate/reject/{id}` | GET ×3 | @show_verification_request · @approve_user · @reject_user | yox | tam — dialog on the users list (page → dialog); state changes are POST/PATCH instead of GET links |
| 5 | `payment_modal` | POST `/affiliate/payment_modal` · POST `/affiliate/pay/store` | POST ×2 | @payment_modal (`pay_to_affiliate_user`) · @payment_store | yox | tam — pay dialog (due amount, PayPal e-mail, bank info, amount, method) |
| 6 | `payment_history` | `/affiliate/payments/show/{encrypted id}` | GET | @payment_history (`affiliate_users_payment_history`) | yox | tam — payment history dialog (one page of 100 per user) |
| 7 | `refferal_users` | `/refferal/users` | GET | @refferal_users (`view_all_referral_users`, paginate 10) | yox | tam — `/admin/affiliate/referrals` |
| 8 | `affiliate_withdraw_requests` | `/affiliate/withdraw_requests` | GET | @affiliate_withdraw_requests (`view_affiliate_withdraw_requests`) | natamam (list + approve button on 1 fake row) | tam — `/admin/affiliate/withdraws` (status tabs) |
| 9 | `affiliate_withdraw_modal` | POST `/affiliate/affiliate_withdraw_modal` · POST `/affiliate/withdraw_request/payment_store` | POST ×2 | @affiliate_withdraw_modal (`accept_affiliate_withdraw_requests`) · @withdraw_request_payment_store | yox | tam — same pay dialog with a fixed amount |
| 10 | (reject modal inside `affiliate_withdraw_requests`) | GET `/affiliate/withdraw_request/reject/{id}` | GET | @reject_withdraw_request (`reject_affiliate_withdraw_request`) | yox | tam — confirm dialog, `POST …/reject` |
| 11 | `affiliate_logs` | `/affiliate/logs` | GET | @affiliate_logs_admin (`view_affiliate_logs`) | yox | tam — `/admin/affiliate/logs` (type tabs) |

## 2. Field / behaviour diff

| Screen | AEC field / behaviour | v1 | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| 1 | `minimum_affiliate_withdraw_amount` | `minimum_withdrawal_amount` | `minimum_withdraw_amount` | number ≥ 0 | v1 ok | renamed |
| 1 | `validation_time` (days) | `cookie_duration_days` | `validation_days` | int ≥ 0 | v1 ok | renamed, int validation |
| 1 | first purchase: `percentage` (0–100) + `status` | `commission_percentage` (a single "default rate", not tied to the option) | `user_registration_first_purchase.{percentage,status}` | number, switch | v1 wrong (no status, wrong meaning) | rebuilt |
| 1 | product sharing: `amount` + `amount_type` (`amount`/`percent`) + `status` | – | `product_sharing.{commission,commission_type,status}` | number, select, switch | yox in v1 | added |
| 1 | category-wise: one row per category (`commison_amounts_ID`, `commison_types_ID`, hidden `categories_id_ID`) + `status` | – | `category_wise_affiliate.{status,items[]}` | rows | yox in v1 | added |
| 1 | product sharing and category-wise are mutually exclusive (server flips the other off) | – | same; the card shows the rule, the next read shows the flip | – | yox in v1 | added |
| 1 | AEC input `max=100` on the product-sharing amount even for fixed amounts; no server validation | – | percent ≤ 100, fixed amount unbounded | – | AEC bug | fixed |
| 1 | – | `is_enabled` | – | switch | v1-only (the module toggle in Modules does this) | dropped |
| 2 | element `type` (`text`, `select`, `multi_select`, `radio`, `file`) · `label` · `options[]` for choice types | – | `elements[].{type,label,options}` | select / text / list | yox in v1 | added; AEC's JS used `multi-select` for the button and `multi_select` for the field (mismatch), we use `multi_select` only |
| 2 | remove a field | – | remove button | – | – | kept |
| 2 | choice field with no options accepted | – | validation `optionsRequired` | – | AEC bug | fixed |
| 3 | name · phone · e-mail | name, e-mail, phone | `name`, `phone`, `email` | text | v1 ok | kept |
| 3 | verification info "Show" (only if the user submitted a form) | – | `has_verification` → "Show" button | bool | yox | added |
| 3 | approval checkbox (`updateApproved`) | `status: active/suspended` | `is_approved` switch (`PATCH …/status`) | bool | v1 wrong model | rebuilt |
| 3 | due amount (`balance`) | `current_balance` | `balance` | money | v1 ok | renamed |
| 3 | pay icon (balance ≥ 0), payment-history icon | – | pay icon (disabled at 0), history icon; both permission-guarded | – | yox | added |
| 3 | – | `referral_code`, `total_referrals`, `total_orders_count`, `total_earned_amount` | – | – | v1 invented; not in the AEC list. `total_*` are derivable from logs, ask PM if wanted | dropped |
| 3 | – | – | status tabs All / Pending / Approved (server `?tab=`) | filter | extra | added |
| 4 | name, e-mail, address, phone of the user; submitted form rows (`text`/`select`/`radio` as text, `multi_select` JSON, `file` link); Reject / Accept | – | dialog with the same data; reject also clears the submitted form (like AEC) | – | yox | added |
| 5 | `amount` (editable, default = balance), `payment_method` (`Paypal` / `Bank`), `affiliate_user_id` | – | `amount`, `payment_method` | number, select | yox | added. AEC accepted any amount, even above the balance (negative due amount) → limited to the balance |
| 5 | shows PayPal e-mail and bank info | – | same, from the user detail | – | yox | added |
| 6 | date · amount · payment method | – | same | – | yox | added |
| 7 | name · phone · e-mail · referred by (blank if the referrer was deleted) | – | `name`, `phone`, `email`, `referred_by_name` ("Deleted user") | text | yox | added |
| 8 | date · name · e-mail · amount · status (0 pending / 1 approved / 2 rejected) · actions | `affiliate_user_name/email`, `amount`, `payment_method`, `status`, `created_at` | `requested_at`, `name`, `email`, `amount`, `status` (string) | – | v1 ok-ish; status as string now | renamed |
| 8 | "No action available" on decided requests | – | same text | – | yox | added |
| 8 | – | `payment_method` column | – | – | the method is chosen at payout time, not at request time | dropped |
| 8 | – | – | status tabs All / Pending / Approved / Rejected | filter | extra | added |
| 9 | amount fixed (disabled), `payment_method` required; creates a payment and sets the request to approved; balance **not** touched (it was already held back at request time) | – | same | – | yox | added, same semantics |
| 10 | reject: status 2 and the amount goes back to the balance | – | same; confirm dialog | – | yox | added |
| 11 | referred by · referral user (or "Guest (id)") · amount · order id · type · product (when the type has one) · date | – | `referred_by_name`, `referral_name`/`guest_id`, `amount`, `order_code`, `affiliate_type`, `product_name`, `created_at` | – | yox | added |
| 11 | – | – | type tabs (All / first purchase / product sharing / category-wise) | filter | extra | added |

Permissions (single tree `PERMISSIONS.AFFILIATE`, no `*_own`): `index` (AEC `affiliate_configurations`), `config_manage` (save on screen 1; AEC had no check on the POST), `form` (`affiliate_registration_form_config`), `users` (`view_affiliate_users`), `users_manage` (approve / reject; AEC had no check), `users_pay` (`pay_to_affiliate_user`), `payments` (`affiliate_users_payment_history`), `referrals` (`view_all_referral_users`), `withdraws` (`view_affiliate_withdraw_requests`), `withdraws_manage` (`accept_…` + `reject_…`, merged), `logs` (`view_affiliate_logs`).

## 3. What v1 had
One page `admin-affiliate-page.tsx` with three tabs over hard-coded arrays (2 users, 1 withdraw request), four KPI cards computed from the fake rows and a config form with four fields (`commission_percentage`, `cookie_duration_days`, `minimum_withdrawal_amount`, `is_enabled`). None of it matches the AEC model (no registration form, no verification, no per-type commissions, no payments, no logs). Nothing was reused beyond the three renamed numbers; the page was rebuilt from the AEC screens.

## 4. Open questions
1. **Withdraw request creation** is a customer-panel action (`affiliate/user/withdraw_request/store`): it deducts the balance when the request is made and checks the minimum. The API must do this in one transaction; admin2 only decides requests.
2. **Payouts in one transaction.** `payment_store` decrements `balance` and inserts the payment separately in AEC; the API should do both (and the withdraw approval) in one DB transaction.
3. **Admin-side "total referrals / orders / earned" per user** (invented by v1) are not in AEC. Add as list columns from `affiliate_logs`, or leave out?
4. **Payment method list** is fixed to `Paypal` / `Bank` (AEC). Should the module reuse the payments module's offline methods later?
5. **Guest purchases:** logs show "Guest (id)" like AEC; a guest cannot be a "first purchase" referral, so only product-sharing / category-wise rows can be guests. OK?
6. **Order link** from a log row (`#order_code`) is plain text until the orders module exists.
7. **Optimistic update** on the approval switch is not implemented (the module refetches after the write, like the previous modules).
