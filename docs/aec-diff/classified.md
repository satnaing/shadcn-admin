# classified — AEC vs v1 vs admin2

Module id `classified` · AEC core feature `classified_product` (source: `D:\www\aec` `routes/admin.php` lines 839–851, `CustomerProductController`, `CustomerPackageController`, views `resources/views/backend/customer/classified_products/*` and `customer_packages/*`, sidenav block "Customers"; the paths `public_html\...` from the prompt do not exist, `D:\www\aec` is the live AEC tree) · v1 feature `admin/src/features/classified` (list + create dialog, hard-coded fields) · admin2 `src/features/classified` (2 routes + 2 dialogs).
Scope: admin panel only. Customer/seller upload, edit and storefront search (`customer_products*`, `customer_product/{slug}`) and the customer-side package purchase are out of scope. Offline payment requests of customer packages (`offline_customer_package_payment_request.index`) already live in **Payments** (`/admin/payments/customer-packages`); not duplicated here.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **12** (numbered rows); v1 **0 tam / 2 natamam / 10 yox**; admin2 **12 tam / 0 natamam / 0 yox**.

## 1. AEC screens (step 1)

All routes: prefix `admin`, middleware `auth` + `admin`. Staff permissions: `view_classified_products`, `publish_classified_product`, `delete_classified_product`, `view_classified_packages`, `add_classified_package`, `edit_classified_package`, `delete_classified_package`. The whole block shows only when business setting `classified_product == 1` (the Activation switch → module toggle in admin2).

| # | Blade | Route | HTTP | Controller@method (permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `classified_products/index` (search + one tab "All") | `/classified_products` | GET | CustomerProductController@customer_product_index (`view_classified_products`) | natamam (list with invented `creator_type`/`condition`/`category` filters) | tam — `/admin/classified` (server q/sort/page) |
| 2 | `classified_products/table` (AJAX table, paginate 15) | `/classified-products-filter` | GET | @filter | natamam (same table, client side) | tam — same page; the AJAX fragment is the data-table itself |
| 3 | switch "Published" | `/classified_products/published` | POST | @updatePublished (`publish_classified_product`) | yox (v1 toggled `is_published` with no permission split) | tam — switch in the table, `classified.publish` |
| 4 | row "Delete" + confirm modal | `/classified_products/destroy/{id}` | **GET** | @destroy_by_admin (`delete_classified_product`) | yox | tam — `DELETE /classified/products/{id}` behind a confirm dialog |
| 5 | bulk "Delete" + confirm modal | `/bulk-classified-products-delete` | POST | @bulk_classified_products_delete (`delete_classified_product`) | yox | tam — bulk bar, `POST /classified/products/delete` `{ids}` behind a confirm dialog |
| 6 | "View" link to the storefront page | `customer.product` | GET | frontend | yox | n/a — storefront link; admin2 has no storefront routes (open question 3) |
| 7 | `customer_packages/index` (cards, no paging) | `/customer_packages` | GET | CustomerPackageController@index (`view_classified_packages`) | yox | tam — `/admin/classified/packages` (card grid) |
| 8 | `customer_packages/create` | `/customer_packages/create` | GET | @create | yox | tam — create dialog (page → dialog) |
| 9 | create form POST | `/customer_packages` | POST | @store (`add_classified_package`) | yox | tam — `POST /classified/packages` |
| 10 | `customer_packages/edit` (language tabs) | `/customer_packages/edit/{id}?lang=` | GET | @edit (`edit_classified_package`) | yox | tam — edit dialog with one field per language |
| 11 | edit form POST | `/customer_packages/{id}` | PATCH | @update | yox | tam — `PUT /classified/packages/{id}` |
| 12 | card "Delete" + confirm modal | `/customer_packages/destroy/{id}` | **GET** | @destroy (`delete_classified_package`) | yox | tam — `DELETE /classified/packages/{id}` behind a confirm dialog |

Not admin screens (excluded): `customer_products` create/store/edit/update/destroy (customer panel), `customer_products_listing`, `customer_product/{slug}`, `customer_package_purchase` flows. `updateStatus` (the owner's own "Customer status" switch) is a customer action; the admin only sees the badge.

## 2. Field / behaviour diff

| Screen | AEC field / behaviour | v1 | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| 1 | columns: name, image, uploaded by, customer status, published | many more (`creator_type`, `condition`, `category`, `sku`, `discount`, …) | `name`, `thumbnail`, `owner`, `is_active`, `is_published` | table | v1 invented columns | rebuilt to the AEC five |
| 1 | search by name (`like %q%`), paginate 15, newest first | client-side filter | `?q=&page=&per_page=&sort=` (default `-created_at`) | server side | AEC full-table load | rebuilt |
| 1 | tab bar with one tab "All Classified Products" | – | – | – | pointless in AEC | dropped |
| 1 | `condition` filter (`conditon` column typo) | filter `condition` | – | – | storefront search feature, not an admin filter | dropped (open question 2) |
| 3 | `published` switch, permission `publish_classified_product`, demo-mode guard | `is_published` toggle | `is_published` switch + `classified.publish`; read-only badge without the permission | boolean | – | kept |
| 4 | single delete sends a GET and also deletes translations | `window.confirm` | `DELETE` + confirm dialog | – | AEC GET delete | fixed |
| 5 | bulk delete: `findOrFail` per id inside a loop (one missing id aborts the rest) | none | one `{ids}` request; server must delete in one transaction | – | AEC fragile | fixed in contract |
| 1 | "Create classified" does not exist in admin AEC | v1 create dialog with `creator_type`, price, stock, SEO | – | – | v1 invented | dropped (listings come from customers/sellers) |
| 7 | package fields: `name` (translatable), `amount`, `product_upload`, `logo` | – | `translations{az,en,tr,ru}` + `name` (az), `amount`, `product_upload`, `logo` | – | – | added |
| 7 | free package shown as `single_price(0)` | – | label "Free" | text | – | improved |
| 8–11 | validation: `amount` numeric, `product_upload` numeric, no sign/integer check, `logo` required | – | `amount ≥ 0`, `product_upload` whole `≥ 0`, `logo` required, default-language name required, names ≤ 255 | zod | AEC accepts negatives and decimals | fixed |
| 9/11 | "You cannot add more than one Free package" (server flash) | – | same rule in the dialog (`amount 0` rejected when another free package exists) + must be enforced by the API | – | – | kept |
| 10 | edit is per language via URL tabs, saving one language at a time | – | all four names in one dialog | – | – | simplified (open question 4) |
| 12 | delete removes translations then the package; purchases keep the id | – | confirm dialog | – | – | kept; API must refuse or null `customer_package_id` references (open question 5) |

## 3. Contract notes

| Call | Body | Answer |
|---|---|---|
| `GET /admin/classified/products?q&page&per_page&sort` | – | `{data: [{id,name,thumbnail,owner,is_active,is_published,created_at}], meta}` |
| `PATCH /admin/classified/products/{id}` | `{is_published}` | `{message}` |
| `DELETE /admin/classified/products/{id}` | – | `{message}` |
| `POST /admin/classified/products/delete` | `{ids: number[]}` | `{message}` (single transaction) |
| `GET /admin/classified/packages` | – | `{data: [{id,name,translations{az,en,tr,ru},amount,product_upload,logo}]}` |
| `POST /admin/classified/packages`, `PUT …/{id}` | `{translations, amount, product_upload, logo}` | `{message}`; 422 when a second free package is created |
| `DELETE /admin/classified/packages/{id}` | – | `{message}` |

## 4. Open questions

1. v1 had admin-side creation of listings (`creator_type: admin`). AEC has none (only customers and sellers upload). Dropped; should admins be able to post a listing?
2. The storefront filters `condition` (new/used), category, brand and location are not in the AEC admin table. Add them as server filters on `/admin/classified`?
3. "View" opens the storefront listing in AEC. admin2 has no storefront URL; give the API a `public_url` field so the table can link to it?
4. Package names per language: the dialog edits all four at once, AEC saves one language per request. API should accept the full `translations` object (default language is `az`, as in the other modules).
5. Deleting a package that customers already bought: refuse, or keep their remaining uploads? AEC just deletes the row.
6. Listing thumbnails are inline placeholders in the mock; real URLs come from the media module.
7. The sidebar group is shown only while the module is on (AEC: setting `classified_product`). The mock registers it enabled so it can be reviewed; the sidebar doc says add-on modules default to off. Change the seed?
