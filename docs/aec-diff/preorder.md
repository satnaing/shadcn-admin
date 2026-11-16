# preorder — AEC vs v1 vs admin2

Module id `preorder` · AEC addon `preorder` (source: `D:\www\aec\addons\preorder` + `routes/preorder.php`; the path `public_html\addons\preorder` from the prompt does not exist, `D:\www\aec` is the live AEC tree) · v1 `admin/src/features/preorder` (2 files, **hard-coded mock arrays**, no API, no filters, English/Azerbaijani literals, "E44" label) · admin2 `src/features/preorder`.
Scope: admin panel only. Seller panel (`seller/preorder/*`, 14 routes) and customer/storefront routes (`preorder/*`, `all-preorder-products`, `how-to-preorder`) are out of scope.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC admin screens **19** (numbered rows; the dashboard partial and the row-action groups belong to their screen); v1 **0 tam / 2 natamam / 17 yox**; admin2 now **17 tam / 2 natamam / 0 yox** (natamam = product create and edit).

## 1. AEC screens (step 1)

| # | Blade (`views/preorder/backend/…`) | Route (prefix `admin/preorder`) | HTTP | Controller@method | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `dashboard/index` + `dashboard_by_products_section` | `/dashboard` · `/dashboard/preorder-by-products-section` | GET · POST | DashboardController@index · @preorderByProductsSection | yox | tam — `/admin/preorder` (cards link to filtered orders, lazy sales chart, top-products with owner switch) |
| 2 | `products/index` | `/preorder-product` | GET | PreorderProductController@index (`user_type`, `type`=sort, `search`) | natamam (static table of 2 rows, no search/paging) | tam — `/products` (owner tabs, state filter, server q/sort/page) |
| 3 | `products/create` | `/preorder-product/create` · POST `/preorder-product` | GET · POST | @create · @store | yox | natamam — `/products/new` |
| 4 | `products/edit` | `/preorder-product/edit/{id}` · PUT `/preorder-product/{id}` | GET · PUT | @edit · @update | yox | natamam — `/products/$id` |
| – | product row actions | `/preorder-product/published` · `/featured` · `/show-on-homepage` · `/approval` · `/destroy/{id}` · `/bulk-destroy` | POST/GET | @preorder_product_published/featured/show_on_homepage/preorderProductApproval/destroy/bulkProductDestroy | yox | tam — switches in the list (`PATCH …/products/:id/flags`), confirm delete, bulk delete |
| 5 | `orders/index` | `/all-order-list` · `/inhouse-order-list` · `/seller-order-list` · `/delayed-prepayment-preorders-list` · `/delayed-final-orders-list` | GET ×5 | OrderController@order_list (`order_status`, `date`, `search`) | natamam (3 mock rows, tabs without data logic) | tam — `/orders` (scope tabs + stage tabs with counts + date range + search; one route instead of 5) |
| 6 | `orders/show` | `/order/{id}` · PUT `/order/update/{id}` | GET · PUT | @show · @order_status_update → `PreorderService@preorderStatusUpdate` | yox | tam — `/orders/$id` (info cards + 6-step workflow; accept/deny dialog with note, shipping proof) |
| – | order actions | `/order/destroy/{id}` · `/bulk-preorder-delete` · `/prepayment-final-preorder-reminder` | GET · POST · POST | @destroy · @bulkPreorderDelete · @prepaymentFinalPreorderReminder | yox | tam — delete, bulk delete, bulk reminder (delayed lists only) |
| 7 | `invoices/invoice` | `preorder/invoice-download/{id}` · `/invoice-preview/{id}` | GET | OrderController@invoice_download/preview (PDF) | yox | tam — "Download invoice" → `{download_url, filename}` (PDF rendering is the API's job; the mock returns a text file) |
| 8 | `settings/index` | `/preorder-settings` (+ `business_settings.update`) | GET · POST | PreorderController@preorderSettings | yox | tam — `/settings` |
| 9 | `commission_history/index` | `/preorder-commission-history` | GET | PreorderCommissionHistoryController@index (`seller_id`, `date_range`) | yox | tam — `/commissions` (q covers seller + order code; from/to dates) |
| 10 | `conversations/index` | `/conversations` | GET | PreorderConversationController@adminIndex | yox | tam — `/conversations` |
| 11 | `conversations/show` | `/conversations/{id}/show` · POST `/conversations/message-reply` · GET `/conversations/destroy/{id}` | GET · POST · GET | @adminShow · @messageReply · @conversationDestroy | yox | tam — thread dialog with reply box + confirm delete (page → dialog) |
| 12 | `faqs/index` (+ create form) | `/faqs` | GET · POST | FaqController@index · @store | yox | tam — `/faqs` (create dialog, search) |
| 13 | `faqs/edit` | `/faq/edit/{id}` · PUT `/faqs/{id}` · POST `/faq/update-status` · GET `/faq/destroy/{id}` | GET · PUT · POST · GET | @edit · @update · @updateStatus · @destroy | yox | tam — edit dialog with 4 language tabs, status switch, delete |
| 14 | `product_query/index` | `/preorder-product-queries` | GET | PreorderProductQueryController@index | yox | tam — `/queries` (all / not replied / replied) |
| 15 | `product_query/show` | `/preorder-product-queries/{id}` · PUT | GET · PUT | @show · @reply | yox | tam — answer dialog (page → dialog) |
| 16 | `product_reviews/index` | `/preorder-product-reviews` | GET | PreorderProductReviewController@adminIndex (`search`, `rating`, `seller_id`) | yox | tam — `/reviews` (owner tabs, sort by rating, "new" badge) |
| 17 | `product_reviews/detail_reviews` | `/preorder-product/reviews/detail-reviews/{id}` · POST `/preorder-product/reviews/update-status` | GET · POST | @detailReviews · @updateStatus | yox | tam — dialog with per-review publish switch |
| 18 | `notification_types/index` | `/preorder-notification-types` | GET | NotificationTypeController@index (`notification_user_type`, `notification_type_sort_search`) | yox | tam — `/notifications` (customer/seller/admin tabs, status switch) |
| 19 | `notification_types/edit` | `/preorder-notification/edit/{id}` · PUT | GET · PUT | @edit · @update (`lang`, `name`, `default_text`, `image`) | yox | tam — edit dialog with 4 language tabs + icon |

## 2. Field / behaviour diff

### Product form (screens 3–4)
| AEC input | admin2 name | Type | Status |
|---|---|---|---|
| `product_name` (+ per-language via `lang`) | `name` | string, required | tam (default language only) |
| `category_id`, `category_ids[]` | `category_id` | id, required | natamam — AEC also attaches several categories; one main category only |
| `brand_id` | `brand_id` | id\|null | tam |
| `unit`, `weight`, `min_qty`, `barcode` | same | string/number | tam |
| `thumbnail`, `images[]` | `thumbnail` | string | natamam — gallery missing (image picker is single-file) |
| `video_provider`, `video_link` | same (`none` instead of empty) | enum, string | tam |
| `description` | `description` | textarea | tam (rich text editor pending the package decision, Q-P2) |
| `unit_price`, `price_type` | `unit_price` | number > 0 | `price_type` dropped (unused in the AEC flow) |
| `discount_type`, `discount`, `date_range` | `discount_type`, `discount`, `discount_start`, `discount_end` | enum, number, datetime | tam — two datetime fields replace the "A to B" string; rule tightened (see below) |
| `available_date`, `is_available` | `available_date` | date | tam — "available now" is derived from the date |
| `is_published`, `is_featured`, `is_show_on_homepage` | same | bool | tam |
| `add_wholesale_price`, `is_sample_order`, `show_lead_time` | `wholesale`, `sample_order`, `show_lead_time` | bool | natamam — flags only; wholesale price tiers and sample-order pricing need the wholesale module |
| `is_prepayment`, `prepayment_type`, `prepayment_amount` | `prepayment.{enabled,type,amount}` | | tam |
| `is_coupon`, `coupon_code`, `coupon_type`, `coupon_amount`, `coupon_benefits`, `coupon_instructions` | `coupon.{enabled,code,type,amount,instructions}` | | natamam — `coupon_benefits` (free-text list) not included |
| `is_Advance_discount` + 4 fields | `advance.{enabled,after_type,after_amount,direct_type,direct_amount}` | | tam |
| `is_refundable`, `show_refund_note`, `refund_note_id` | `refund.{enabled,show_note,note_id}` | | tam |
| `shipping_type`, `shipping_time`/`est_shipping_days`, `show_shipping_time`, `min/max_shipping_days`, `show_shipping_note`, `shipping_note_id` | `shipping.{type,min_days,max_days,show_time,show_note,note_id}` | | tam — `shipping_time` merged into min/max days |
| `is_cod`, `prepayment_needed`, `show_cod_note`, `delivery_note_id` | `cod.{enabled,prepayment_needed,show_note,note_id}` | | tam |
| `is_stock_visibility` + 7 fields | `stock.{enabled,visibility,current,low,low_warning,custom_order_show,preorder_quantity,final_quantity}` | | tam |
| `meta_title`, `meta_description`, `meta_image` | same | | tam |
| `frequently_bought_*`, `pre_order_product_ids` (more products), `campaign` | — | | **yox** (product pickers; needs catalogue picker API) |
| taxes (`Tax` list) | — | | **yox** (tax module not migrated) |
| `lang` switch on edit | — | | **yox** (other-language name/description) |

Validation (AEC `store`/`update`): required name/category/unit/price kept. Fixed AEC weaknesses: `prepayment_amount` is checked against the price only when a deposit is enabled and is also required > 0; `discount`/`coupon_amount` percent ≤ 100, flat < price; discount end ≥ start; shipping max days ≥ min days; coupon code required when the coupon is on.

### Orders (screens 5–6)
| AEC | admin2 | Note |
|---|---|---|
| route name selects the list (`Route::currentRouteName()`) | `?scope=all\|inhouse\|seller\|delayed_prepayment\|delayed_final` | one route, URL-driven |
| `order_status` (9 values) | `?stage=` same 9 values, counts from `GET /orders/counts?scope=` | AEC `final_preorders` uses `where('final_order_status', [1,2])` (buggy array compare) → implemented as pending or accepted |
| `date` "A to B" | `?from=&to=` | |
| `search` (order code only) | `q` (code, product, customer, seller) | broader |
| step fields `preorder_request_status` / `prepayment_confirm_status` (+`prepayment_note`) / `final_order_status` (+`final_oder_note`) / `shipping_status` (+`shipping_proof`,`shipping_note`) / `delivery_status` (+`delivery_note`) / `refund_status` (+`seller_refund_note`) with status 0/1/2/3 | `steps.{request,prepayment,final,shipping,delivery,refund}` = `none\|pending\|accepted\|denied`; `PUT /orders/:id/steps/:step {status, note, proof}` | one endpoint; the "complete the previous step" guard is the shared helper `canSetStep` (UI disables, mock refuses) |
| `preorder_cancel_request` branch | — | **yox**: cancelling by the admin is not a documented admin action (customer-side); open question Q4 |
| seller commission on delivery (`preorder_seller_commission`, `admin_to_pay`, `PreorderCommissionHistory`) | mock books a commission row when a seller order is delivered | the real API must do the balance change in one DB transaction |
| notifications (`PreorderNotificationUtility`) | none in the UI | API side |
| prepayment step hidden when the product has no deposit; refund step only for refundable products | same | |
| `is_viewed` set on `show` | `GET /orders/:id` marks it viewed, list shows a "New" badge | |

### Settings (screen 8) — all `business_settings` keys
`seller_preorder_product` → `allow_seller_products`, `preorder_seller_commission` → `seller_commission` (0–100 now validated), `image_for_faq_advertisement` → `faq_banner`, `preorder_flat_rate_shipping` → `flat_shipping_rate`, `preorder_request_instruction` → `request_instruction`, `image_for_payment_qrcode` → `payment_qr`, `pre_payment_instruction` → `prepayment_instruction`. AEC saved the switch immediately by AJAX and the rest through four separate forms; admin2 has one form (the switch is saved with it).

### Other screens
| Screen | AEC inputs | admin2 | Status |
|---|---|---|---|
| FAQ | `question`, `answer`, `lang` | `translations.{az,en,tr,ru}.{question,answer}`; list shows az | tam |
| Notification type | `name`, `default_text`, `image`, `lang`; list filter by `user_type` | `translations.*`, `image` | tam — AEC strips `' " , ; { } \r \n` from `default_text`; server side |
| Query reply | `reply` | `reply` (re-answering overwrites) | tam |
| Review moderation | `id`, `status` | `PATCH …/reviews/:id/status {is_published}` | tam |
| Conversation reply | `conversation_thread_id`, `message` | `POST …/conversations/:id/reply {message}` | tam |

## 3. What v1 had
One page (`admin-preorder-page.tsx`, 353 lines) with hard-coded orders/products and a made-up status enum (`preorder_placed`, `in_production`, `arrived_warehouse`, …) that does not exist in AEC; a seller page (132 lines, out of scope). None of it was reused except the idea of order tabs; the data model follows AEC's six-step workflow.

## 4. Open questions
1. **Lookup endpoint:** `GET /admin/preorder/lookups` (categories, brands, notes) is a module-local mock because the catalogue/brands modules are not migrated. Should the real API expose it or should the form use the catalogue endpoints? Same for the missing product pickers (related / frequently bought) and taxes.
2. **API plan gap:** `xshop\task\api\aec\47-preorder.md` §3.1 lists no admin screens ("0 detailed") and no dashboard/notification-type controllers; endpoints used here follow the AEC controllers, not an approved plan — the PM should confirm the list in `ENDPOINTS.PREORDER`.
3. **Gallery images** and **multiple categories** need a multi-image picker component (no new package, but a shared component).
4. **Admin cancel** of a preorder (`preorder_cancel_request` is a customer action in AEC) — keep customer-only?
5. **Seller commission transaction:** commission history + `admin_to_pay` change + notification must be one transaction in the real API.
6. **Module default state:** `00-sidebar-architecture.md` says preorder is *off by default*; the mock registers it enabled (like qrcode-event/refund) so it can be browsed — switch the seed if the default must be off.
7. Rich-text description: still the plain textarea (Q-P2).
