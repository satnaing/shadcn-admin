# club-point — AEC vs v1 vs admin2

Module id `club-point` · AEC addon `club_point` (source: `D:\www\aec\addons\club_point` + `routes/club_points.php` + `ClubPointController`; the path `public_html\addons\club_point` from the prompt does not exist, `D:\www\aec` is the live AEC tree) · v1 feature `admin/src/features/club-points` (one page, hard-coded arrays, invented fields) · admin2 `src/features/club-point` (3 routes + 2 dialogs).
Scope: admin panel only. Customer routes (`/earning-points` list, `convert-point-into-wallet`) and the order hook `processClubPoints` (server side, not UI) are out of scope.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **5** (numbered rows; row actions and POST forms belong to their screen); v1 **0 tam / 2 natamam / 3 yox**; admin2 **5 tam / 0 natamam / 0 yox**.

## 1. AEC screens (step 1)

All routes: prefix `admin`, middleware `auth` + `admin`, controller `ClubPointController`. Staff permissions: `club_point_configurations`, `set_club_points`, `view_users_club_points`.

| # | Blade (`views/club_points/…`) | Route | HTTP | Controller@method (permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `config` (one number: points per 1 currency unit) | `/club-points/configuration` · POST `/club-point-convert-rate/store` | GET · POST | @configure_index (`club_point_configurations`) · @convert_rate_store | natamam (config tab with 4 invented fields) | tam — `/admin/club-point/config` |
| 2 | `index` (earned points per order, paginate 15) | `/club-points/index` | GET | @index (`view_users_club_points`) | natamam (balance-per-user table with 2 fake rows; AEC has no balance table) | tam — `/admin/club-point` (server q/sort/page, status tabs) |
| 3 | `club_point_details` (points per product of one order, paginate 12) | `/club-point-details/{encrypted id}` | GET | @club_point_detail | yox | tam — lines dialog on the list (page → dialog) |
| 4 | `set_point` (products table + 2 side forms) | `/set-club-points` · POST `/set-club-points/store` · POST `/set-club-points-for-all_products/store` | GET · POST · POST | @set_point (`set_club_points`) · @set_products_point · @set_all_products_point | natamam (3 fake products, no bulk forms) | tam — `/admin/club-point/products`: table (server q/sort/page) + range card + all-products card |
| 5 | `product_point_edit` | `/set-club-points/{encrypted id}` · POST `/set-club-points/update/{id}` | GET · POST | @set_point_edit · @update_product_point | yox | tam — edit dialog on the products list (page → dialog) |

Dead routes in AEC: `business-settings/point-convert-rate-store` → `updateBusinessSettings` and `club-point-for-review/store` → `point_for_review_store` point to controller methods that do not exist. Not migrated.

## 2. Field / behaviour diff

| Screen | AEC field / behaviour | v1 | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| 1 | `club_point_convert_rate` (`value`, `min=0`, `step=0.01`) — points that equal one currency unit | `conversion_rate` ("100 points = this many AZN", opposite meaning) | `convert_rate` | number > 0 | v1 wrong meaning | rebuilt |
| 1 | rate `0` accepted, then `points / rate` at conversion time | – | validation `> 0` | – | AEC bug (division by zero) | fixed |
| 1 | – | `point_rate`, `min_points_to_convert`, `is_enabled` | – | – | v1-only, not in AEC | dropped (module toggle covers `is_enabled`) |
| 1 | note: wallet must be activated first | – | shown in the card description | text | – | kept |
| 2 | columns `#`, order code, customer name, points, convert status (Converted / Pending), earned at, view | `user_name`, `current_balance`, … | `order_code`, `customer_name`, `points`, `convert_status`, `created_at` | table | v1 wrong model | rebuilt |
| 2 | "Order not found" / "User not found" placeholders | – | same placeholders | text | – | kept |
| 2 | – | summary cards (total distributed, active balance, equivalent value) | – | – | v1-only, invented | dropped (open question 1) |
| 3 | columns product name, points, earned at; "Deleted Product" placeholder | – | `lines[].{product_name,points,created_at}` in the dialog | table | yox in v1 | added |
| 4 | columns product (thumbnail + name), owner, price, points, edit | `product_name`, `sku`, `price`, `earned_points`, `is_active` | `name`, `owner`, `unit_price`, `earn_point` | table | v1 invented `sku`/`is_active` | rebuilt (thumbnail omitted until the media module exists) |
| 4 | range form: `point`, `min_price`, `max_price` (prefilled from the catalogue min/max); sets the same flat points on every product between | – | `range` card | numbers | yox in v1 | added |
| 4 | range: "min must be less than max" is a hint only | – | validation `min ≤ max` | – | AEC bug | fixed |
| 4 | range / all: negative points accepted | – | validation `≥ 0` | – | AEC bug | fixed |
| 4 | all-products form: `point` per currency unit, `earn_point = unit_price × point` (step 0.001) | – | `all` card | number | yox in v1 | added |
| 4 | bulk saves report "inserted for N products" | – | toast with the changed count (`data.updated`) | – | – | kept |
| 4 | AEC loads every product just to loop and save one by one | – | single server-side update | – | AEC slow | server job; one request from the UI |
| 5 | `point` (`min=0`, `step=0.01`) | – | `point` | number ≥ 0 | yox in v1 | added |

Permissions (tree `club_point.*`, no `*_own`): `index` (list + details dialog) · `products` / `products_manage` (list vs. every write on that screen) · `config` / `config_manage`. AEC had one permission per screen that covered view and write; the `_manage` split lets a role see without changing.

## 3. admin2 routes

`/admin/club-point` (earnings) · `/admin/club-point/products` · `/admin/club-point/config`. API (mock now, real later): `GET /admin/club-point/earnings[/:id]`, `GET /admin/club-point/products`, `PUT …/products/:id`, `POST …/products/range`, `POST …/products/all`, `GET|PUT …/settings`.

## 4. Open questions

1. v1 showed per-customer balances and totals; AEC has no balance table (balance lives in the wallet). Add a summary (total earned / pending / converted, computed server-side) on the earnings page, or leave it out?
2. AEC keeps the earned points on the product (`earn_point`) and copies them into the order line when the order is placed. Changing a product's points therefore never changes points already earned. Confirm the API keeps that.
3. The range form uses the flat points per unit; the all-products form uses points per currency unit. Both are AEC behaviour — keep, or unify?
4. Conversion (customer wallet credit) is a customer action. AEC adds the wallet row, the user balance and the status flip without a transaction; the real API must do it in one DB transaction.
5. Order code is shown as `#code` text; link to the order once the orders module exists.
