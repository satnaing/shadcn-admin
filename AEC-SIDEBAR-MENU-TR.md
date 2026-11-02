# AEC Kenar Çubuğu (Sidebar) Menü Haritası

> **Kaynaklar:**
> - Yönetici (Admin): `resources/views/backend/inc/admin_sidenav.blade.php` (212 yaprak ekran)
> - Satıcı (Seller): `resources/views/seller/inc/seller_sidenav.blade.php` (49 yaprak ekran)
> - Kurye (Delivery Boy): `addons/delivery_boy/views/delivery_boys/frontend/inc/delivery_boy_sidenav.blade.php` (11 ekran)
> - Müşteri (Customer): `resources/views/frontend/inc/user_side_nav.blade.php` (18 ekran)

---

## 0. Takip (bu dosya hem harita hem de ilerleme takipçisidir)

Her ekranın karşısına durum işareti konulur. Bölüm tamamlandığında o bölümün tüm satırları işaretlenir.

| İşaret | Anlamı |
|---|---|
| (boş) | başlanmadı |
| 🔄 | yazılıyor (mevcut bölüm) |
| ✅ | tamamlandı — `build` + `lint` yeşil, fixture ile gezilebiliyor |
| ⏭ | Faz D'ye ertelendi (eklenti ekranları) |
| ⊘ | taşınmıyor (karar: `task/admin/README.md` §1 sonu) |

**Grup → bölüm dosyası** (`D:\www\xshop\task\admin\`):

| Kenar Çubuğu Grubu | Bölüm Dosyası | Panel |
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
| Content & Design → görünüm / CMS | `11-appearance.md` | A |
| Content & Design → AI Studio | `12-ai-studio.md` | A |
| Content & Design → Uploaded Files | `13-media.md` | A |
| Communication | `14-communication.md` | A |
| Integrations → Payment Gateways | `15-payments.md` | A |
| Integrations → OTP System | `16-otp.md` | A |
| Integrations → Shipping System | `17-courier.md` | A |
| Settings → Setup & Configurations | `18-settings.md` | A |
| Settings → Shipping | `19-shipping.md` | A |
| Settings → Staffs | `20-staff.md` — ana bölüm pilotla **hazırdır** (`features/users`, `role`, `permission`) | A |
| Settings → System + Addon Manager | `21-system.md` | A |
| **Satıcı paneli** (49 ekran) | `30-vendor-foundation.md` … `36-vendor-shop.md` — 15 ekran yönetici ekranının `scope='seller'` varyantıdır (E13) | S |
| **Kurye paneli** (11 ekran) | `37-courier.md` — 12 AEC ekranı → **6 gerçek ekran** (6 durum filtresi tek bir listedir) | K |
| **Müşteri paneli** (18 ekran) | ⊘ bu projede yok — storefront Next.js tarafındadır (`front/`) | — |
| **Wholesale Products** | ⊘ ayrı bölüm değil → `03-products.md` içinde toptan fiyat kademesi (E26) | A+S |
| **GST System** | ⊘ taşınmıyor — Hindistan vergi sistemi (HSN/CGST/SGST); AZ·RU·TR·GE için standart KDV `18-settings` içerisindedir (E27) | — |
| **Dropshipping** (AEC'de yok) | `22-dropshipping.md` — tedarikçi, feed içe aktarma, marj kuralı, tedarikçi siparişleri (api D20) | A |
| Auction · POS · Refund · Preorder · Delivery Boy (admin) · Affiliate · Club Point | ⏭ Faz D (`40`–`47`) | A+S |

**Panel ve rol katmanı** (üç gezinme ağacı `/admin` · `/seller` · `/courier`, beş rol): `00b-panels-and-roles.md`.

**Not:** Bu dosyadaki `can:` adları AEC'ye aittir — **kodlanırken doğrudan kopyalanmaz**. xshop formatı `<modül>.<işlem>` şeklindedir (`task/admin/README.md` E3).

---

## 1. Yönetici (Admin) Paneli

### Dashboard (Kontrol Paneli)
- **Dashboard (Kontrol Paneli)** · `admin.dashboard` · can: `admin_dashboard`

### Products (Ürünler)
- **Product Management (Ürün Yönetimi)** · `—` · can: `view_product_management_dashboard, add_new_product, show_all_products, show_in_house_products, show_seller_products, add_digital_product, edit_digital_product, product_bulk_import, product_bulk_export, view_product_categories, view_all_brands, brand_bulk_upload, view_product_attributes, view_colors, view_product_warranties, smart-bar, view_custom_label, view_product_reviews, view_notes, add_note`
  - **Product Home (Ürün Ana Sayfası)** · `products.dashboard`
  - **Products (Ürünler)** · `—`
    - **All Products (Tüm Ürünler)** · `products.all` · can: `show_all_products, show_in_house_products, show_seller_products, add_new_product, add_digital_product`
    - **In House Products (Şirket İçi Ürünler)** · `products.admin`
    - **Seller Product (Satıcı Ürünleri)** · `products.seller`
    - **Add New product (Yeni Ürün Ekle)** · `products.create`
    - **Add New Digital Product (Yeni Dijital Ürün Ekle)** · `digitalproducts.create`
  - **Product Setup (Ürün Yapılandırması)** · `—`
    - **Category (Kategori)** · `—`
      - **Category (Kategoriler)** · `categories.index` · can: `view_product_categories, category_bulk_upload`
      - **Bulk Import/Export (Toplu İçe/Dışa Aktar)** · `category_bulk_upload.index`
    - **Brand (Marka)** · `—`
      - **All Brands (Tüm Markalar)** · `brands.index` · can: `view_all_brands, brand_bulk_upload`
      - **Bulk Import/Export (Toplu İçe/Dışa Aktar)** · `brand_bulk_upload.index`
    - **Colors (Renkler)** · `colors`
    - **Attribute (Özellikler / Nitelikler)** · `attributes.index`
    - **Unit (Birimler)** · `unit.index`
    - **Size Guide (Beden Rehberi)** · `—`
      - **Size Chart (Beden Tablosu)** · `size-charts.index` · can: `view_size_charts, view_measurement_points`
      - **Measurement Points (Ölçüm Noktaları)** · `measurement-points.index`
    - **Warranty (Garanti)** · `warranties.index`
    - **Notes (Notlar)** · `—`
      - **Note List (Not Listesi)** · `note.index` · can: `view_notes, add_note`
  - **Product Operation (Ürün İşlemleri)** · `—`
    - **Product Reviews (Ürün Yorum ve Değerlendirmeleri)** · `reviews.index` · can: `view_product_reviews, smart-bar, view_custom_label, product_bulk_export, product_bulk_import`
    - **Smart Bar (Akıllı Çubuk)** · `smart.bar`
    - **Custom Label (Özel Etiket)** · `custom_label.index`
    - **Bulk Import (Toplu İçe Aktar)** · `product_bulk_upload.index`
    - **Bulk Export (Toplu Dışa Aktar)** · `product_bulk_export.index`
- **Auction Products (Açık Artırma Ürünleri)** · `—` · can: `add_auction_product, view_all_auction_products, view_inhouse_auction_products, view_seller_auction_products, view_auction_product_orders`
  - **Add New auction product (Yeni Açık Artırma Ürünü Ekle)** · `auction_product_create.admin`
  - **All Auction Products (Tüm Açık Artırma Ürünleri)** · `auction.all_products`
  - **Inhouse Auction Products (Şirket İçi Açık Artırma Ürünleri)** · `auction.inhouse_products`
  - **Seller Auction Products (Satıcı Açık Artırma Ürünleri)** · `auction.seller_products`
  - **Auction Products Orders (Açık Artırma Siparişleri)** · `auction_products_orders`
- **Wholesale Products (Toptan Satış Ürünleri)** · `—` · can: `add_wholesale_product, view_all_wholesale_products, view_inhouse_wholesale_products, view_sellers_wholesale_products`
  - **Add New Wholesale Product (Yeni Toptan Ürün Ekle)** · `wholesale_product_create.admin`
  - **All Wholesale Products (Tüm Toptan Ürünler)** · `wholesale_products.all`
  - **In House Wholesale Products (Şirket İçi Toptan Ürünler)** · `wholesale_products.in_house`
  - **Seller Wholesale Products (Satıcı Toptan Ürünleri)** · `wholesale_products.seller`

### Orders & Sales (Siparişler ve Satışlar)
- **Sales (Satışlar)** · `—` · can: `view_all_orders, view_inhouse_orders, view_seller_orders, view_pickup_point_orders`
  - **All Orders (Tüm Siparişler)** · `all_orders.index`
  - **Inhouse orders (Şirket İçi Siparişler)** · `inhouse_orders.index`
  - **Seller Orders (Satıcı Siparişleri)** · `seller_orders.index`
  - **Pick-up Point Orders (Teslim Noktası Siparişleri)** · `pick_up_point.index`
  - **Unpaid Orders (Ödenmemiş Siparişler)** · `unpaid_orders.index`
- **POS System (POS / Kasa Sistemi)** · `—`
  - **POS Manager (POS Yöneticisi)** · `poin-of-sales.index`
  - **POS Configuration (POS Yapılandırması)** · `poin-of-sales.activation`
  - **POS Orders (POS Siparişleri)** · `pos.orders`
  - **POS Products (POS Ürünleri)** · `admin.pos.products`
- **Refunds (İadeler)** · `—` · can: `view_refund_requests, view_approved_refund_requests, view_rejected_refund_requests, refund_request_configuration, set_category_wise_refund`
  - **Refund Requests (İade Talepleri)** · `refund_requests_all`
  - **Dispute Refund Requests (İhtilaflı İade Talepleri)** · `dispute_refund_requests_all`
  - **Refund Configuration (İade Yapılandırması)** · `refund_time_config`
  - **Refund Reasons (İade Nedenleri)** · `refund_reason_index`
  - **Category Based Refund (Kategori Bazlı İade)** · `categories_wise_product_refund`
- **Preorder (Ön Sipariş)** · `—` · can: `preorder_dashboard, add_preorder_product, view_all_preorder_products, view_all_preorders, view_all_inhouse_preorders, view_all_seller_preorders, view_all_delayed_prepayment_preorders, view_all_final_preorders, view_preorder_seller_commission_history, preorder_settings, view_all_preorder_product_conversations, view_all_preorder_product_queries, view_all_preorder_product_reviews, view_all_faqs, view_all_preorder_notification_types`
  - **Preorder Home (Ön Sipariş Ana Sayfası)** · `preorder.dashboard`
  - **Add New Preorder products (Yeni Ön Sipariş Ürünü Ekle)** · `preorder-product.create`
  - **Preorder Products (Ön Sipariş Ürünleri)** · `preorder-product.index`
  - **Orders (Preorder) (Ön Siparişler)** · `—`
    - **All Orders (Tüm Siparişler)** · `all_preorder.list` · can: `view_all_preorders, view_all_inhouse_preorders, view_all_seller_preorders, view_all_delayed_prepayment_preorders, view_all_final_preorders`
    - **Inhouse Orders (Şirket İçi Siparişler)** · `inhouse_preorder.list`
    - **Seller Orders (Satıcı Siparişleri)** · `seller_preorder.list`
    - **Delayed Prepayment (Gecikmiş Ön Ödemeler)** · `delayed_prepayment_preorders.list`
    - **Delayed Final Orders (Gecikmiş Nihai Siparişler)** · `delayed_final_orders.list`
  - **Preorder Product Conversation (Ön Sipariş Ürün Mesajlaşmaları)** · `preorder-conversations.admin_index`
  - **Preorder Product Queries (Ön Sipariş Ürün Soruları)** · `preorder.product_query.index`
  - **Preorder Product Reviews (Ön Sipariş Ürün Yorumları)** · `preorder.product_reviews.index`
  - **Preorder Notification Types (Ön Sipariş Bildirim Türleri)** · `preorder-notification-types.index`

### Users (Kullanıcılar)
- **Customers (Müşteriler)** · `—` · can: `view_all_customers, view_classified_products, view_classified_packages`
  - **Customer list (Müşteri Listesi)** · `customers.index`
  - **Unverified Customers (Doğrulanmamış Müşteriler)** · `customers.unverified.index`
  - **Classified Products (Müşteri İlan Ürünleri)** · `classified_products`
  - **Classified Packages (İlan Paketleri)** · `customer_packages.index`
- **Sellers (Satıcılar)** · `—` · can: `view_all_seller, seller_payment_history, view_seller_payout_requests, seller_commission_configuration, view_all_seller_packages, seller_verification_form_configuration, set_category_wise_commission, set_seller_based_commission`
  - **All Seller (Tüm Satıcılar)** · `sellers.index`
  - **Applied Seller (Başvuran Satıcılar)** · `sellers.registration_pending`
  - **Seller Rating & Followers (Satıcı Puanı ve Takipçileri)** · `sellers.rating_followers`
  - **Payouts (Ödemeler)** · `sellers.payment_histories`
  - **Payout Requests (Ödeme Talepleri)** · `withdraw_requests_all`
  - **Seller Commission (Satıcı Komisyonu)** · `business_settings.vendor_commission`
  - **Seller Based Commission (Satıcı Bazlı Komisyon)** · `seller_based_commission`
  - **Category Based Commission (Kategori Bazlı Komisyon)** · `categories_wise_commission`
  - **Seller Packages (Satıcı Paketleri)** · `seller_packages.index`
  - **Seller Verification Form (Satıcı Doğrulama Formu)** · `seller_verification_form.index`
- **Delivery Boy (Kurye / Dağıtım Elemanı)** · `—` · can: `view_all_delivery_boy, add_delivery_boy, delivery_boy_payment_history, collected_histories_from_delivery_boy, order_cancle_request_by_delivery_boy, delivery_boy_configuration`
  - **All Delivery Boy (Tüm Kuryeler)** · `delivery-boys.index`
  - **Add Delivery Boy (Kurye Ekle)** · `delivery-boys.create`
  - **Payment Histories (Ödeme Geçmişi)** · `delivery-boys-payment-histories`
  - **Collected Histories (Tahsilat Geçmişi)** · `delivery-boys-collection-histories`
  - **Cancel Request (İptal Talepleri)** · `delivery-boy.cancel-request`
  - **Configuration (Yapılandırma)** · `delivery-boy-configuration`

### Marketing & Promotions (Pazarlama ve Promosyonlar)
- **Promotion & Offers (Promosyonlar ve Teklifler)** · `—` · can: `view_promotion_and_offers_dashboard, view_all_flash_deals, todays_deal_products.index, view_all_coupons, set_category_wise_discount, view_promotional_product`
  - **Promotion & Offers Home (Promosyonlar Ana Sayfası)** · `promotion_and_offers_dashboard`
  - **Promotional Product (Promosyonel Ürünler)** · `promotional_products.index`
  - **Seller Promotional Product (Satıcı Promosyonel Ürünleri)** · `seller_promotional_products.index`
  - **Flash Sales (Flaş İndirimler)** · `flash_deals.index`
  - **Category Based Discount (Kategori Bazlı İndirim)** · `categories_wise_product_discount`
  - **Coupon (Kuponlar)** · `coupon.index`
- **Marketing (Pazarlama)** · `—` · can: `view_all_dynamic_popups, view_all_custom_alerts, manage_email_templates, send_newsletter, notification_settings, view_all_notification_types, send_custom_notification, view_custom_notification_history, send_bulk_sms, view_all_subscribers, view_blogs, view_blog_categories`
  - **Marketing Home (Pazarlama Ana Sayfası)** · `marketing_dashboard`
  - **Dynamic Pop-up (Dinamik Açılır Pencereler)** · `dynamic-popups.index`
  - **Custom Alert (Özel Uyarılar)** · `custom-alerts.index`
  - **Custom Sell Alert (Özel Satış Uyarıları)** · `custom-sale-alerts.index`
  - **Email Templates (E-posta Şablonları)** · `all_email_templates.index`
  - **Blog System (Blog Sistemi)** · `—`
    - **All Blog Posts (Tüm Blog Yazıları)** · `blog.index` · can: `view_blogs, view_blog_categories`
    - **Categories (Kategoriler)** · `blog-category.index`
  - **Newsletters (E-Bültenler)** · `newsletters.index`
  - **Notification (Bildirimler)** · `—`
    - **Notification Types (Bildirim Türleri)** · `notification-type.index` · can: `notification_settings, view_all_notification_types, send_custom_notification, view_custom_notification_history`
    - **Custom Notification (Özel Bildirim Gönder)** · `custom_notification`
    - **Custom Notification History (Özel Bildirim Geçmişi)** · `custom_notification.history`
    - **Settings (Ayarlar)** · `notification.settings`
  - **Bulk SMS (Toplu SMS)** · `sms.index`
  - **Subscribers (Bülten Aboneleri)** · `subscribers.index`
  - **Custom Visitors (Özel Ziyaretçiler)** · `custom_product_visitors`
- **Marketing Analytics (Pazarlama Analitiği)** · `—` · can: `manage_google_analytics, manage_pixel_analytics, manage_sitemap_generator, manage_custom_script`
  - **Marketing Analytics Home (Pazarlama Analitiği Ana Sayfası)** · `marketing_analytics_dashboard`
  - **Google Analytics (GA4)** · `google-analytics-config`
  - **Google Analytics Reports (Google Analytics Raporları)** · `google-analytics-test.result`
  - **Google TAG Manager** · `google-tag-manager-config`
  - **Meta Pixel** · `pixel_analytics.index`
  - **Meta Conversion API** · `pixel_conversation_api.index`
  - **Google Marchant Center** · `—`
    - **Configuration (Yapılandırma)** · `google_merchant_center.configuration` · can: `delete_gmc_product, edit_gmc_product, add_gmc_product`
    - **Generate Feed (Feed Oluştur)** · `google_merchant_center.feed`
  - **Facebook Catalogue (Facebook Kataloğu)** · `—`
    - **Configuration (Yapılandırma)** · `facebook_catalogue.configuration` · can: `delete_gmc_product, edit_gmc_product, add_gmc_product`
    - **Generate Feed (Feed Oluştur)** · `facebook_catalogue.feed`
  - **Custom Script (Özel Kod / Script)** · `custom_script`
  - **Sitemap Generator (Site Haritası Oluşturucu)** · `sitemap_generator`
  - **Global SEO** · `global_seo`
- **Affiliate System (Satış Ortaklığı / Affiliate)** · `—` · can: `affiliate_registration_form_config, affiliate_configurations, view_affiliate_users, view_all_referral_users, view_affiliate_withdraw_requests, view_affiliate_logs`
  - **Affiliate Registration Form (Kayıt Formu Yapılandırması)** · `affiliate.configs`
  - **Affiliate Configurations (Ortaklık Yapılandırması)** · `affiliate.index`
  - **Affiliate Users (Ortaklık Kullanıcıları)** · `affiliate.users`
  - **Referral Users (Referanslı Kullanıcılar)** · `refferals.users`
  - **Affiliate Withdraw Requests (Para Çekme Talepleri)** · `affiliate.withdraw_requests`
  - **Affiliate Logs (İşlem Günlükleri)** · `affiliate.logs.admin`
- **Club Point System (Kulüp Puanı Sistemi)** · `—` · can: `club_point_configurations, set_club_points, view_users_club_points`
  - **Club Point Configurations (Puan Yapılandırması)** · `club_points.configs`
  - **Set Product Point (Ürün Puanı Belirle)** · `set_product_points`
  - **User Points (Kullanıcı Puanları)** · `club_points.index`

### Report (Raporlar)
- **Report Center (Rapor Merkezi)** · `—` · can: `earning_report, in_house_product_sale_report, seller_products_sale_report, products_stock_report, product_wishlist_report, user_search_report, commission_history_report, wallet_transaction_report`
  - **Earning Report (Kazanç Raporu)** · `earning_payout_report.index`
  - **In House Product Sale (Şirket İçi Ürün Satış Raporu)** · `in_house_sale_report.index`
  - **Seller Products Sale (Satıcı Ürünleri Satış Raporu)** · `seller_sale_report.index`
  - **Products Stock (Ürün Stok Raporu)** · `stock_report.index`
  - **Products wishlist (İstek Listesi Raporu)** · `wish_report.index`
  - **User Searches (Kullanıcı Arama Raporu)** · `user_search_report.index`
  - **Commission History (Komisyon Geçmişi)** · `commission-log.index`
  - **Wallet Recharge History (Cüzdan Yükleme Geçmişi)** · `wallet-history.index`

### Content & Design (İçerik ve Tasarım)
- **Design Studio (Tasarım Stüdyosu)** · `—` · can: `view_website_dashboard, header_setup, footer_setup, view_all_website_pages, website_appearance, authentication_layout_settings, top_banner_setting, view_top_banner`
  - **Design Studio Home (Tasarım Stüdyosu Ana Sayfası)** · `website.dashboard`
  - **Select Homepage (Ana Sayfa Seçimi)** · `website.select-homepage`
  - **Homepage Settings (Ana Sayfa Ayarları)** · `custom-pages.edit`
  - **Font Family (Yazı Tipi / Font)** · `website.select-font-family`
  - **Authentication Layout & Settings (Kimlik Doğrulama Sayfa Düzeni)** · `website.authentication-layout-settings`
  - **Select Header (Üst Bilgi / Header Seçimi)** · `website.select-header`
  - **Header Settings (Header Ayarları)** · `website.header`
  - **Top Bar (Üst Çubuk / Bant)** · `—` · can: `view_top_banner, top_banner_setting`
    - **Top Bar List (Üst Çubuk Listesi)** · `top_banner.index`
    - **Top Bar Settings (Üst Çubuk Ayarları)** · `top_banner.setting`
  - **All Category Layout (Tüm Kategoriler Düzeni)** · `select_all_category_layout`
  - **Product Details (Ürün Detay Düzeni)** · `product_details_section`
  - **Select Footer (Alt Bilgi / Footer Seçimi)** · `website.select-footer`
  - **Footer Settings (Footer Ayarları)** · `website.footer`
  - **Pages (Özel Sayfalar / CMS)** · `website.pages`
  - **System Setup (Sistem Kurulumu)** · `website.system_setup`
  - **Appearance (Görünüm Ayarları)** · `website.appearance`
  - **Logo & Favicon** · `website.logo_and_favicon`
  - **Banners & Sliders (Afişler ve Kayan Görseller)** · `website.banners_and_sliders`
  - **Element (Öğeler)** · `—`
    - **All Elements (Tüm Öğeler)** · `elements.index`
- **AI Studio (Yapay Zeka Stüdyosu)** · `—` · can: `manage_ai_configuration`
  - **Add/Edit Product With AI (Yapay Zeka ile Ürün Ekle/Düzenle)** · `ai-add_edit_products`
  - **Prompt Templates (İstem / Prompt Şablonları)** · `ai-prompt-templates-config`
  - **Token Usage (Token Kullanımı)** · `ai-token-usege`
  - **AI Configuration (Yapay Zeka Yapılandırması)** · `ai-config`
- **Uploaded Files (Yüklenen Dosyalar / Medya Yöneticisi)** · `uploaded-files.index`

### Communication (İletişim)
- **Support & Communication (Destek ve İletişim)** · `—` · can: `view_all_support_tickets, view_all_product_conversations, view_all_product_queries`
  - **Ticket (Destek Talepleri)** · `support_ticket.admin_index`
  - **Product Conversations (Ürün Mesajlaşmaları)** · `conversations.admin_index`
  - **Product Queries (Ürün Soruları)** · `product_query.index`
  - **Seller Requests (Satıcı Talepleri)** · `seller_requests.index`
  - **Contacts (İletişim Formu Mesajları)** · `contacts`

### Integrations (Entegrasyonlar)
- **Payment Gateways (Ödeme Ağ Geçitleri / Yöntemleri)** · `—`
  - **Payment Methods (Ödeme Yöntemleri)** · `payment_method.index` · can: `payment_methods_configurations, african_pg_configuration, african_pg_credentials_configuration, view_all_manual_payment_methods, view_all_offline_payment_orders, view_all_offline_wallet_recharges, view_all_offline_customer_package_payments, view_all_offline_seller_package_payments, asian_payment_gateway_configuration`
  - **Cybersource Payment Gateway** · `cybersource_configuration`
  - **Asian Payment Gateway** · `paytm.index`
  - **African Payment Gateway** · `african_credentials.index` · can: `african_pg_configuration, african_pg_credentials_configuration`
  - **Offline Payment System (Çevrimdışı Ödeme Sistemi)** · `—` · can: `view_all_manual_payment_methods, view_all_offline_payment_orders, view_all_offline_wallet_recharges, view_all_offline_customer_package_payments, view_all_offline_seller_package_payments, view_all_payout_method_for_customer`
    - **Manual Payment Methods (Manuel Ödeme Yöntemleri)** · `manual_payment_methods.index`
    - **Offline Payment Orders (Çevrimdışı Ödeme Siparişleri)** · `offline_payment_orders.index`
    - **Offline Wallet Recharge (Çevrimdışı Cüzdan Yükleme)** · `offline_wallet_recharge_request.index`
    - **Offline Seller Package Payments (Çevrimdışı Satıcı Paketi Ödemeleri)** · `offline_seller_package_payment_request.index`
    - **Offline Payout Methods (Çevrimdışı Para Çekme Yöntemleri)** · `payout_method_for_customer_index`
  - **Knet Payment Gateway** · `knet.configuration`
  - **Uddoktapay** · `uddoktapay.configuration`
- **OTP System (OTP / SMS Doğrulama Sistemi)** · `—` · can: `otp_configurations, sms_templates, sms_providers_configurations, send_bulk_sms`
  - **OTP System Settings (OTP Sistemi Ayarları)** · `otp.login_configuration`
  - **OTP Configurations (OTP Yapılandırması)** · `otp.configconfiguration`
  - **SMS Templates (SMS Şablonları)** · `sms-templates.index`
- **GST System (GST Vergi Sistemi)** · `—`
  - **Unverified Sellers (Doğrulanmamış Satıcılar)** · `gst.unverified.sellers`
  - **HSN Assign (HSN Kodu Atama)** · `products.hsn-gst.assigns`
  - **Wholesale Products (Toptan Ürünler)** · `products.wholesale-hsn-gst.assigns`
  - **Preorder Products (Ön Sipariş Ürünleri)** · `products.preorder-hsn-gst.assigns`
  - **Auction Products (Açık Artırma Ürünleri)** · `products.auction-hsn-gst.assigns`
- **Shipping System (Kargo / Sevkiyat Sistemi)** · `—` · can: `manage_shipping_system`
  - **Shiprocket** · `shiprocket_configuration`
  - **Steadfast** · `steadfast_configuration`
  - **Pathao** · `pathao_configuration`
  - **Redx** · `—`
    - **Redx Configuration (Redx Yapılandırması)** · `redx_configuration`
    - **Redx Pickup Store (Redx Teslim Alma Noktası)** · `redx_pickup.index`

### Settings (Ayarlar)
- **Setup & Configurations (Kurulum ve Yapılandırmalar)** · `—` · can: `general_settings, features_activation, language_setup, currency_setup, vat_&_tax_setup, pickup_point_setup, smtp_settings, payment_methods_configurations, order_configuration, file_system_&_cache_configuration, social_media_logins, facebook_chat, facebook_comment, analytics_tools_configuration, google_recaptcha_configuration, google_map_setting, google_firebase_setting, shipping_configuration, shipping_country_setting, manage_shipping_states, manage_shipping_cities, manage_zones, manage_carriers, select_shipping_methods`
  - **Business Settings (İşletme Genel Ayarları)** · `business_settings.index`
  - **Features activation (Özellikleri Etkinleştirme)** · `activation.index`
  - **Languages (Diller)** · `languages.index`
  - **Currency (Para Birimleri)** · `currency.index`
  - **SMTP Settings (E-posta / SMTP Ayarları)** · `smtp_settings.index`
  - **File System & Cache Configuration (Dosya Sistemi ve Önbellek)** · `file_system.index`
  - **Social media Logins (Sosyal Medya Girişleri)** · `social_login.index`
  - **Facebook** · `—`
    - **WhatsApp Chat** · `whatsapp_chat.index` · can: `facebook_chat, facebook_comment`
    - **Facebook Comment (Facebook Yorumları)** · `facebook-comment`
  - **Google** · `—`
    - **Google reCAPTCHA** · `google_recaptcha.index` · can: `analytics_tools_configuration, google_recaptcha_configuration, google_map_setting, google_firebase_setting`
    - **Google Map (Google Haritalar)** · `google-map.index`
    - **Google Firebase** · `google-firebase.index`
  - **Shipping (Kargo ve Teslimat)** · `—`
    - **Select Shipping Method (Kargo Yöntemi Seçimi)** · `shipping_configuration.shipping_method` · can: `shipping_configuration, select_shipping_methods, shipping_country_setting, manage_shipping_states, manage_shipping_cities, manage_zones, manage_carriers, shipping_box_size_index, pickup_address_index`
    - **Shipping Configuration (Kargo Yapılandırması)** · `shipping_configuration.index`
    - **Shipping Countries (Ülkeler)** · `countries.index`
    - **Shipping States (Eyaletler / İller)** · `states.index`
    - **Shipping Cities (Şehirler / İlçeler)** · `cities.index`
    - **Shipping Areas (Bölgeler / Mahalleler)** · `areas.index`
    - **Shipping Zones (Kargo Bölgeleri)** · `zones.index`
    - **Shipping Carrier (Kargo Taşıyıcıları)** · `carriers.index`
    - **Pickup Addresses (Teslim Alma Adresleri)** · `pickup_address.index`
    - **Shipping Box Size Configuration (Koli Ebatları Yapılandırması)** · `shipping_box_size.index`
- **Staffs (Personel / Yetkililer)** · `—` · can: `view_all_staffs, view_staff_roles`
  - **All staffs (Tüm Personeller)** · `staffs.index`
  - **Staff permissions (Personel Yetkileri / Rolleri)** · `roles.index`
- **System (Sistem)** · `—` · can: `system_update, server_status`
  - **Update (Sistem Güncelleme)** · `system_update`
  - **Server status (Sunucu Durumu)** · `system_server`
- **Addon Manager (Eklenti Yöneticisi)** · `addons.index`
- **Landing Page Setup (Açılış Sayfası Kurulumu)** · `—`
  - **Header Nav (Üst Gezinme Çubuğu)** · `website.portfolioheader`
  - **Landing Page (Açılış Sayfası)** · `custom-pages.edit`
  - **Footer Settings (Alt Bilgi Ayarları)** · `website.footer`

---

## 2. Satıcı (Seller) Paneli

### Dashboard (Kontrol Paneli)
- **Dashboard (Satıcı Kontrol Paneli)** · `seller.dashboard`

### Products (Ürünler)
- **Product Management (Ürün Yönetimi)** · `—`
  - **Products (Ürünler)** · `—`
    - **All Products (Tüm Ürünler)** · `seller.products`
    - **Add New Product (Yeni Ürün Ekle)** · `seller.products.create`
    - **Add New Digital Product (Yeni Dijital Ürün Ekle)** · `seller.digitalproducts.create`
  - **Product Setup (Ürün Yapılandırması)** · `—`
    - **Notes (Notlar)** · `—`
      - **Add New Note (Yeni Not Ekle)** · `seller.note.create`
      - **Note List (Not Listesi)** · `seller.note.index`
    - **Size Chart (Beden Tablosu)** · `seller.size-charts.index`
  - **Product Operation (Ürün İşlemleri)** · `—`
    - **Product Bulk Upload (Toplu Ürün Yükleme)** · `seller.product_bulk_upload.index`
    - **Product Reviews (Ürün Yorum ve Değerlendirmeleri)** · `seller.product-reviews`
    - **Custom Label (Özel Etiket)** · `seller.custom_label.index`
- **Auction Products (Açık Artırma Ürünleri)** · `—`
  - **Add New Auction Product (Yeni Açık Artırma Ürünü Ekle)** · `auction_product_create.seller`
  - **All Auction Products (Tüm Açık Artırma Ürünleri)** · `auction_products.seller.index`
  - **Auction Product Orders (Açık Artırma Siparişleri)** · `auction_products_orders.seller`
- **Wholesale Products (Toptan Satış Ürünleri)** · `—`
  - **Add New Wholesale Product (Yeni Toptan Ürün Ekle)** · `wholesale_product_create.seller`
  - **All Wholesale Products (Tüm Toptan Ürünler)** · `seller.wholesale_products_list`

### Orders & Sales (Siparişler ve Satışlar)
- **Sales (Satışlar)** · `—`
  - **Orders (Siparişler)** · `seller.orders.index`
- **POS System (POS / Kasa Sistemi)** · `—`
  - **POS Manager (POS Yöneticisi)** · `poin-of-sales.seller_index`
  - **POS Configuration (POS Yapılandırması)** · `pos.configuration`
  - **POS Orders (POS Siparişleri)** · `seller.pos.orders`
  - **POS Products (POS Ürünleri)** · `seller.pos.products`
- **Refunds (İadeler)** · `—`
  - **Received Refund Request (Gelen İade Talepleri)** · `seller.vendor_refund_request`
  - **Refund Configuration (İade Yapılandırması)** · `seller.refund_configuration`
- **Preorder (Ön Sipariş)** · `—`
  - **Preorder Home (Ön Sipariş Ana Sayfası)** · `seller.preorder.dashboard`
  - **Add New Preorder Product (Yeni Ön Sipariş Ürünü Ekle)** · `seller.preorder-product.create`
  - **Preorder Products (Ön Sipariş Ürünleri)** · `seller.preorder-product.index`
  - **Orders (Preorder) (Ön Siparişler)** · `—`
    - **All Orders (Tüm Siparişler)** · `seller.all_preorder.list`
    - **Delayed Prepayment Orders (Gecikmiş Ön Ödemeli Siparişler)** · `seller.delayed_prepayment_preorders.list`
    - **Delayed Final Orders (Gecikmiş Nihai Siparişler)** · `seller.delayed_final_orders.list`
  - **Product Conversations (Ürün Mesajlaşmaları)** · `seller.preorder-conversations.index`
  - **Product Queries (Ürün Soruları)** · `seller.preorder_product_query.index`
  - **Product Reviews (Ürün Yorumları)** · `seller.preorder_product_reviews`

### Finance (Finans)
- **Money Withdraw (Para Çekme Talepleri)** · `seller.money_withdraw_requests.index`
- **Payment History (Ödeme Geçmişi)** · `seller.payments.index`
- **Commission (Komisyon Geçmişi)** · `seller.commission-history.index`

### Communication (İletişim)
- **Support & Communication (Destek ve İletişim)** · `—`
  - **Conversations (Mesajlaşmalar)** · `seller.conversations.index`
  - **Product Queries (Ürün Soruları)** · `seller.product_query.index`
  - **Support Ticket (Destek Talepleri)** · `seller.support_ticket.index`

### Marketing & Promotions (Pazarlama ve Promosyonlar)
- **Promotion & Offers (Promosyonlar ve Teklifler)** · `—`
  - **Promotional Product (Promosyonel Ürünler)** · `seller.promotional_products.index`
  - **Category Wise Discount (Kategori Bazlı İndirim)** · `seller.categories_wise_product_discount`
  - **Coupon (Kuponlar)** · `seller.coupon.index`

### Content & Design (İçerik ve Tasarım)
- **Shop Design (Mağaza Tasarımı)** · `seller.shop.design`
- **Uploaded Files (Yüklenen Dosyalar)** · `seller.uploaded-files.index`

### Settings (Ayarlar)
- **Shop Settings (Mağaza Ayarları)** · `seller.shop.index`
- **Package (Paketler)** · `—`
  - **Packages (Paket Listesi)** · `seller.seller_packages_list`
  - **Purchase Packages (Satın Alınan Paketler)** · `seller.packages_payment_list`
- **GST System (GST Vergi Sistemi)** · `—`
  - **HSN Assign (HSN Atama)** · `seller.products.hsn-gst.assigns`
  - **Wholesale Products (Toptan Ürünler)** · `seller.products.wholesale-hsn-gst.assigns`
  - **Preorder Products (Ön Sipariş Ürünleri)** · `seller.products.preorder-hsn-gst.assigns`
  - **Auction Products (Açık Artırma Ürünleri)** · `seller.products.auction-hsn-gst.assigns`

---

## 3. Kurye (Delivery Boy) Paneli

- **Dashboard (Kontrol Paneli)** · `dashboard`
- **Assigned Delivery (Atanan Teslimatlar)** · `assigned-deliveries`
- **Picked Up Delivery (Teslim Alınanlar)** · `pickup-deliveries`
- **On The Way Delivery (Yoldaki Teslimatlar)** · `on-the-way-deliveries`
- **Pending Delivery (Bekleyen Teslimatlar)** · `pending-deliveries`
- **Completed Delivery (Tamamlanan Teslimatlar)** · `completed-deliveries`
- **Cancelled Delivery (İptal Edilen Teslimatlar)** · `cancelled-deliveries`
- **Request to Cancel (İptal Talepleri)** · `cancel-request-list`
- **Total Collection (Toplam Tahsilat)** · `total-collection`
- **Earnings (Toplam Kazanç)** · `total-earnings`
- **Manage Profile (Profili Yönet)** · `profile`

---

## 4. Müşteri Hesabı (Frontend Kullanıcı Gezinmesi)

- **Dashboard (Kontrol Paneli)** · `dashboard`
- **Purchase History (Satın Alma Geçmişi)** · `purchase_history.index`
- **Preorder (Ön Sipariş)** · `—`
  - **Preorder List (Ön Sipariş Listesi)** · `preorder.order_list`
  - **Preorder Conversations (Ön Sipariş Mesajlaşmaları)** · `preorder-conversations.customer-index`
- **Downloads (İndirilebilir Dijital Ürünler)** · `digital_purchase_history.index`
- **Refund Requests (İade Talepleri)** · `customer_refund_request`
- **Wishlist (İstek Listesi)** · `wishlists.index`
- **Compare (Karşılaştırma Listesi)** · `compare`
- **Followed Sellers (Takip Edilen Satıcılar)** · `followed_seller`
- **Classified Products (Müşteri İlan Ürünleri)** · `customer_products.index`
- **Auction (Açık Artırma)** · `—`
  - **Bidded Products (Teklif Verilen Ürünler)** · `auction_product_bids.index`
  - **Purchase History (Açık Artırma Satın Alma Geçmişi)** · `auction_product.purchase_history`
- **Conversations (Mesajlaşmalar)** · `conversations.index`
- **My Wallet (Cüzdanım)** · `wallet.index`
- **Earning Points (Kazanılan Puanlar)** · `earnng_point_for_user`
- **Affiliate (Satış Ortaklığı)** · `—`
  - **Affiliate System (Ortaklık Sistemi)** · `affiliate.user.index`
  - **Payment History (Ödeme Geçmişi)** · `affiliate.user.payment_history`
  - **Withdraw request history (Para Çekme Talebi Geçmişi)** · `affiliate.user.withdraw_request_history`
- **Support Ticket (Destek Talepleri)** · `support_ticket.index`
- **Manage Profile (Profili Yönet)** · `profile`

---

## 5. Eklenti (Addon) Menüleri (`D:\www\aec\addons` Özel Haritası)

`D:\www\aec\addons` klasöründe yer alan 17 eklentinin menü durumu 3 gruba ayrılmaktadır:

### 5.1 Ana Yönetici ve Satıcı Menüsüne Önceden Entegre Edilmiş Eklentiler
Bu eklentilerin menü maddeleri halihazırda `admin_sidenav.blade.php` ve `seller_sidenav.blade.php` dosyalarında bulunmaktadır (yalnızca `addon_is_activated(...)` kontrolü ile görünür hale gelir):
- **`affiliate_system`** (Satış Ortaklığı / Affiliate):
  - Yönetici: `Marketing & Promotions → Affiliate System` (6 ekran: `affiliate.configs`, `affiliate.index`, `affiliate.users`, `refferals.users`, `affiliate.withdraw_requests`, `affiliate.logs.admin`)
  - Müşteri: `Affiliate` (3 ekran: `affiliate.user.index`, `affiliate.user.payment_history`, `affiliate.user.withdraw_request_history`)
- **`club_point`** (Kulüp Puanı):
  - Yönetici: `Marketing & Promotions → Club Point System` (3 ekran: `club_points.configs`, `set_product_points`, `club_points.index`)
  - Müşteri: `Earning Points` (`earnng_point_for_user`)
- **`delivery_boy`** (Kurye):
  - Yönetici: `Users → Delivery Boy` (6 ekran: `delivery-boys.index`, `delivery-boys.create`, `delivery-boys-payment-histories`, `delivery-boys-collection-histories`, `delivery-boy.cancel-request`, `delivery-boy-configuration`)
  - Kurye özel paneli: `delivery_boy_sidenav.blade.php` (11 ekran — bkz: Bölüm 3)
- **`offline_payment`** (Manuel / Çevrimdışı Ödeme):
  - Yönetici: `Integrations → Payment Gateways → Offline Payment System` (5 ekran: `manual_payment_methods.index`, `offline_payment_orders.index`, `offline_wallet_recharge_request.index`, `offline_seller_package_payment_request.index`, `payout_method_for_customer_index`)
- **`otp_system`** (OTP / SMS Doğrulama):
  - Yönetici: `Integrations → OTP System` (3 ekran: `otp.login_configuration`, `otp.configconfiguration`, `sms-templates.index`)
- **`pos_system`** (Kasa / POS Sistemi):
  - Yönetici: `Orders & Sales → POS System` (4 ekran: `poin-of-sales.index`, `poin-of-sales.activation`, `pos.orders`, `admin.pos.products`)
  - Satıcı: `Orders & Sales → POS System` (4 ekran: `poin-of-sales.seller_index`, `pos.configuration`, `seller.pos.orders`, `seller.pos.products`)
- **`preorder`** (Ön Sipariş):
  - Yönetici: `Orders & Sales → Preorder` (11 ekran: `preorder.dashboard`, `preorder-product.create`, `preorder-product.index`, `all_preorder.list`, `inhouse_preorder.list`, `seller_preorder.list`, `delayed_prepayment_preorders.list`, `delayed_final_orders.list`, `preorder-conversations.admin_index`, `preorder.product_query.index`, `preorder.product_reviews.index`, `preorder-notification-types.index`)
  - Satıcı: `Orders & Sales → Preorder` (9 ekran: `seller.preorder.dashboard`, `seller.preorder-product.create`, `seller.preorder-product.index`, `seller.all_preorder.list`, `seller.delayed_prepayment_preorders.list`, `seller.delayed_final_orders.list`, `seller.preorder-conversations.index`, `seller.preorder_product_query.index`, `seller.preorder_product_reviews`)
  - Müşteri: `Preorder` (2 ekran: `preorder.order_list`, `preorder-conversations.customer-index`)
- **`refund_system`** (İade Sistemi):
  - Yönetici: `Orders & Sales → Refunds` (5 ekran: `refund_requests_all`, `dispute_refund_requests_all`, `refund_time_config`, `refund_reason_index`, `categories_wise_product_refund`)
  - Satıcı: `Orders & Sales → Refunds` (2 ekran: `seller.vendor_refund_request`, `seller.refund_configuration`)
  - Müşteri: `Refund Requests` (`customer_refund_request`)
- **`seller-subscription-addon`** (Satıcı Paketleri / Abonelik):
  - Yönetici: `Users → Sellers → Seller Packages` (`seller_packages.index`)
  - Satıcı: `Settings → Package` (2 ekran: `seller.seller_packages_list`, `seller.packages_payment_list`)

---

### 5.2 Özel / Dinamik Olarak Eklenen Eklenti Menüleri
Bu eklentiler ana blade dosyasına `apply.php` aracılığıyla yamanır veya `addons/<addon>/views/` altında kendi bağımsız menü parçasına sahiptir:

#### 1. `ai_translate` (Yapay Zeka Çeviri Eklentisi)
- **Kaynak:** `addons/ai_translate/views/admin_sidenav.blade.php`
- **Göründüğü Yer:** `Settings` / `Languages` veya `AI Studio` bloğu
- **Yetki:** `can: language_setup`
- **Menü:**
  - **AI Translation (Yapay Zeka Çevirisi)** · `—` · can: `language_setup`
    - **Configuration (Yapılandırma)** · `ai-translate.config`
    - **Token Usage (Token Kullanımı)** · `ai-translate.token-usage`

#### 2. `qrcode_event` (QR Kod Çekiliş / Ödül Sistemi Eklentisi)
- **Kaynak:** `addons/qrcode_event/scripts/apply.php`
- **Göründüğü Yer:** `Marketing & Promotions` bölümü
- **Yetki:** `canany: qrcode_event_configuration, qrcode_event_codes, qrcode_event_reports`
- **Menü:**
  - **Ödül Sistemi (Uduş Sistemi)** · `—`
    - **Statistika (İstatistikler)** · `qrcode_event.index` · can: `qrcode_event_configuration`
    - **Kampaniyalar (Kampanyalar)** · `qrcode_event.campaigns` · can: `qrcode_event_configuration`
    - **Kod partiyalari (Kod Partileri)** · `qrcode_event.batches` · can: `qrcode_event_codes`
    - **Kodlar** · `qrcode_event.codes` · can: `qrcode_event_codes`
    - **Yoxlama jurnali (Denetim / İnceleme Günlüğü)** · `qrcode_event.logs` · can: `qrcode_event_reports`

#### 3. `payriff` (Payriff Ödeme Ağ Geçidi Eklentisi)
- **Kaynak:** `addons/payriff/scripts/apply.php`
- **Göründüğü Yer:** `Integrations → Payment Gateways` bölümü
- **Menü:**
  - **Payriff Payment Gateway** · `payriff.index` · can: `payriff_payment_gateway_configuration`

#### 4. `map_provider` (Harita / OpenStreetMap Eklentisi)
- **Kaynak:** `addons/map_provider/scripts/apply.php`
- **Göründüğü Yer:** `Settings → Setup & Configurations` bölümü
- **Menü:** Mevcut `Google Map` menüsünün yerini alır veya ayrı bir seçenek olarak sunar:
  - **Map (OpenStreetMap / Provider)** · `google-map.index` · can: `google_map_setting`

---

### 5.3 Menü Öğesi Bulunmayan (CLI, Düzeltme veya Belge) Eklentiler
- **`az_slug`**: Azerbaycan alfabesindeki harfler için slug optimizasyonu (CLI komutu: `php artisan az_slug:apply`), kullanıcı arayüzü menüsü yoktur.
- **`license_cleaner`**: Lisans ve arka kapı temizleme komutları, kullanıcı arayüzü menüsü yoktur.
- **`wholesale_unit_fix`**: Toptan satış birim hataları için düzeltme betiği (`apply.php`), menü maddesi yoktur (ekranlar ana `Wholesale Products` altındadır).
- **`Google One-Tap Login Add-on...`**: Yalnızca dokümantasyon klasörüdür (`.docx`), kod veya menü maddesi içermez.
