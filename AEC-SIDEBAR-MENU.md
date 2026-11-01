# AEC Sidebar Menyu Xəritəsi

> **Mənbələr:**
> - Admin: `resources/views/backend/inc/admin_sidenav.blade.php` (212 leaf ekran)
> - Satıcı (Seller): `resources/views/seller/inc/seller_sidenav.blade.php` (49 leaf ekran)
> - Kuryer (Delivery Boy): `addons/delivery_boy/views/delivery_boys/frontend/inc/delivery_boy_sidenav.blade.php` (11 ekran)
> - Müştəri (Customer): `resources/views/frontend/inc/user_side_nav.blade.php` (18 ekran)

---

## 0. İzləmə (bu fayl həm xəritə, həm progress izləyicisidir)

Hər ekranın qarşısına status qoyulur. Bölüm bitəndə həmin bölümün bütün sətirləri işarələnir.

| İşarə | Mənası |
|---|---|
| (boş) | başlanmayıb |
| 🔄 | yazılır (cari bölüm) |
| ✅ | bitdi — `build` + `lint` yaşıl, fixture ilə gəzilir |
| ⏭ | Faza D-ə təxirə salınıb (addon ekranları) |
| ⊘ | köçürülmür (qərar: `task/admin/README.md` §1 sonu) |

**Qrup → bölüm faylı** (`D:\www\xshop\task\admin\`):

| Sidebar qrupu | Bölüm faylı | Panel |
|---|---|---|
| Dashboard | `01-dashboard.md` | A |
| Products → Product Setup | `02-catalog.md` | A |
| Products → Products / Operation | `03-products.md` | A |
| Orders & Sales → Sales | `04-orders.md` | A |
| Users → Customers | `05-customers.md` | A |
| Users → Sellers | `06-sellers.md` | A |
| Marketing → Promotion & Offers | `07-promotions.md` | A |
| Marketing → Marketing | `08-marketing.md` | A |
| Marketing Analytics | `09-analytics.md` | A |
| Report Center | `10-reports.md` | A |
| Content & Design → görünüş / CMS | `11-appearance.md` | A |
| Content & Design → AI Studio | `12-ai-studio.md` | A |
| Content & Design → Uploaded Files | `13-media.md` | A |
| Communication | `14-communication.md` | A |
| Integrations → Payment Gateways | `15-payments.md` | A |
| Integrations → OTP System | `16-otp.md` | A |
| Integrations → Shipping System | `17-courier.md` | A |
| Settings → Setup & Configurations | `18-settings.md` | A |
| Settings → Shipping | `19-shipping.md` | A |
| Seller Packages (Users → Sellers altında) | `23-seller-packages.md` — çoxölçülü limit matrisi (E29) | A |
| Settings → Staffs | `20-staff.md` — əsas hissəsi pilotla **hazırdır** (`features/users`, `role`, `permission`) | A |
| Settings → System + Addon Manager | `21-system.md` | A |
| **Satıcı paneli** (49 ekran) | `30-vendor-foundation.md` … `36-vendor-shop.md` — 15 ekran admin ekranının `scope='seller'` variantıdır (E13) | S |
| **Kuryer paneli** (11 ekran) | `37-courier.md` — 12 AEC ekranı → **6 real ekran** (6 status filtri bir siyahıdır) | K |
| **Müştəri paneli** (18 ekran) | ⊘ bu layihədə yoxdur — storefront Next.js-dədir (`front/`) | — |
| **Wholesale Products** | `22-wholesale.md` — öz bölümü, lakin `03-products` feature-ı `type=wholesale` ilə (E26) | A+S |
| **GST System** | ⊘ köçürülmür — Hindistan vergi sistemi (HSN/CGST/SGST); AZ·RU·TR·GE üçün adi ƏDV `18-settings`-dədir (E27) | — |
| **Supervisor (reseller) paneli** (AEC-də yoxdur) | `38-supervisor.md` — 4-cü nav ağacı `/supervisor` (E32, api D25) | Sv |
| **Mağazalar (multi-store)** (AEC-də yoxdur) | `24-stores.md` — tək mağazada menyuda görünmür (E30, api D23) | A |
| **Dropshipping** | ⏭ plan həcmində yoxdur — gələcəkdə ayrı modul (E28, api D20) | A |
| **POS System** | `25-pos.md` — core-a qaytarıldı (E33), satıcı tərəfi `scope=seller` | A+S |
| **Kuryerlər** (satıcının öz kuryerləri) | `seller.couriers` → `30`–`36` bloku; kuryer paneli `37-courier` eynidir (E34, api D26) | S+K |
| Auction · Refund · Preorder · Delivery Boy (admin) · Affiliate · Club Point | ⏭ Faza D (`40`–`47`) | A+S |

**Panel və rol qatı** (dörd nav ağacı `/admin`·`/seller`·`/courier`·`/supervisor`, altı rol): `00b-panels-and-roles.md`.

**Qeyd:** bu fayldaki `can:` adları AEC-dəndir — **köçürülmür**. xshop formatı `<modul>.<əməliyyat>` (`task/admin/README.md` E3).

---

## 1. Admin Paneli

### Dashboard
- **Dashboard** · `admin.dashboard` · can: `admin_dashboard`

### Products
- **Product Management** · `—` · can: `view_product_management_dashboard, add_new_product, show_all_products, show_in_house_products, show_seller_products, add_digital_product, edit_digital_product, product_bulk_import, product_bulk_export, view_product_categories, view_all_brands, brand_bulk_upload, view_product_attributes, view_colors, view_product_warranties, smart-bar, view_custom_label, view_product_reviews, view_notes, add_note`
  - **Product Home** · `products.dashboard`
  - **Products** · `—`
    - **All Products** · `products.all` · can: `show_all_products, show_in_house_products, show_seller_products, add_new_product, add_digital_product`
    - **In House Products** · `products.admin`
    - **Seller Product** · `products.seller`
    - **Add New product** · `products.create`
    - **Add New Digital Product** · `digitalproducts.create`
  - **Product Setup** · `—`
    - **Category** · `—`
      - **Category** · `categories.index` · can: `view_product_categories, category_bulk_upload`
      - **Bulk Import/Export** · `category_bulk_upload.index`
    - **Brand** · `—`
      - **All Brands** · `brands.index` · can: `view_all_brands, brand_bulk_upload`
      - **Bulk Import/Export** · `brand_bulk_upload.index`
    - **Colors** · `colors`
    - **Attribute** · `attributes.index`
    - **Unit** · `unit.index`
    - **Size Guide** · `—`
      - **Size Chart** · `size-charts.index` · can: `view_size_charts, view_measurement_points`
      - **Measurement Points** · `measurement-points.index`
    - **Warranty** · `warranties.index`
    - **Notes** · `—`
      - **Note List** · `note.index` · can: `view_notes, add_note`
  - **Product Operation** · `—`
    - **Product Reviews** · `reviews.index` · can: `view_product_reviews, smart-bar, view_custom_label, product_bulk_export, product_bulk_import`
    - **Smart Bar** · `smart.bar`
    - **Custom Label** · `custom_label.index`
    - **Bulk Import** · `product_bulk_upload.index`
    - **Bulk Export** · `product_bulk_export.index`
- **Auction Products** · `—` · can: `add_auction_product, view_all_auction_products, view_inhouse_auction_products, view_seller_auction_products, view_auction_product_orders`
  - **Add New auction product** · `auction_product_create.admin`
  - **All Auction Products** · `auction.all_products`
  - **Inhouse Auction Products** · `auction.inhouse_products`
  - **Seller Auction Products** · `auction.seller_products`
  - **Auction Products Orders** · `auction_products_orders`
- **Wholesale Products** · `—` · can: `add_wholesale_product, view_all_wholesale_products, view_inhouse_wholesale_products, view_sellers_wholesale_products`
  - **Add New Wholesale Product** · `wholesale_product_create.admin`
  - **All Wholesale Products** · `wholesale_products.all`
  - **In House Wholesale Products** · `wholesale_products.in_house`
  - **Seller Wholesale Products** · `wholesale_products.seller`

### Orders & Sales
- **Sales** · `—` · can: `view_all_orders, view_inhouse_orders, view_seller_orders, view_pickup_point_orders`
  - **All Orders** · `all_orders.index`
  - **Inhouse orders** · `inhouse_orders.index`
  - **Seller Orders** · `seller_orders.index`
  - **Pick-up Point Orders** · `pick_up_point.index`
  - **Unpaid Orders** · `unpaid_orders.index`
- **POS System** · `—`
  - **POS Manager** · `poin-of-sales.index`
  - **POS Configuration** · `poin-of-sales.activation`
  - **POS Orders** · `pos.orders`
  - **POS Products** · `admin.pos.products`
- **Refunds** · `—` · can: `view_refund_requests, view_approved_refund_requests, view_rejected_refund_requests, refund_request_configuration, set_category_wise_refund`
  - **Refund Requests** · `refund_requests_all`
  - **Dispute Refund Requests** · `dispute_refund_requests_all`
  - **Refund Configuration** · `refund_time_config`
  - **Refund Reasons** · `refund_reason_index`
  - **Category Based Refund** · `categories_wise_product_refund`
- **Preorder** · `—` · can: `preorder_dashboard, add_preorder_product, view_all_preorder_products, view_all_preorders, view_all_inhouse_preorders, view_all_seller_preorders, view_all_delayed_prepayment_preorders, view_all_final_preorders, view_preorder_seller_commission_history, preorder_settings, view_all_preorder_product_conversations, view_all_preorder_product_queries, view_all_preorder_product_reviews, view_all_faqs, view_all_preorder_notification_types`
  - **Preorder Home** · `preorder.dashboard`
  - **Add New Preorder products** · `preorder-product.create`
  - **Preorder Products** · `preorder-product.index`
  - **Orders (Preorder)** · `—`
    - **All Orders** · `all_preorder.list` · can: `view_all_preorders, view_all_inhouse_preorders, view_all_seller_preorders, view_all_delayed_prepayment_preorders, view_all_final_preorders`
    - **Inhouse Orders** · `inhouse_preorder.list`
    - **Seller Orders** · `seller_preorder.list`
    - **Delayed Prepayment** · `delayed_prepayment_preorders.list`
    - **Delayed Final Orders** · `delayed_final_orders.list`
  - **Preorder Product Conversation** · `preorder-conversations.admin_index`
  - **Preorder Product Queries** · `preorder.product_query.index`
  - **Preorder Product Reviews** · `preorder.product_reviews.index`
  - **Preorder Notification Types** · `preorder-notification-types.index`

### Users
- **Customers** · `—` · can: `view_all_customers, view_classified_products, view_classified_packages`
  - **Customer list** · `customers.index`
  - **Unverified Customers** · `customers.unverified.index`
  - **Classified Products** · `classified_products`
  - **Classified Packages** · `customer_packages.index`
- **Sellers** · `—` · can: `view_all_seller, seller_payment_history, view_seller_payout_requests, seller_commission_configuration, view_all_seller_packages, seller_verification_form_configuration, set_category_wise_commission, set_seller_based_commission`
  - **All Seller** · `sellers.index`
  - **Applied Seller** · `sellers.registration_pending`
  - **Seller Rating & Followers** · `sellers.rating_followers`
  - **Payouts** · `sellers.payment_histories`
  - **Payout Requests** · `withdraw_requests_all`
  - **Seller Commission** · `business_settings.vendor_commission`
  - **Seller Based Commission** · `seller_based_commission`
  - **Category Based Commission** · `categories_wise_commission`
  - **Seller Packages** · `seller_packages.index`
  - **Seller Verification Form** · `seller_verification_form.index`
- **Delivery Boy** · `—` · can: `view_all_delivery_boy, add_delivery_boy, delivery_boy_payment_history, collected_histories_from_delivery_boy, order_cancle_request_by_delivery_boy, delivery_boy_configuration`
  - **All Delivery Boy** · `delivery-boys.index`
  - **Add Delivery Boy** · `delivery-boys.create`
  - **Payment Histories** · `delivery-boys-payment-histories`
  - **Collected Histories** · `delivery-boys-collection-histories`
  - **Cancel Request** · `delivery-boy.cancel-request`
  - **Configuration** · `delivery-boy-configuration`

### Marketing & Promotions
- **Promotion & Offers** · `—` · can: `view_promotion_and_offers_dashboard, view_all_flash_deals, todays_deal_products.index, view_all_coupons, set_category_wise_discount, view_promotional_product`
  - **Promotion & Offers Home** · `promotion_and_offers_dashboard`
  - **Promotional Product** · `promotional_products.index`
  - **Seller Promotional Product** · `seller_promotional_products.index`
  - **Flash Sales** · `flash_deals.index`
  - **Category Based Discount** · `categories_wise_product_discount`
  - **Coupon** · `coupon.index`
- **Marketing** · `—` · can: `view_all_dynamic_popups, view_all_custom_alerts, manage_email_templates, send_newsletter, notification_settings, view_all_notification_types, send_custom_notification, view_custom_notification_history, send_bulk_sms, view_all_subscribers, view_blogs, view_blog_categories`
  - **Marketing Home** · `marketing_dashboard`
  - **Dynamic Pop-up** · `dynamic-popups.index`
  - **Custom Alert** · `custom-alerts.index`
  - **Custom Sell Alert** · `custom-sale-alerts.index`
  - **Email Templates** · `all_email_templates.index`
  - **Blog System** · `—`
    - **All Blog Posts** · `blog.index` · can: `view_blogs, view_blog_categories`
    - **Categories** · `blog-category.index`
  - **Newsletters** · `newsletters.index`
  - **Notification** · `—`
    - **Notification Types** · `notification-type.index` · can: `notification_settings, view_all_notification_types, send_custom_notification, view_custom_notification_history`
    - **Custom Notification** · `custom_notification`
    - **Custom Notification History** · `custom_notification.history`
    - **Settings** · `notification.settings`
  - **Bulk SMS** · `sms.index`
  - **Subscribers** · `subscribers.index`
  - **Custom Visitors** · `custom_product_visitors`
- **Marketing Analytics** · `—` · can: `manage_google_analytics, manage_pixel_analytics, manage_sitemap_generator, manage_custom_script`
  - **Marketing Analytics Home** · `marketing_analytics_dashboard`
  - **Google Analytics (GA4)** · `google-analytics-config`
  - **Google Analytics Reports** · `google-analytics-test.result`
  - **Google TAG Manager** · `google-tag-manager-config`
  - **Meta Pixel** · `pixel_analytics.index`
  - **Meta Conversion API** · `pixel_conversation_api.index`
  - **Google Marchant Center** · `—`
    - **Configuration** · `google_merchant_center.configuration` · can: `delete_gmc_product, edit_gmc_product, add_gmc_product`
    - **Generate Feed** · `google_merchant_center.feed`
  - **Facebook Catalogue** · `—`
    - **Configuration** · `facebook_catalogue.configuration` · can: `delete_gmc_product, edit_gmc_product, add_gmc_product`
    - **Generate Feed** · `facebook_catalogue.feed`
  - **Custom Script** · `custom_script`
  - **Sitemap Generator** · `sitemap_generator`
  - **Global SEO** · `global_seo`
- **Affiliate System** · `—` · can: `affiliate_registration_form_config, affiliate_configurations, view_affiliate_users, view_all_referral_users, view_affiliate_withdraw_requests, view_affiliate_logs`
  - **Affiliate Registration Form** · `affiliate.configs`
  - **Affiliate Configurations** · `affiliate.index`
  - **Affiliate Users** · `affiliate.users`
  - **Referral Users** · `refferals.users`
  - **Affiliate Withdraw Requests** · `affiliate.withdraw_requests`
  - **Affiliate Logs** · `affiliate.logs.admin`
- **Club Point System** · `—` · can: `club_point_configurations, set_club_points, view_users_club_points`
  - **Club Point Configurations** · `club_points.configs`
  - **Set Product Point** · `set_product_points`
  - **User Points** · `club_points.index`

### Report
- **Report Center** · `—` · can: `earning_report, in_house_product_sale_report, seller_products_sale_report, products_stock_report, product_wishlist_report, user_search_report, commission_history_report, wallet_transaction_report`
  - **Earning Report** · `earning_payout_report.index`
  - **In House Product Sale** · `in_house_sale_report.index`
  - **Seller Products Sale** · `seller_sale_report.index`
  - **Products Stock** · `stock_report.index`
  - **Products wishlist** · `wish_report.index`
  - **User Searches** · `user_search_report.index`
  - **Commission History** · `commission-log.index`
  - **Wallet Recharge History** · `wallet-history.index`

### Content & Design
- **Design Studio** · `—` · can: `view_website_dashboard, header_setup, footer_setup, view_all_website_pages, website_appearance, authentication_layout_settings, top_banner_setting, view_top_banner`
  - **Design Studio Home** · `website.dashboard`
  - **Select Homepage** · `website.select-homepage`
  - **Homepage Settings** · `custom-pages.edit`
  - **Font Family** · `website.select-font-family`
  - **Authentication Layout & Settings** · `website.authentication-layout-settings`
  - **Select Header** · `website.select-header`
  - **Header Settings** · `website.header`
  - **Top Bar** · `—` · can: `view_top_banner, top_banner_setting`
    - **Top Bar List** · `top_banner.index`
    - **Top Bar Settings** · `top_banner.setting`
  - **All Category Layout** · `select_all_category_layout`
  - **Product Details** · `product_details_section`
  - **Select Footer** · `website.select-footer`
  - **Footer Settings** · `website.footer`
  - **Pages** · `website.pages`
  - **System Setup** · `website.system_setup`
  - **Appearance** · `website.appearance`
  - **Logo & Favicon** · `website.logo_and_favicon`
  - **Banners & Sliders** · `website.banners_and_sliders`
  - **Element** · `—`
    - **All Elements** · `elements.index`
- **AI Studio** · `—` · can: `manage_ai_configuration`
  - **Add/Edit Product With AI** · `ai-add_edit_products`
  - **Prompt Templates** · `ai-prompt-templates-config`
  - **Token Usage** · `ai-token-usege`
  - **AI Configuration** · `ai-config`
- **Uploaded Files** · `uploaded-files.index`

### Communication
- **Support & Communication** · `—` · can: `view_all_support_tickets, view_all_product_conversations, view_all_product_queries`
  - **Ticket** · `support_ticket.admin_index`
  - **Product Conversations** · `conversations.admin_index`
  - **Product Queries** · `product_query.index`
  - **Seller Requests** · `seller_requests.index`
  - **Contacts** · `contacts`

### Integrations
- **Payment Gateways** · `—`
  - **Payment Methods** · `payment_method.index` · can: `payment_methods_configurations, african_pg_configuration, african_pg_credentials_configuration, view_all_manual_payment_methods, view_all_offline_payment_orders, view_all_offline_wallet_recharges, view_all_offline_customer_package_payments, view_all_offline_seller_package_payments, asian_payment_gateway_configuration`
  - **Cybersource Payment Gateway** · `cybersource_configuration`
  - **Asian Payment Gateway** · `paytm.index`
  - **African Payment Gateway** · `african_credentials.index` · can: `african_pg_configuration, african_pg_credentials_configuration`
  - **Offline Payment System** · `—` · can: `view_all_manual_payment_methods, view_all_offline_payment_orders, view_all_offline_wallet_recharges, view_all_offline_customer_package_payments, view_all_offline_seller_package_payments, view_all_payout_method_for_customer`
    - **Manual Payment Methods** · `manual_payment_methods.index`
    - **Offline Payment Orders** · `offline_payment_orders.index`
    - **Offline Wallet Recharge** · `offline_wallet_recharge_request.index`
    - **Offline Seller Package Payments** · `offline_seller_package_payment_request.index`
    - **Offline Payout Methods** · `payout_method_for_customer_index`
  - **Knet Payment Gateway** · `knet.configuration`
  - **Uddoktapay** · `uddoktapay.configuration`
- **OTP System** · `—` · can: `otp_configurations, sms_templates, sms_providers_configurations, send_bulk_sms`
  - **OTP System Settings** · `otp.login_configuration`
  - **OTP Configurations** · `otp.configconfiguration`
  - **SMS Templates** · `sms-templates.index`
- **GST System** · `—`
  - **Unverified Sellers** · `gst.unverified.sellers`
  - **HSN Assign** · `products.hsn-gst.assigns`
  - **Wholesale Products** · `products.wholesale-hsn-gst.assigns`
  - **Preorder Products** · `products.preorder-hsn-gst.assigns`
  - **Auction Products** · `products.auction-hsn-gst.assigns`
- **Shipping System** · `—` · can: `manage_shipping_system`
  - **Shiprocket** · `shiprocket_configuration`
  - **Steadfast** · `steadfast_configuration`
  - **Pathao** · `pathao_configuration`
  - **Redx** · `—`
    - **Redx Configuration** · `redx_configuration`
    - **Redx Pickup Store** · `redx_pickup.index`

### Settings
- **Setup & Configurations** · `—` · can: `general_settings, features_activation, language_setup, currency_setup, vat_&_tax_setup, pickup_point_setup, smtp_settings, payment_methods_configurations, order_configuration, file_system_&_cache_configuration, social_media_logins, facebook_chat, facebook_comment, analytics_tools_configuration, google_recaptcha_configuration, google_map_setting, google_firebase_setting, shipping_configuration, shipping_country_setting, manage_shipping_states, manage_shipping_cities, manage_zones, manage_carriers, select_shipping_methods`
  - **Business Settings** · `business_settings.index`
  - **Features activation** · `activation.index`
  - **Languages** · `languages.index`
  - **Currency** · `currency.index`
  - **SMTP Settings** · `smtp_settings.index`
  - **File System & Cache Configuration** · `file_system.index`
  - **Social media Logins** · `social_login.index`
  - **Facebook** · `—`
    - **WhatsApp Chat** · `whatsapp_chat.index` · can: `facebook_chat, facebook_comment`
    - **Facebook Comment** · `facebook-comment`
  - **Google** · `—`
    - **Google reCAPTCHA** · `google_recaptcha.index` · can: `analytics_tools_configuration, google_recaptcha_configuration, google_map_setting, google_firebase_setting`
    - **Google Map** · `google-map.index`
    - **Google Firebase** · `google-firebase.index`
  - **Shipping** · `—`
    - **Select Shipping Method** · `shipping_configuration.shipping_method` · can: `shipping_configuration, select_shipping_methods, shipping_country_setting, manage_shipping_states, manage_shipping_cities, manage_zones, manage_carriers, shipping_box_size_index, pickup_address_index`
    - **Shipping Configuration** · `shipping_configuration.index`
    - **Shipping Countries** · `countries.index`
    - **Shipping States** · `states.index`
    - **Shipping Cities** · `cities.index`
    - **Shipping Areas** · `areas.index`
    - **Shipping Zones** · `zones.index`
    - **Shipping Carrier** · `carriers.index`
    - **Pickup Addresses** · `pickup_address.index`
    - **Shipping Box Size Configuration** · `shipping_box_size.index`
- **Staffs** · `—` · can: `view_all_staffs, view_staff_roles`
  - **All staffs** · `staffs.index`
  - **Staff permissions** · `roles.index`
- **System** · `—` · can: `system_update, server_status`
  - **Update** · `system_update`
  - **Server status** · `system_server`
- **Addon Manager** · `addons.index`
- **Landing Page Setup** · `—`
  - **Header Nav** · `website.portfolioheader`
  - **Landing Page** · `custom-pages.edit`
  - **Footer Settings** · `website.footer`

---

## 2. Satıcı (Seller) Paneli

### Dashboard
- **Dashboard** · `seller.dashboard`

### Products
- **Product Management** · `—`
  - **Products** · `—`
    - **All Products** · `seller.products`
    - **Add New Product** · `seller.products.create`
    - **Add New Digital Product** · `seller.digitalproducts.create`
  - **Product Setup** · `—`
    - **Notes** · `—`
      - **Add New Note** · `seller.note.create`
      - **Note List** · `seller.note.index`
    - **Size Chart** · `seller.size-charts.index`
  - **Product Operation** · `—`
    - **Product Bulk Upload** · `seller.product_bulk_upload.index`
    - **Product Reviews** · `seller.product-reviews`
    - **Custom Label** · `seller.custom_label.index`
- **Auction Products** · `—`
  - **Add New Auction Product** · `auction_product_create.seller`
  - **All Auction Products** · `auction_products.seller.index`
  - **Auction Product Orders** · `auction_products_orders.seller`
- **Wholesale Products** · `—`
  - **Add New Wholesale Product** · `wholesale_product_create.seller`
  - **All Wholesale Products** · `seller.wholesale_products_list`

### Orders & Sales
- **Sales** · `—`
  - **Orders** · `seller.orders.index`
- **POS System** · `—`
  - **POS Manager** · `poin-of-sales.seller_index`
  - **POS Configuration** · `pos.configuration`
  - **POS Orders** · `seller.pos.orders`
  - **POS Products** · `seller.pos.products`
- **Refunds** · `—`
  - **Received Refund Request** · `seller.vendor_refund_request`
  - **Refund Configuration** · `seller.refund_configuration`
- **Preorder** · `—`
  - **Preorder Home** · `seller.preorder.dashboard`
  - **Add New Preorder Product** · `seller.preorder-product.create`
  - **Preorder Products** · `seller.preorder-product.index`
  - **Orders (Preorder)** · `—`
    - **All Orders** · `seller.all_preorder.list`
    - **Delayed Prepayment Orders** · `seller.delayed_prepayment_preorders.list`
    - **Delayed Final Orders** · `seller.delayed_final_orders.list`
  - **Product Conversations** · `seller.preorder-conversations.index`
  - **Product Queries** · `seller.preorder_product_query.index`
  - **Product Reviews** · `seller.preorder_product_reviews`

### Finance
- **Money Withdraw** · `seller.money_withdraw_requests.index`
- **Payment History** · `seller.payments.index`
- **Commission** · `seller.commission-history.index`

### Communication
- **Support & Communication** · `—`
  - **Conversations** · `seller.conversations.index`
  - **Product Queries** · `seller.product_query.index`
  - **Support Ticket** · `seller.support_ticket.index`

### Marketing & Promotions
- **Promotion & Offers** · `—`
  - **Promotional Product** · `seller.promotional_products.index`
  - **Category Wise Discount** · `seller.categories_wise_product_discount`
  - **Coupon** · `seller.coupon.index`

### Content & Design
- **Shop Design** · `seller.shop.design`
- **Uploaded Files** · `seller.uploaded-files.index`

### Settings
- **Shop Settings** · `seller.shop.index`
- **Package** · `—`
  - **Packages** · `seller.seller_packages_list`
  - **Purchase Packages** · `seller.packages_payment_list`
- **GST System** · `—`
  - **HSN Assign** · `seller.products.hsn-gst.assigns`
  - **Wholesale Products** · `seller.products.wholesale-hsn-gst.assigns`
  - **Preorder Products** · `seller.products.preorder-hsn-gst.assigns`
  - **Auction Products** · `seller.products.auction-hsn-gst.assigns`

---

## 3. Kuryer (Delivery Boy) Paneli

- **Dashboard** · `dashboard`
- **Assigned Delivery** · `assigned-deliveries`
- **Picked Up Delivery** · `pickup-deliveries`
- **On The Way Delivery** · `on-the-way-deliveries`
- **Pending Delivery** · `pending-deliveries`
- **Completed Delivery** · `completed-deliveries`
- **Cancelled Delivery** · `cancelled-deliveries`
- **Request to Cancel** · `cancel-request-list`
- **Total Collection** · `total-collection`
- **Earnings** · `total-earnings`
- **Manage Profile** · `profile`

---

## 4. Müştəri Hesabı (Frontend User Nav)

- **Dashboard** · `dashboard`
- **Purchase History** · `purchase_history.index`
- **Preorder** · `—`
  - **Preorder List** · `preorder.order_list`
  - **Preorder Conversations** · `preorder-conversations.customer-index`
- **Downloads** · `digital_purchase_history.index`
- **Refund Requests** · `customer_refund_request`
- **Wishlist** · `wishlists.index`
- **Compare** · `compare`
- **Followed Sellers** · `followed_seller`
- **Classified Products** · `customer_products.index`
- **Auction** · `—`
  - **Bidded Products** · `auction_product_bids.index`
  - **Purchase History** · `auction_product.purchase_history`
- **Conversations** · `conversations.index`
- **My Wallet** · `wallet.index`
- **Earning Points** · `earnng_point_for_user`
- **Affiliate** · `—`
  - **Affiliate System** · `affiliate.user.index`
  - **Payment History** · `affiliate.user.payment_history`
  - **Withdraw request history** · `affiliate.user.withdraw_request_history`
- **Support Ticket** · `support_ticket.index`
- **Manage Profile** · `profile`

---

## 5. Addon Menyuları (`D:\www\aec\addons` İxtisaslaşmış Xəritə)

`D:\www\aec\addons` qovluğunda olan 17 addon-un menyu statusu 3 qrupa bölünür:

### 5.1 Əsas Admin & Satıcı Sidenav-ına Ön-İnteqrasiya Olunmuş Addon-lar
Bu addon-ların menyu bəndləri artıq `admin_sidenav.blade.php` və `seller_sidenav.blade.php` fayllarında yer alır (yalnız `addon_is_activated(...)` yoxlanışı ilə açılır):
- **`affiliate_system`** (Affiliate):
  - Admin: `Marketing & Promotions → Affiliate System` (6 ekran: `affiliate.configs`, `affiliate.index`, `affiliate.users`, `refferals.users`, `affiliate.withdraw_requests`, `affiliate.logs.admin`)
  - Müştəri: `Affiliate` (3 ekran: `affiliate.user.index`, `affiliate.user.payment_history`, `affiliate.user.withdraw_request_history`)
- **`club_point`** (Club Point):
  - Admin: `Marketing & Promotions → Club Point System` (3 ekran: `club_points.configs`, `set_product_points`, `club_points.index`)
  - Müştəri: `Earning Points` (`earnng_point_for_user`)
- **`delivery_boy`** (Kuryer):
  - Admin: `Users → Delivery Boy` (6 ekran: `delivery-boys.index`, `delivery-boys.create`, `delivery-boys-payment-histories`, `delivery-boys-collection-histories`, `delivery-boy.cancel-request`, `delivery-boy-configuration`)
  - Kuryer xüsusi paneli: `delivery_boy_sidenav.blade.php` (11 ekran — bax: Bölmə 3)
- **`offline_payment`** (Manual / Offline Ödəniş):
  - Admin: `Integrations → Payment Gateways → Offline Payment System` (5 ekran: `manual_payment_methods.index`, `offline_payment_orders.index`, `offline_wallet_recharge_request.index`, `offline_seller_package_payment_request.index`, `payout_method_for_customer_index`)
- **`otp_system`** (OTP / SMS):
  - Admin: `Integrations → OTP System` (3 ekran: `otp.login_configuration`, `otp.configconfiguration`, `sms-templates.index`)
- **`pos_system`** (Kassa / POS):
  - Admin: `Orders & Sales → POS System` (4 ekran: `poin-of-sales.index`, `poin-of-sales.activation`, `pos.orders`, `admin.pos.products`)
  - Satıcı: `Orders & Sales → POS System` (4 ekran: `poin-of-sales.seller_index`, `pos.configuration`, `seller.pos.orders`, `seller.pos.products`)
- **`preorder`** (Öncədən sifariş):
  - Admin: `Orders & Sales → Preorder` (11 ekran: `preorder.dashboard`, `preorder-product.create`, `preorder-product.index`, `all_preorder.list`, `inhouse_preorder.list`, `seller_preorder.list`, `delayed_prepayment_preorders.list`, `delayed_final_orders.list`, `preorder-conversations.admin_index`, `preorder.product_query.index`, `preorder.product_reviews.index`, `preorder-notification-types.index`)
  - Satıcı: `Orders & Sales → Preorder` (9 ekran: `seller.preorder.dashboard`, `seller.preorder-product.create`, `seller.preorder-product.index`, `seller.all_preorder.list`, `seller.delayed_prepayment_preorders.list`, `seller.delayed_final_orders.list`, `seller.preorder-conversations.index`, `seller.preorder_product_query.index`, `seller.preorder_product_reviews`)
  - Müştəri: `Preorder` (2 ekran: `preorder.order_list`, `preorder-conversations.customer-index`)
- **`refund_system`** (Geri qaytarma):
  - Admin: `Orders & Sales → Refunds` (5 ekran: `refund_requests_all`, `dispute_refund_requests_all`, `refund_time_config`, `refund_reason_index`, `categories_wise_product_refund`)
  - Satıcı: `Orders & Sales → Refunds` (2 ekran: `seller.vendor_refund_request`, `seller.refund_configuration`)
  - Müştəri: `Refund Requests` (`customer_refund_request`)
- **`seller-subscription-addon`** (Satıcı paketləri / abunəlik):
  - Admin: `Users → Sellers → Seller Packages` (`seller_packages.index`)
  - Satıcı: `Settings → Package` (2 ekran: `seller.seller_packages_list`, `seller.packages_payment_list`)

---

### 5.2 Xüsusi / Dinamik İnjekt Edilən Addon Menyuları
Bu addon-lar əsas blade faylına `apply.php` vasitəsilə patch edilir və ya `addons/<addon>/views/` daxilində ayrıca sidenav blokuna malikdir:

#### 1. `ai_translate` (AI Translation Addon)
- **Mənbə:** `addons/ai_translate/views/admin_sidenav.blade.php`
- **Görünüş yeri:** `Settings` / `Languages` və ya `AI Studio` bloku
- **İcazə:** `can: language_setup`
- **Menyu:**
  - **AI Translation** · `—` · can: `language_setup`
    - **Configuration** · `ai-translate.config`
    - **Token Usage** · `ai-translate.token-usage`

#### 2. `qrcode_event` (QR Uduş Sistemi Addon)
- **Mənbə:** `addons/qrcode_event/scripts/apply.php`
- **Görünüş yeri:** `Marketing & Promotions` bölməsi
- **İcazə:** `canany: qrcode_event_configuration, qrcode_event_codes, qrcode_event_reports`
- **Menyu:**
  - **Uduş Sistemi** · `—`
    - **Statistika** · `qrcode_event.index` · can: `qrcode_event_configuration`
    - **Kampaniyalar** · `qrcode_event.campaigns` · can: `qrcode_event_configuration`
    - **Kod partiyaları** · `qrcode_event.batches` · can: `qrcode_event_codes`
    - **Kodlar** · `qrcode_event.codes` · can: `qrcode_event_codes`
    - **Yoxlama jurnalı** · `qrcode_event.logs` · can: `qrcode_event_reports`

#### 3. `payriff` (Payriff Ödəniş Gateway Addon)
- **Mənbə:** `addons/payriff/scripts/apply.php`
- **Görünüş yeri:** `Integrations → Payment Gateways` bölməsi
- **Menyu:**
  - **Payriff Payment Gateway** · `payriff.index` · can: `payriff_payment_gateway_configuration`

#### 4. `map_provider` (Xəritə / OpenStreetMap Addon)
- **Mənbə:** `addons/map_provider/scripts/apply.php`
- **Görünüş yeri:** `Settings → Setup & Configurations` bölməsi
- **Menyu:** Mövcud `Google Map` menyusunu əvəz edir və ya ayrıca element kimi çıxarır:
  - **Map (OpenStreetMap / Provider)** · `google-map.index` · can: `google_map_setting`

---

### 5.3 Menyu Bəndi Olmayan (CLI, Fix və ya Sənəd) Addon-lar
- **`az_slug`**: Azərbaycan şriftləri üçün slug avtomatlaşdırması (CLI əmri: `php artisan az_slug:apply`), UI menyusu yoxdur.
- **`license_cleaner`**: Lisans və backdoor təmizləmə skriptləri, UI menyusu yoxdur.
- **`wholesale_unit_fix`**: Topdan satış vahidləri üçün korreksiya skripti (`apply.php`), menyu bəndi yoxdur (ekranlar əsas `Wholesale Products`-dadır).
- **`Google One-Tap Login Add-on...`**: Yalnız sənədləşmə qovluğudur (`.docx`), kod/menyu bəndi yoxdur.

