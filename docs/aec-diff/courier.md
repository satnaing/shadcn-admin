# courier — AEC vs v1 vs admin2

Module id `courier` · AEC addon `delivery_boy` (source: `D:\www\aec\addons\delivery_boy` — `routes/delivery_boy.php`, `controllers/DeliveryBoyController.php`, `views/delivery_boys/backend/*`, `views/delivery_boys/*`; the path `public_html\addons\delivery_boy` from the prompt does not exist, `D:\www\aec` is the live AEC tree) · v1 features `admin/src/features/delivery-boys` (one 721-line page with five tabs, hard-coded arrays) and `admin/src/features/courier` (courier's own panel, invented statuses/approvals) · admin2 `src/features/courier` (10 routes, 2 dialogs).
Scope: admin screens **and** the courier panel screens (prompt 04 says "admin/seller/courier panel"; one module, one sidebar group, the courier role sees only its own items). Out of scope: customer/public views, the courier login views, order detail + "update delivery status" (`OrderController`, orders module), the addon's `pickup_point/*` and `shipping_configuration/*` views (shipping module), mobile API.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC screens **18** (9 admin + 9 courier panel); v1 **0 tam / 14 natamam / 4 yox**; admin2 **18 tam / 0 natamam / 0 yox**.

## 1. AEC screens (step 1)

Admin routes: prefix `admin`, middleware `auth` + `admin`; staff permissions per method (`view_all_delivery_boy`, `add_delivery_boy`, `edit_delivery_boy`, `ban_delivery_boy`, `collect_from_delivery_boy`, `pay_to_delivery_boy`, `delivery_boy_payment_history`, `collected_histories_from_delivery_boy`, `order_cancle_request_by_delivery_boy`, `delivery_boy_configuration`). Panel routes: middleware `user, verified, unbanned`, data filtered to `Auth::user()`.

| # | Blade | Route | HTTP | Controller@method (permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `backend/delivery_boys/index` (paginate 15, search name/email) | `/admin/delivery-boys` | GET | @index (`view_all_delivery_boy`) | natamam (fake columns/status) | tam — `/admin/courier` |
| 2 | `create` | `/admin/delivery-boys/create` · POST `/admin/delivery-boys` | GET · POST | @create (`add_delivery_boy`) · @store | yox | tam — `/admin/courier/new` |
| 3 | `edit` | `/admin/delivery-boys/{id}/edit` · PUT `/admin/delivery-boys/{id}` | GET · PUT | @edit (`edit_delivery_boy`) · @update | yox | tam — `/admin/courier/$id` |
| 4 | `order_collection_form` (modal) | POST `/admin/delivery-boy/order-collection` · POST `/admin/collection-from-delivery-boy` | POST | @order_collection_form (`collect_from_delivery_boy`) · @collection_from_delivery_boy | yox | tam — collect dialog on the list |
| 5 | `delivery_earning_form` (modal) | POST `/admin/delivery-boy/delivery-earning` · POST `/admin/paid-to-delivery-boy` | POST | @delivery_earning_form (`pay_to_delivery_boy`) · @paid_to_delivery_boy | yox | tam — pay dialog on the list |
| 6 | `delivery_boys_payment_list` (paginate 10) | `/admin/delivery-boys-payment-histories` | GET | @delivery_boys_payment_histories (`delivery_boy_payment_history`) | natamam | tam — `/admin/courier/payments` |
| 7 | `delivery_boys_collection_list` (paginate 10) | `/admin/delivery-boys-collection-histories` | GET | @delivery_boys_collection_histories (`collected_histories_from_delivery_boy`) | natamam | tam — `/admin/courier/collections` |
| 8 | `cancel_request_list` (paginate 10) | `/admin/delivery-boy/cancel-request` | GET | @cancel_request_list (`order_cancle_request_by_delivery_boy`) | natamam (approve/reject invented) | tam — `/admin/courier/cancel-requests` |
| 9 | `delivery_boy_configure` (3 forms) | `/admin/delivery-boy-configuration` · POST `business_settings.update` | GET · POST | @delivery_boy_configure (`delivery_boy_configuration`) | natamam | tam — `/admin/courier/config` (3 cards) |
| 10 | `assigned_delivery` | `/assigned-deliveries` | GET | @assigned_delivery | natamam | tam — `/admin/courier/deliveries?tab=assigned` |
| 11 | `pickup_delivery` | `/pickup-deliveries` | GET | @pickup_delivery | natamam | tam — `?tab=pickup` |
| 12 | `on_the_way_delivery` | `/on-the-way-deliveries` | GET | @on_the_way_deliveries | natamam | tam — `?tab=on_the_way` |
| 13 | `completed_delivery` (from delivery history) | `/completed-deliveries` | GET | @completed_delivery | natamam | tam — `?tab=completed` |
| 14 | `pending_delivery` | `/pending-deliveries` | GET | @pending_delivery | natamam | tam — `?tab=pending` |
| 15 | `cancelled_delivery` | `/cancelled-deliveries` | GET | @cancelled_delivery | natamam | tam — `?tab=cancelled` |
| 16 | `total_collection_list` (cash-on-delivery history) | `/total-collections` | GET | @total_collection | natamam | tam — `/admin/courier/cash` |
| 17 | `total_earning_list` | `/total-earnings` | GET | @total_earning | natamam | tam — `/admin/courier/earnings` |
| 18 | `cancel_request_list` (own) + action `GET /cancel-request/{id}` | `/cancel-request-list` · `/cancel-request/{id}` | GET | @delivery_boys_cancel_request_list · @cancel_request | natamam | tam — same `/cancel-requests` route (server filters by role) + "Request cancel" row action on `/deliveries` |

Row actions on screen 1 (ban/unban `GET /admin/delivery-boy/ban/{id}`) are part of screen 1. In AEC the six stage lists are six separate pages with a left menu each; admin2 uses one route with a tab bar (`?tab=`), the server does the filtering.

## 2. Field / behaviour diff

| Screen | AEC field / behaviour | v1 | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| 1 | columns `#`, name (banned marker), email, phone, earning (`total_earning`), collection (`total_collection`), options | name, phone, `total_deliveries`, `completed_deliveries`, `cash_in_hand`, `earnings`, `status` active/inactive/busy/suspended | `name`, `email`, `phone`, `total_earning`, `total_collection`, `banned` | table | v1 invented counters and a 4-state status; AEC only has banned/not | rebuilt |
| 1 | search by name / email (LIKE on `users`) | client-side | server-side `q`, `sort`, `page` | – | v1 client-side | fixed |
| 1 | `@if ($delivery_boy->user != null)` hides rows whose user is gone | – | API returns only existing users | – | AEC silently skipped rows (page count wrong) | fixed (server job) |
| 1 | ban/unban through a confirm modal, then GET redirect | – | confirm dialog → `PUT …/ban {banned}` | – | AEC state change via GET | fixed |
| 2/3 | `name`, `email` (unique, ≤255), `phone`, `password`, `country_id`, `state_id`, `city_id` (all required), `avatar_original`, `address` | – | `name`, `email`, `phone`, `password`, `country_id`, `state_id`, `city_id`, `avatar`, `address` | form | yox in v1 | added |
| 2 | password not validated: `Hash::make(null)` when empty | – | create: required, ≥ 6; edit: blank keeps the old one | – | AEC bug | fixed |
| 2/3 | country → state → city loaded by AJAX (`get-state`, `get-city`); edit lists **all** states and cities, not the country's | – | cascading selects, children reset when the parent changes; edit prefilled | – | AEC edit bug | fixed |
| 2/3 | `$user->country/state/city` store the **names** (denormalised) | – | ids are sent; API decides what to store | – | – | open question 3 |
| 2 | registration e-mails to admin and courier (`EmailUtility::deliveryBoyRegEmail`) | – | – | server | server side | out of UI scope |
| 4 | `payout_amount` input, max = `total_collection`; refuses afterwards when larger; `total_collection -= amount`, row in `DeliveryBoyCollection` | – | `amount` ∈ (0, `total_collection`], validated before submit | number | AEC accepted 0 and negative amounts | fixed |
| 5 | `paid_amount`, max = `total_earning`; `total_earning -= amount`, row in `DeliveryBoyPayment` | – | `amount` ∈ (0, `total_earning`] | number | same | fixed |
| 6 | columns `#`, courier name, payment amount, created at | `delivery_boy_name`, `amount`, `payment_method`, `paid_at` | `courier_name`, `amount`, `created_at` | table | v1 invented `payment_method` | rebuilt |
| 7 | columns `#`, courier name, collected amount, created at | `delivery_boy_name`, `order_code`, `amount`, `remitted_to_cashier` | `courier_name`, `amount`, `created_at` | table | v1 invented order/remitted | rebuilt |
| 6/7 | `$x->user->name` crashes when the courier was deleted | – | API sends `courier_name` (nullable-safe) | – | AEC bug | fixed (server job) |
| 8 | columns `#`, order code, request by (`delivery_boy->name`), request at, view link (order) | approve / reject dialog with admin notes | `order_code` (`#code`), `courier_name`, `requested_at` | table | v1 approve/reject does not exist in AEC | dropped, open question 1 |
| 9 | payment type radio `salary` / `commission`; `delivery_boy_salary` (monthly) or `delivery_boy_commission` (per delivered order), currency code shown | – | `payment_type`, `salary`, `commission` (only the selected amount is shown) | form | natamam in v1 | added |
| 9 | `delivery_boy_mail_notification`, `delivery_boy_otp_notification` checkboxes | – | `mail_notification`, `otp_notification` switches | form | – | added; OTP needs the otp module |
| 9 | pickup location: `delivery_pickup_latitude/longitude`, Google map picker when `google_map == 1` | – | `pickup_latitude`, `pickup_longitude` typed, validated −90..90 / −180..180 | form | map picker postponed | open question 2 |
| 9 | the three forms post to the shared `business_settings.update` (all keys, one by one) | one save | three independent cards, three saves of a partial `PUT /settings` | – | – | kept like AEC |
| 10–15 | stage rules (assigned: pending/confirmed and no cancel request; pickup; on the way; completed from history; pending: not delivered/cancelled and no cancel request; cancelled) | statuses invented (pending, confirmed, picked_up, on_the_way, delivered, cancelled + cancel dialog) | `tab` ∈ assigned, pickup, on_the_way, completed, pending, cancelled | table | v1 had the status set but wrong filtering and client-side | rebuilt |
| 10–15 | columns in AEC panel: order code, date, status, payment, amount | `items`, `customer` object, notes | `order_code`, `customer_name`, `address`, `payment_type`, `grand_total`, `delivery_status`, `cancel_request` | table | – | rebuilt |
| 16 | cash-on-delivery rows of the delivery history: order code, collection, date | `COD collected`, `remitted` | `order_code`, `payment_type`, `amount` (= collection), `created_at` | table | – | rebuilt |
| 17 | all delivered rows: order code, earning, date | `delivery_fee`, `commission`, `net_earning`, `status` | `order_code`, `payment_type`, `amount` (= earning), `created_at` | table | v1 invented fee/status | rebuilt |
| 18 | courier asks to cancel (`cancel_request = 1`, `cancel_request_at`) through a GET link, no confirmation, no check that the order is still open | dialog with reason (not in AEC) | confirm dialog; only orders that are open and not already requested show the action | – | AEC bug | fixed |
| 18 | `GET /cancel-request/{id}` has no ownership check (any signed-in user can cancel anyone's order) | – | – | server | AEC security bug | server must check `assign_delivery_boy == auth` (risk in report) |

Permissions (tree `courier.*`, no `*_own`): admin — `index`, `create`, `edit`, `ban`, `collect`, `pay`, `payments`, `collections`, `cancel_requests`, `config`, `config_manage`; courier panel — `deliveries`, `deliveries_manage` (request cancel), `cash_report`, `earnings`. AEC's `delivery_boy_configuration` covered view and write; `config_manage` splits them. The courier role (mock) gets the panel items plus `payments`, `collections`, `cancel_requests` (AEC shows these lists to couriers filtered to themselves; the API filters by the signed-in courier).

## 3. admin2 routes

`/admin/courier` (list) · `/new` · `/$id` · `/payments` · `/collections` · `/cancel-requests` · `/config` · `/deliveries` (`?tab=`) · `/cash` · `/earnings`.
API (mock now, real later): `GET|POST /admin/courier/couriers`, `GET|PUT …/couriers/:id`, `PUT …/couriers/:id/ban {banned}`, `POST …/couriers/:id/collect {amount}`, `POST …/couriers/:id/pay {amount}`, `GET …/lookups` (countries / states / cities with `parent_id`), `GET …/payments`, `…/collections`, `…/cancel-requests`, `GET|PUT …/settings` (partial), `GET …/deliveries?tab=`, `POST …/deliveries/:id/cancel-request`, `GET …/cash`, `GET …/earnings`.

## 4. Open questions

1. v1 let an admin approve/reject a courier's cancel request with notes. AEC only lists the requests (the decision happens on the order). Keep the list read-only until the orders module defines the cancel flow, or add approve/reject to this module?
2. Pickup location uses typed coordinates. When the `map-provider` module exists, switch the card to a map picker (AEC uses the Google picker)?
3. AEC stores the country/state/city **names** on the user, not ids. The form sends ids; confirm the API keeps ids (and derives names for display).
4. Earning vs. salary: with `salary` payment type AEC never adds earnings (`total_earning` only grows with `commission`). Who credits the monthly salary — a scheduled job (not in UI), or a manual "Pay" amount? Currently manual.
5. Order code is `#code` text (cancel requests, deliveries, reports); link to the order once the orders module exists. The courier panel also needs "update delivery status" (`OrderController@update_delivery_status`) from the orders module.
6. Collecting cash / paying a courier change `total_collection` / `total_earning` and insert a history row without a transaction in AEC; the real API must do both in one DB transaction.
