# wholesale — AEC vs v1 vs admin2

Module id `wholesale` · AEC addon `wholesale` 2.1 (core-merged) · source: `D:\www\prielaz\priel-az` (`routes/wholesale.php`, `app/Http/Controllers/WholesaleProductController.php`, `app/Services/WholesaleService.php`, `app/Http/Requests/WholesaleProductRequest.php`, `resources/views/wholesale/products/{index,create,edit}.blade.php`, `app/Models/WholesalePrice.php`, sidenav block in `backend/inc/admin_sidenav.blade.php`) · v1 `admin/src/features/products/wholesale/*` + `components/forms/product-wholesale-card.tsx` · admin2 `src/features/wholesale` (3 routes).
Note on sources: `D:\www\aec` has only `routes/wholesale.php`, the API controllers and the unit-fix addon — the web controller, service, request and blades exist only in `prielaz\priel-az` (the live site tree). `public_html` does not exist; `xshop\task\api\aec\46-wholesale.md` lists only the mobile-API controllers (its §3.1 is empty).
Scope: admin panel only. Seller panel (`seller/wholesale-products*`, 6 screens), the mobile API v2 controllers, the storefront wholesale pages and `wholesale-product-hsn-gst-assign` (GST addon) are out of scope.

Status legend: **tam** · **natamam** · **yox**. Totals: AEC admin screens **13**; v1 **0 tam / 9 natamam / 4 yox**; admin2 **9 tam / 4 natamam / 0 yox** (the 4 are the product create/edit pages and their store/update calls: they cover every field the wholesale request validates, plus the common product sections; sections that belong to the catalog module are missing, see §2).

## 1. AEC screens (step 1)

All routes: prefix `admin`, middleware `auth` + `admin`. Staff permissions: `view_all_wholesale_products`, `view_inhouse_wholesale_products`, `view_sellers_wholesale_products`, `add_wholesale_product`, `edit_wholesale_product`, `delete_wholesale_product`. The sidebar block shows only while the `wholesale` addon is active (module toggle in admin2).

| # | Blade | Route | HTTP | Controller@method (permission) | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `wholesale/products/index` (type "All") | `/wholesale/all-products?user_id=&type=&search=` | GET | @all_wholesale_products (`view_all_wholesale_products`) | natamam (client-side filter, hides products without bands) | tam — `/admin/wholesale` tab "All" |
| 2 | same blade ("In House") | `/wholesale/inhouse-products` | GET | @in_house_wholesale_products (`view_inhouse_wholesale_products`) | natamam (tab) | tam — `?owner=inhouse` tab |
| 3 | same blade ("Seller") | `/wholesale/seller-products` | GET | @seller_wholesale_products (`view_sellers_wholesale_products`) | natamam (tab) | tam — `?owner=seller` tab (shows the Approved switch) |
| 4 | `wholesale/products/create` (~25 cards) | `/wholesale-product/create` | GET | @product_create_admin (`add_wholesale_product`) | natamam (name, category, unit, price, stock, published, bands without max) | natamam — `/admin/wholesale/new` |
| 5 | create form POST | `/wholesale-product/store` | POST | @product_store_admin (`WholesaleProductRequest`, `WholesaleService@store`) | natamam | natamam — `POST /wholesale/products` |
| 6 | `wholesale/products/edit` | `/wholesale-product/{id}/edit?lang=` | GET | @product_edit_admin (`edit_wholesale_product`) | yox | natamam — `/admin/wholesale/$id` |
| 7 | edit form POST | `/wholesale-product/update/{id}` | POST | @product_update_admin (`WholesaleService@update`) | yox | natamam — `PUT /wholesale/products/{id}` |
| 8 | row "Delete" + confirm modal | `/wholesale-product/destroy/{id}` | **GET** | @product_destroy_admin (`delete_wholesale_product`) | natamam (no permission split) | tam — `DELETE /wholesale/products/{id}` behind a confirm dialog |
| 9 | bulk "Delete selection" + modal | core `products.bulk-product-delete` | POST | ProductController@bulk_product_delete | yox | tam — bulk bar, `POST /wholesale/products/delete` `{ids}` behind a confirm dialog |
| 10 | switch "Today's deal" | core `products.todays_deal` | POST | ProductController@updateTodaysDeal | natamam | tam — switch, `wholesale.edit` |
| 11 | switch "Published" | core `products.published` | POST | ProductController@updatePublished | natamam | tam — switch, `wholesale.edit` |
| 12 | switch "Approved" (seller tab, only when `product_approve_by_admin == 1`) | core `products.approved` | POST | ProductController@updateProductApproval | yox | tam — switch on the seller tab, `PATCH /wholesale/products/{id}/flag` |
| 13 | switch "Featured" | core `products.featured` | POST | ProductController@updateFeatured | natamam | tam — switch, `wholesale.edit` |

Rows 10–13 are the same four product switches the core product list uses; here they share one endpoint `PATCH /wholesale/products/{id}/flag` `{flag, value}`.

## 2. Field / behaviour diff

| Screen | AEC field / behaviour | v1 | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| 1–3 | 3 menu items → one blade (type switches title, hides the "Added by" column on In House) | 3 routes + 1 component, tabs in state | one list, `?owner=all\|inhouse\|seller`, permission per tab | server filter | AEC page reloads per list | merged into tabs |
| 1–3 | filters: seller select (`user_id`, all users loaded into one `<select>`), sort select (`type=col,dir` passed straight into `orderBy`), text search on name, paginate 15 | client-side search/status/sort | toolbar `seller` filter (lookup list), `?sort=` whitelist `id,name,num_of_sale,unit_price,rating,created_at`, `?q=`, `?page=&per_page=` | server side | AEC sort column was **not whitelisted** (SQL column injection) | fixed in contract: the server must whitelist the sort column |
| 1–3 | columns: name+image, added by, info (num of sale, base price, rating), total stock + "Low" badge, today's deal, published, approved (seller tab), featured, options | name, price, stock, published, featured, today's deal | `name`, `owner_name`, `num_of_sale`, `unit_price`, `rating`, price bands count, `stock` + Low badge, `is_todays_deal`, `is_published`, `is_approved`, `is_featured` | table | v1 had no sales/rating/approved columns and filtered out products without bands | rebuilt |
| 1–3 | row "View" link to storefront `route('product', slug)` | – | – | – | admin2 has no storefront routes | dropped (open question 3) |
| 1–3 | "Low" badge when `qty <= low_stock_quantity` | – | `stock <= low_stock_quantity` | boolean | – | kept |
| 4/6 | `name` required max 255 | text | `name` required, ≤ 255 | string | – | kept |
| 4/6 | `unit` — **free text** in the AEC wholesale forms, `<select>` of unit ids in the normal product form; `wholesale_unit_fix` addon patched it | text/select by name | `unit_id` select (id) | number | AEC type mismatch (`products.unit` held id or text) | fixed: always an id |
| 4/6 | `min_qty` numeric (min 1 in HTML only) | – | `min_qty` whole number ≥ 1 | int | AEC accepted `0.5` | tightened |
| 4/6 | `unit_price` required numeric `gt:0` | number | `unit_price` > 0 | decimal | – | kept |
| 4/6 | `current_stock` required numeric; `sku`; `low_stock_quantity`; `stock_visibility_state` (quantity/text/hide) | stock only | `current_stock` whole ≥ 0, `sku`, `low_stock_quantity`, `stock_visibility` | int/enum | AEC accepted negative/fraction stock | tightened |
| 4/6 | wholesale bands: `wholesale_min_qty[]`, `wholesale_max_qty[]`, `wholesale_price[]` — each only `required`; nothing checks order, overlap or that max ≥ min; nothing requires a band at all | `min_qty` + `price` (no max) | `tiers[]` `{min_qty, max_qty, price}`: ≥ 1 band, whole qty ≥ 1, max ≥ min, bands must not overlap, price > 0 | array | AEC allowed overlapping/inverted bands | fixed (the API must repeat these checks) |
| 4/6 | `category_ids[]` (tree, required) + `category_id` main radio (`Rule::in(category_ids)`) | single category | `category_ids[]` checkbox list + `category_id` select limited to the picked ones; the form keeps the main one inside the selection | number[] / number | AEC tree widget | kept (flat list, tree comes with catalog) |
| 4/6 | `brand_id`, `barcode`, `tags[]` (tag input → comma string), video provider + link | – | `brand_id`, `barcode`, `tags` (comma text), `video_provider`, `video_link` | – | – | kept (tag chips need the shared tag input, open question 5) |
| 4/6 | `thumbnail_img`, `photos` (gallery), `pdf` (spec), `meta_img` (media-library pickers) | – | `thumbnail`, `meta_image` single image field | string | gallery and PDF need the media module | **missing: gallery, PDF** (open question 4) |
| 4/6 | description (rich text), name/unit/description translations per language (`lang` param; update only writes the default language into `products`, others into `product_translations`) | – | `description` textarea, default language only | string | translations + rich text editor pending (Q-P2) | **missing: other languages, rich text** |
| 4/6 | discount: `discount`, `discount_type` (amount/percent), `date_range` ("a to b") | – | `discount_type` flat\|percent, `discount`, `discount_start`, `discount_end` | – | AEC accepted percent > 100 and flat ≥ price | tightened: percent ≤ 100, flat < base price, end ≥ start |
| 4/6 | shipping: `shipping_type` (free/flat_rate; update also `product_wise`), `flat_shipping_cost`, `est_shipping_days`, `is_quantity_multiplied` | – | `shipping_type` free\|flat, `shipping_cost`, `est_shipping_days`, `is_quantity_multiplied` | – | `product_wise` dropped (never offered by the form) | kept |
| 4/6 | switches: `cash_on_delivery`, `featured`, `todays_deal`; buttons "Save & Unpublish / Save & Publish" (`published` from the clicked button) | published only | `cash_on_delivery`, `is_featured`, `is_todays_deal`, `is_published` switches + one Save | boolean | two submit buttons replaced by a switch | kept |
| 4/6 | SEO: `meta_title`, `meta_description`, `meta_img` (default to name / stripped description / thumbnail) | – | `meta_title`, `meta_description`, `meta_image` | – | defaults are server-side | kept |
| 4/6 | flash deal (`flash_deal_id`, `flash_discount`, `flash_discount_type`), VAT/tax rows (`tax_id[]`, `tax[]`, `tax_type[]`), HSN & GST (gst addon), refund + refund note, warranty + note, frequently bought, club-point `earn_point` | – | – | – | owned by deals / tax / refund / catalog / club-point modules | **missing here on purpose** (open question 1) |
| 5 | `WholesaleService@store`: `$collection['tags'][0]` read without a check (crash when the tag input is missing), product + stock + bands saved without a transaction, categories/tax/flash deal/FBT/translation saved after | – | API contract: one transaction | – | AEC fragile | fixed in contract |
| 7 | `update` resets `cash_on_delivery`, `featured`, `todays_deal`, `is_quantity_multiplied` to 0 unless present in the request; deletes and re-creates all bands | – | form always sends every switch; bands sent as the full list | – | – | kept |
| 8 | `destroy` deletes translations, categories, stocks, taxes, FBT, last-viewed, cart and wishlist rows — **not the `wholesale_prices` rows** of the stock (orphans) | `window.confirm` | `DELETE` + confirm dialog; API must delete bands with the stock in one transaction | – | AEC leaves orphan rows | fixed in contract |
| 9 | bulk delete in core | none | one `{ids}` request | – | – | kept |
| 12 | `approved` switch only when business setting `product_approve_by_admin == 1`; seller products are created with `approved = 0` in that case | – | switch on the seller tab; the mock always shows it | boolean | the setting belongs to core Settings | kept (open question 2) |
| 1–3 | in-house vs seller product is `added_by` (`admin`/`seller`), owner is `user_id` | tabs by `added_by` | `owner_type`, `owner_id`, `owner_name` | – | – | renamed |

## 3. API contract used by the mock (`/admin/wholesale/*`)

| Call | Body / query | Response |
|---|---|---|
| `GET /lookups` | – | `{data: {categories, brands, units, sellers}}` (module-local lists; `sellers` = in-house owner + sellers) |
| `GET /products` | `?q&page&per_page&sort&owner=all\|inhouse\|seller&seller=` | `{data: WholesaleProduct[], meta}` (sort whitelist above) |
| `GET /products/{id}` | – | `{data: ProductFormValues & {id}}` |
| `POST /products`, `PUT /products/{id}` | `ProductFormValues` | `{message}` |
| `DELETE /products/{id}`, `POST /products/delete` | `{ids}` | `{message}` |
| `PATCH /products/{id}/flag` | `{flag: is_published\|is_featured\|is_todays_deal\|is_approved, value}` | `{message}` |

## 4. Open questions
1. Wholesale is "a product with `type=wholesale` plus price tiers" in the target data model (D18/E26). Until the catalog module exists the module carries its own product form with the common sections. When catalog lands, should this form collapse into the catalog product form (tiers card only), and the list become a `?type=wholesale` filter of the product list?
2. The Approved switch depends on core setting `product_approve_by_admin`; the module should read it from Settings instead of always showing the switch on the seller tab. And `seller_wholesale_product` (lets sellers add wholesale products, in business settings → vendor) is core Settings, not part of this module's screens — confirm.
3. The storefront "View" link needs a `public_url` from the API; not rendered now.
4. Gallery (`photos`) and PDF spec need a multi-file picker from the media module; single thumbnail + meta image only for now.
5. Tags are a comma-separated text field; the AEC tag input (chips) is not available as a shared component.
6. Seller-panel wholesale screens (list/create/edit/store/update/destroy) will be built with the seller panel; the manifest declares `panels: ['admin']` only.
7. The mock registers the module as active; `00-sidebar-architecture.md` says addon modules are off by default. Change the seed?
