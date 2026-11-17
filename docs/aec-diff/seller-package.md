# seller-package — AEC vs v1 vs admin2

Module id `seller-package` · AEC addon `seller-subscription-addon` (source: `D:\www\aec\addons\seller-subscription-addon\seller_subscription` — `controllers/SellerPackageController.php`, `SellerPackagePaymentController.php`, `views/seller_packages/*`, `sql/*.sql`, plus `D:\www\aec\routes\seller_package.php`; the `public_html\...` paths from the prompt do not exist, `D:\www\aec` is the live AEC tree) · v1 feature `admin/src/features/seller-package` (card list + form, invented fields) · admin2 `src/features/seller-package` (1 route + 1 dialog).
Scope: admin panel only. The seller side (`seller_packages_list`, `packages_payment_list`, `purchase_package`, `purchase_package_offline`, the per-gateway `seller_package_payment` callbacks) is out. Offline payment requests for seller packages (`offline_seller_package_payment_request.index` / `.approved`, `SellerPackagePaymentController`) already live in **Payments** (`/admin/payments/seller-packages`); not duplicated here.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **7** (numbered rows); v1 **0 tam / 6 natamam / 1 yox**; admin2 **6 tam / 0 natamam / 0 yox**, row 7 is a backend scheduled job (n/a in the UI).

## 1. AEC screens (step 1)

All admin routes: prefix `admin`, middleware `auth` + `admin`. Staff permissions: `view_all_seller_packages`, `add_seller_package`, `edit_seller_package`, `delete_seller_package`.

| # | Blade | Route | HTTP | Controller@method (permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `seller_packages/index` (cards, no paging) | `/seller_packages` | GET | SellerPackageController@index (`view_all_seller_packages`) | natamam (cards without logo; shows invented limits) | tam — `/admin/seller-package` (card grid, `seller_package.index`) |
| 2 | `seller_packages/create` | `/seller_packages/create` | GET | @create (`add_seller_package`) | natamam (page/dialog without logo, duration, preorder limit) | tam — create dialog (page → dialog) |
| 3 | create form POST | `/seller_packages` | POST | @store | natamam | tam — `POST /seller-packages`, `seller_package.create` |
| 4 | `seller_packages/edit` (language tabs, `?lang=`) | `/seller_packages/edit/{id}` | GET | @edit (`edit_seller_package`) | natamam (4-language name object, no per-language tabs needed) | tam — edit dialog, one name field per language (az required) |
| 5 | edit form POST | `/seller_packages/{id}` | PATCH | @update | natamam | tam — `PUT /seller-packages/{id}`, `seller_package.edit` |
| 6 | card "Delete" + confirm modal | `/seller_packages/destroy/{id}` | **GET** | @destroy (`delete_seller_package`) | natamam (native `confirm()`) | tam — `DELETE /seller-packages/{id}` behind a confirm dialog, `seller_package.delete` |
| 7 | none (cron/URL hit) | `/seller_packages/check_for_invalid` | **GET, no auth** | @unpublish_products | yox | n/a in UI — scheduled backend job (see §3) |

## 2. Field / behaviour diff

AEC table `seller_packages` + `seller_package_translations`: `name`, `amount`, `product_upload_limit`, `preorder_product_upload_limit` (only while the `preorder` addon is on), `duration` (days), `logo` (upload id).

| Screen | AEC field | v1 field | admin2 field (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| form | `name` (+ translation per language) | `name{az,en,tr,ru}` | `translations{az,en,tr,ru}` (+ computed `name` = az) | text ≤ 255, az required | v1 ok; AEC saved the default-language name only on the default tab | kept 4-language object, one dialog |
| form | `amount` (`required`, `min 0`, text-ish) | `price` | `amount` | number ≥ 0 | v1 renamed; AEC took any value server-side | AEC name kept, number validation |
| form | `product_upload_limit` | `product_limit` (-1 = unlimited) | `product_upload_limit` | whole number ≥ 0 | v1 invented -1; AEC min 0 | AEC name and rule (unlimited stays an explicit big number or a D22 limit) |
| form | `preorder_product_upload_limit` | — | `preorder_product_upload_limit` | whole number ≥ 0 | **yox in v1** | added; shown only when the `preorder` module is enabled (AEC: `addon_is_activated('preorder')`) |
| form | `duration` ("Validity in number of days") | `duration_days` | `duration` | whole number ≥ 1 | v1 renamed; AEC allowed 0 (package expires at once) | AEC name, min 1 |
| form | `logo` (upload id, required by the form hint only) | — | `logo` | image, required | **yox in v1** | added (image picker, required) |
| list | — | `sellers_count` | `sellers_count` | computed | v1 extra, useful | kept as computed card line |
| form | — | `trial_days`, `badge_color` | — | — | invented, not in AEC nor in D22 | dropped (open question 1) |
| form | — | `commission_rate` | — | — | belongs to the sellers/commission group | dropped here (open question 2) |
| form | — | D22 limits: `digital_product_limit`, `staff_limit`, `storage_mb`, `flash_deal_limit`, `coupon_limit`, `promo_product_limit`, `featured_slots`, `monthly_order_limit` (-1 = unlimited), `wholesale_enabled`, `shop_design_enabled`, `pos_enabled`, `custom_domain_enabled`, `support_priority` | same names | whole numbers ≥ -1, booleans, enum | **artıq vs AEC** — target model D22 ("a package carries multi-dimension limits"), not in AEC | kept as a second form section "Shop limits"; the API enforces them in a Policy/Action (D22) |
| list | `active` toggle | `active` + `toggleActive` | — | — | AEC has no active switch (a package exists or is deleted) | dropped |

Also fixed against AEC:
- `amount`, `product_upload_limit`, `duration` accepted any text (`required` only in HTML); invalid values reached the controller. Now real numbers: no negatives, counts whole, duration ≥ 1.
- Deleting a package left shops pointing at a missing `seller_package_id`; the card dialog now warns, the API decision is open question 3.
- Delete was a GET link (CSRF-able) → `DELETE` behind a confirm dialog.
- Translations: AEC wrote the default-language name into `seller_packages.name` and the rest into `seller_package_translations` in two saves without a transaction → one `PUT` with all languages.

## 3. Contract notes

| Endpoint | Body / result |
|---|---|
| `GET /admin/seller-packages` | `{data: SellerPackage[]}` unpaged (AEC loads every package) with computed `sellers_count` |
| `POST /admin/seller-packages` | `{translations{az,en,tr,ru}, amount, duration, product_upload_limit, preorder_product_upload_limit, logo, support_priority, <8 limits>, <4 flags>}` → `{message, data}` |
| `PUT /admin/seller-packages/{id}` | same body → `{message}` |
| `DELETE /admin/seller-packages/{id}` | `{message}` |

`check_for_invalid` (row 7) must become an **authenticated scheduled job**, not a public URL: AEC lets anyone unpublish the products of every expired shop with one GET and clears the whole cache. The job also runs inside one DB transaction per shop (products and preorder products unpublished, `seller_package_id`/`package_invalid_at` cleared).

## 4. Open questions

1. `trial_days` and `badge_color` (v1) exist neither in AEC nor in D22. Keep as new features or drop (dropped now)?
2. `commission_rate` per package (v1, "CUSTOM #10") overlaps the sellers/commission group of the core migration. Which module owns it?
3. Deleting a package that shops still hold: reject (409), or let shops keep their limits until `package_invalid_at` (the card dialog already says so)?
4. D22 limits (8 numbers, 4 flags, priority) are in the form but nothing enforces them in mock; the API plan must define the Policy/Action contract, and `wholesale_enabled` / `pos_enabled` should depend on those modules being on.
5. The free package: AEC has no "only one free package" rule here (classified packages do). Needed?
6. Package downgrade protection (AEC compares upload limits at purchase) is a seller-panel rule; it belongs to the seller panel session.
7. The mock registers the module enabled so it can be viewed; `00-sidebar-architecture.md` says addon modules start disabled. Change the seed?
