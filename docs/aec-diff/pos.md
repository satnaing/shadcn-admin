# pos — AEC vs v1 vs admin2

Module id `pos` · AEC addon `pos_system` (source: `D:\www\aec\addons\pos_system` — `routes/pos.php`, `controllers/PosController.php`, `controllers/Seller/PosController.php`, `Utility/PosUtility.php`, `views/backend/pos/*`, `views/seller/pos/*`; the path `public_html\addons\pos_system` named in the prompt does not exist). v1 source: `admin/src/features/pos` (terminal 472 lines, orders table, products table, configuration form).
Scope: admin **and** seller panel screens of the addon (one module, one sidebar group `panels: ['admin','seller']`; the seller role gets the same routes filtered by permission). Out of scope: customer/public views, `api_seller.php` (mobile app) endpoints, the order detail screen (`backend.sales.*` — orders module), GST addon fields.

Status legend: **tam** (full) · **natamam** (partial) · **yox** (missing). Totals: AEC screens **18**; v1 **0 tam / 8 natamam / 10 yox**; admin2 **17 tam / 1 not needed by design / 0 yox**.

## 1. AEC screens (step 1)

Admin routes: prefix `admin`, middleware `auth` + `admin`; staff permissions `pos_manager|pos_orders` (terminal/orders), `pos_configuration`. Seller routes: prefix `seller`, middleware `seller` + `verified`, same controller methods in `Seller\PosController` (own products only).

| # | Blade / partial | Route | HTTP | Controller@method | v1 | admin2 (route / UI) |
|---|---|---|---|---|---|---|
| 1 | `index` (terminal shell) | `/admin/pos` · `/seller/pos` | GET | @index | natamam (fake categories, `walk-in` select) | tam — `/admin/pos` (`PosTerminalPage`) |
| 2 | `products` partial + JSON search (16 per page, "Load more") | `/admin/pos/products` (`pos.search_product`) | GET | @search (`category`, `brand`, `keyword`) | natamam (no brand, no paging) | tam — `PosProductGrid` (debounced q, category + brand, `useInfiniteQuery` 16/page) |
| 3 | `variants` (modal "Select variation") | — (no route renders it) | — | dead view | yox | tam — every variant (stock row) is its own card |
| 4 | `cart` partial (add / qty / remove) | POST `/add-to-cart-pos` · `/update-quantity-cart-pos` · `/remove-from-cart-pos` | POST | @addToCart, @updateQuantity, @removeFromCart | natamam | tam — browser-side cart (`usePosCart`, rules in `data/pos-cart.ts`) |
| 5 | customer type toggle (Walk-in / Registered / Facebook / WhatsApp), registered select, phone/email suggestions | GET `/pos/search-customers` | GET | @getCustomers (3-char minimum) | yox | tam — `PosCustomerPanel` + `PosCustomerSearch` |
| 6 | `guest_shipping_address` | POST `/get_shipping_address`, `/set-shipping-address` | POST | @getShippingAddress, @set_shipping_address | yox | tam — `PosGuestForm` |
| 7 | `shipping_address` + `new-address-modal` | same + customer address create | POST | @getShippingAddress | yox | tam — `PosAddressList` + `PosAddressDialog` (country → state → city) |
| 8 | shipping cost + discount inputs | POST `/setShipping`, `/setDiscount` | POST | @setShipping, @setDiscount | natamam (discount only) | tam — in `PosCartPanel` |
| 9 | `order_summary` (modal `order-confirm`) | POST `/pos-order-summary` | POST | @get_order_summary | yox | tam — `PosSummaryDialog` |
| 10 | offline payment modals (`offlin_payment`, `offline_payment_modal`) | — | — | JS (`offline_payment` addon only) | yox | tam — `PosOfflineForm` |
| 11 | `change-customer` confirmation | POST `/update-session-user-cart-data` | POST | @updateSessionUserCartData | yox | not needed — the cart is not tied to a customer any more |
| 12 | order placement (Cash / COD / Offline) | POST `/pos-order` | POST | @order_store → `PosUtility::orderStore` | natamam (cash / card / split invented) | tam — `POST /admin/pos/orders` |
| 13 | `thermal_invoice` (mPDF) | `/pos/thermal-printer/{id}` | GET | @invoice | yox | tam — `GET /admin/pos/orders/{id}/receipt` → `{download_url, filename}` |
| 14 | `pos_activation` (admin: seller switch + print width) | `/admin/pos-activation` | GET | @configuration (`pos_configuration`) | natamam (invented printer / sound / header fields) | tam — `/admin/pos/config` (`PosActivationCard`, `PosPrintCard`) |
| 15 | `products` (POS product list: search, category, seller, sort, bulk remove) | `/admin/pos-products` | GET | @all_pos_products | natamam | tam — `/admin/pos/products` |
| 16 | product search / import modal | POST `/pos-products-search` · `/pos-products-update` | POST | @pos_products_search, @productUpdatetoPOS | yox | tam — `PosImportDialog` + `PUT /admin/pos/products` |
| 17 | POS orders (`backend.sales.index?order_from=pos`) | `/admin/pos-orders` | GET | @posOrders (`pos_orders`) | natamam | tam — `/admin/pos/orders` |
| 18 | seller `pos_activation` (`shop.thermal_printer_width`) | `/seller/pos-configuration` · POST `/seller/pos-configuration/update` | GET · POST | Seller @configuration, @posConfigurationUpdate | yox | tam — same `/admin/pos/config` print card, seller role (no activation card) |

## 2. Field diff (step 4)

| Screen | AEC field | v1 field | admin2 (our name) | Type | Diff | Action |
|---|---|---|---|---|---|---|
| terminal | `keyword` (name or exact barcode) | `search` | `q` | string | v1 client-only | server search, debounced 300 ms |
| terminal | `poscategory` (`category-<id>`, includes sub-categories) | hard-coded list | `category` (id) | id | v1 fake | from `/lookups`, filter includes children |
| terminal | `brand` | — | `brand` | id | missing | added |
| terminal | `stock_id` (variant row) | `product.id` | `PosStockItem.id` | int | wrong grain | a card = one stock row |
| cart | `min_qty`, stock check, digital only once | — | `data/pos-cart.ts` | rules | missing | same rules, tested |
| cart | `quantity` | `quantity` | `quantity` | int | same | clamped to stock and min |
| cart | `shipping` | — | `shipping_cost` | number ≥ 0 | missing | added |
| cart | `discount` (any ≥ 0) | `discount` | `discount` | number | AEC allowed discount > total (negative total) | capped at subtotal + tax + shipping |
| customer | `customer_type` → `order_source` | — | `order_source` (`walkin`/`registered`/`facebook`/`whatsapp`) | enum | missing | added |
| customer | `user_id`, `address_id` | `customer_id` | `customer_id`, `address_id` | id | v1 had no address | added |
| guest | `name`, `phone`, `email`, `address`, country/state fixed | — | `guest{name,phone,email,address}` | strings | AEC checked "phone or email" only in the controller | zod: name + address required, phone or email |
| address | `address`, `country_id`, `state_id`, `city_id`, `postal_code`, `phone` | — | `AddressFormValues` | — | missing | cascade selects, all required except postal code |
| payment | `payment_type` `cash` / `cash_on_delivery` / `offline_payment` | `cash` / `card` / `split` | `payment_type` | enum | v1 invented | AEC values |
| payment | `offline_payment_method`, `_amount` (readonly), `offline_trx_id`, `offline_payment_proof` | — | `offline{method, amount, trx_id, proof}` | — | missing | amount = order total, fixed |
| order | `payment_status` (`paid` unless COD) | — | `payment_status` | enum | same rule | server |
| order | `operator` (staff id) | `cashier_name` | `operator` | string | renamed | |
| orders | code, date, customer, source, items, total, payment, status | `order_code`, `cashier_name`, `items_count`, `subtotal`, `tax`, `discount`, `total_amount` | `code`, `date`, `customer`, `source`, `items_count`, `grand_total`, `payment_type`, `payment_status`, `operator` | — | v1 extra columns not in AEC | AEC set |
| products | name, category, seller, unit price, stock, rating, sort rating / price | `sku`, `barcode`, `price`, `stock` | `name`, `category`, `seller`, `unit_price`, `stock_qty`, `rating` | — | v1 `sku` invented | filters category + seller, row + bulk remove with confirmation |
| config | `pos_activation_for_seller` (switch) | — | `seller_activation` | bool | missing | admin-only switch |
| config | `print_width` (admin) / `thermal_printer_width` (seller shop), free text | `printer_type`, `barcode_sound`, `auto_open_cash_drawer`, `default_customer`, `receipt_header/footer` | `print_width` | int 30–300 mm | v1 invented 6 fields; AEC accepted any text | one validated field |

## 3. AEC defects fixed (not copied)

| # | AEC behaviour | admin2 |
|---|---|---|
| 1 | `PosUtility::product_search`: `where(name like) orWhere(barcode = x)` is not grouped, so a barcode search drops the published / approved / POS / owner filters and leaks other sellers' and unpublished products | the mock (and the API contract) group the match: `POS filters AND (name OR barcode)`; tested |
| 2 | Discount could exceed the order → negative `grand_total` | capped client side; API must cap too |
| 3 | `updatePosUserCartData` compares a stock **model** with a number (`$product_qty > $quantity`) when merging carts | no server cart, nothing to merge |
| 4 | Cart lives in a `carts` table keyed by the PHP session (`pos.temp_user_id`); changing the customer rewrites carts | browser-side cart, one request places the order |
| 5 | `order->seller_id = $product->user_id` takes the **last** cart line's owner | open question 2 |
| 6 | `print_width` stored as free text, receipt page crashes the PDF without it | validated integer; the UI warns before printing |
| 7 | Order stock deduction happens line by line, an out-of-stock line deletes the order after earlier lines were already deducted | API must validate all lines first and run in one DB transaction |

## 4. Open questions

1. `GET /admin/pos/lookups` (categories tree, brands, sellers, geo) is a module-local mock; the real API should either serve it or the terminal should use the catalogue endpoints.
2. A POS cart can mix inhouse and seller products; AEC stores one `seller_id` per order (last line). Split the order per seller (marketplace rule), or restrict a terminal to its own products (seller panel does, admin terminal sells inhouse only in AEC)?
3. The seller panel's product list must show only the seller's own POS products; the mock does not distinguish roles.
4. "Offline" payment is always shown; AEC shows it only when the `offline_payment` addon is active. Bind it to the payments module (#9) when that is migrated?
5. Receipt format: AEC renders a mPDF roll sized by `print_width`; the API contract here is `{download_url, filename}`.
6. Order detail / delivery update from the POS orders list belongs to the orders module; the code is shown as `#code` text until that route exists.
7. `PosUtility::orderStore` sends invoice e-mails and calls `calculateCommissionAffilationClubPoint`; the API must keep these inside the same transaction as the stock deduction (affiliate and club-point modules already depend on it).
