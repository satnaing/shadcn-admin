import {
  BadgePercent,
  BarChart2,
  Boxes,
  Flame,
  FolderTree,
  LayoutDashboard,
  Megaphone,
  Package,
  Palette,
  Scale,
  Sliders,
  Sparkles,
  ShoppingCart,
  Store,
  Tag,
  Users,
} from 'lucide-react'
import { PERMISSIONS } from '@/shared/permissions'
import { type SidebarData } from '../types'

export const sidebarAdminData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@xshop.az',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'xShop',
      logo: Store,
      plan: 'Admin',
    },
  ],
  navGroups: [
    {
      key: 'dashboard',
      title: 'nav.dashboard',
      items: [
        {
          key: 'admin-dashboard',
          title: 'nav.dashboard',
          url: '/admin',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      key: 'products',
      title: 'nav.products',
      items: [
        {
          key: 'products-menu',
          title: 'nav.products',
          icon: Package,
          items: [
            {
              key: 'all-products',
              title: 'nav.allProducts',
              url: '/admin/products',
            },
            {
              key: 'in-house-products',
              title: 'nav.inHouseProducts',
              url: '/admin/products/in-house',
            },
            {
              key: 'seller-products',
              title: 'nav.sellerProducts',
              url: '/admin/products/seller',
            },
            {
              key: 'create-product',
              title: 'nav.addNewProduct',
              url: '/admin/products/create',
            },
            {
              key: 'product-reviews',
              title: 'nav.productReviews',
              url: '/admin/products/reviews',
            },
          ],
        },
        {
          key: 'product-setup',
          title: 'nav.productSetup',
          icon: Boxes,
          items: [
            {
              key: 'categories',
              title: 'nav.categories',
              url: '/admin/categories',
              icon: FolderTree,
            },
            {
              key: 'brands',
              title: 'nav.brands',
              url: '/admin/brands',
              icon: Tag,
            },
            {
              key: 'colors',
              title: 'nav.colors',
              url: '/admin/colors',
              icon: Palette,
            },
            {
              key: 'attributes',
              title: 'nav.attributes',
              url: '/admin/attributes',
              icon: Sliders,
            },
            {
              key: 'units',
              title: 'nav.units',
              url: '/admin/units',
              icon: Scale,
            },
          ],
        },
        {
          key: 'wholesale-menu',
          title: 'nav.wholesaleProducts',
          icon: BadgePercent,
          items: [
            {
              key: 'all-wholesale-products',
              title: 'nav.allWholesaleProducts',
              url: '/admin/wholesale-products',
            },
            {
              key: 'in-house-wholesale-products',
              title: 'nav.inHouseWholesaleProducts',
              url: '/admin/wholesale-products/in-house',
            },
            {
              key: 'seller-wholesale-products',
              title: 'nav.sellerWholesaleProducts',
              url: '/admin/wholesale-products/seller',
            },
            {
              key: 'create-wholesale-product',
              title: 'nav.addNewWholesaleProduct',
              url: '/admin/wholesale-products/create',
            },
          ],
        },
        {
          key: 'classified-menu',
          title: 'nav.classifiedProducts',
          icon: Sparkles,
          items: [
            {
              key: 'all-classified-products',
              title: 'nav.allClassifiedProducts',
              url: '/admin/classified-products',
            },
            {
              key: 'in-house-classified-products',
              title: 'nav.inHouseClassifiedProducts',
              url: '/admin/classified-products/in-house',
            },
            {
              key: 'seller-classified-products',
              title: 'nav.sellerClassifiedProducts',
              url: '/admin/classified-products/seller',
            },
            {
              key: 'create-classified-product',
              title: 'nav.addNewClassifiedProduct',
              url: '/admin/classified-products/create',
            },
          ],
        },
      ],
    },
    {
      key: 'orders-sales',
      title: 'nav.ordersSales',
      items: [
        {
          key: 'sales-menu',
          title: 'nav.sales',
          icon: ShoppingCart,
          items: [
            {
              key: 'all-orders',
              title: 'nav.allOrders',
              url: '/admin/orders',
            },
            {
              key: 'inhouse-orders',
              title: 'nav.inHouseOrders',
              url: '/admin/orders/in-house',
            },
            {
              key: 'seller-orders',
              title: 'nav.sellerOrders',
              url: '/admin/orders/seller',
            },
            {
              key: 'pickup-point-orders',
              title: 'nav.pickupPointOrders',
              url: '/admin/orders/pickup-point',
            },
            {
              key: 'unpaid-orders',
              title: 'nav.unpaidOrders',
              url: '/admin/orders/unpaid',
            },
          ],
        },
      ],
    },
    {
      key: 'users',
      title: 'nav.users',
      items: [
        {
          key: 'sellers-menu',
          title: 'nav.sellers',
          icon: Store,
          items: [
            {
              key: 'all-sellers',
              title: 'nav.allSellers',
              url: '/admin/sellers',
            },
            {
              key: 'pending-sellers',
              title: 'nav.pendingSellers',
              url: '/admin/sellers/pending',
            },
            {
              key: 'rating-followers',
              title: 'nav.ratingFollowers',
              url: '/admin/sellers/rating-followers',
            },
            {
              key: 'payout-requests',
              title: 'nav.payoutRequests',
              url: '/admin/sellers/payout-requests',
            },
            {
              key: 'payouts',
              title: 'nav.payouts',
              url: '/admin/sellers/payouts',
            },
            {
              key: 'commissions',
              title: 'nav.commissions',
              url: '/admin/sellers/commissions',
            },
            {
              key: 'seller-packages',
              title: 'nav.sellerPackages',
              url: '/admin/sellers/packages',
            },
            {
              key: 'verification-form',
              title: 'nav.verificationForm',
              url: '/admin/sellers/verification-form',
            },
          ],
        },
        {
          key: 'customers-menu',
          title: 'nav.customers',
          icon: Users,
          items: [
            {
              key: 'all-customers',
              title: 'nav.customerList',
              url: '/admin/customers',
            },
            {
              key: 'unverified-customers',
              title: 'nav.unverifiedCustomers',
              url: '/admin/customers/unverified',
            },
            {
              key: 'classified-packages',
              title: 'nav.classifiedPackages',
              url: '/admin/customers/packages',
            },
          ],
        },
      ],
    },
    {
      key: 'marketing-promotions',
      title: 'nav.marketingPromotions',
      items: [
        {
          key: 'promotions-menu',
          title: 'nav.promotionsOffers',
          icon: Flame,
          items: [
            {
              key: 'promotions-home',
              title: 'nav.promotionsHome',
              url: '/admin/promotions',
            },
            {
              key: 'promotional-products',
              title: 'nav.promotionalProducts',
              url: '/admin/promotions/products',
            },
            {
              key: 'seller-promotional-products',
              title: 'nav.sellerPromotionalProducts',
              url: '/admin/promotions/seller-products',
            },
            {
              key: 'flash-deals',
              title: 'nav.flashDeals',
              url: '/admin/promotions/flash-deals',
            },
            {
              key: 'category-discounts',
              title: 'nav.categoryDiscounts',
              url: '/admin/promotions/category-discounts',
            },
            {
              key: 'coupons',
              title: 'nav.coupons',
              url: '/admin/promotions/coupons',
            },
          ],
        },
        {
          key: 'marketing-menu',
          title: 'nav.marketing',
          icon: Megaphone,
          items: [
            {
              key: 'marketing-home',
              title: 'nav.marketingHome',
              url: '/admin/marketing',
            },
            {
              key: 'dynamic-popups',
              title: 'nav.dynamicPopups',
              url: '/admin/marketing/popups',
            },
            {
              key: 'custom-alerts',
              title: 'nav.customAlerts',
              url: '/admin/marketing/alerts',
            },
            {
              key: 'custom-sale-alerts',
              title: 'nav.customSaleAlerts',
              url: '/admin/marketing/sale-alerts',
            },
            {
              key: 'email-templates',
              title: 'nav.emailTemplates',
              url: '/admin/marketing/email-templates',
            },
            {
              key: 'blogs',
              title: 'nav.blogs',
              url: '/admin/marketing/blogs',
            },
            {
              key: 'blog-categories',
              title: 'nav.blogCategories',
              url: '/admin/marketing/blog-categories',
            },
            {
              key: 'newsletters',
              title: 'nav.newsletters',
              url: '/admin/marketing/newsletters',
            },
            {
              key: 'notification-types',
              title: 'nav.notificationTypes',
              url: '/admin/marketing/notifications/types',
            },
            {
              key: 'notification-send',
              title: 'nav.notificationSend',
              url: '/admin/marketing/notifications/send',
            },
            {
              key: 'notification-history',
              title: 'nav.notificationHistory',
              url: '/admin/marketing/notifications/history',
            },
            {
              key: 'notification-settings',
              title: 'nav.notificationSettings',
              url: '/admin/marketing/notifications/settings',
            },
            {
              key: 'bulk-sms',
              title: 'nav.bulkSms',
              url: '/admin/marketing/sms',
            },
            {
              key: 'subscribers',
              title: 'nav.subscribers',
              url: '/admin/marketing/subscribers',
            },
            {
              key: 'custom-visitors',
              title: 'nav.customVisitors',
              url: '/admin/marketing/visitors',
            },
          ],
        },
        {
          key: 'analytics-menu',
          title: 'nav.analytics',
          icon: BarChart2,
          items: [
            {
              key: 'analytics-home',
              title: 'nav.analyticsHome',
              url: '/admin/analytics',
            },
            {
              key: 'google-analytics',
              title: 'nav.googleAnalytics',
              url: '/admin/analytics/google',
            },
            {
              key: 'ga4-reports',
              title: 'nav.ga4Reports',
              url: '/admin/analytics/google-reports',
            },
            {
              key: 'gtm',
              title: 'nav.gtm',
              url: '/admin/analytics/gtm',
            },
            {
              key: 'meta-pixel',
              title: 'nav.metaPixel',
              url: '/admin/analytics/pixel',
            },
            {
              key: 'conversions-api',
              title: 'nav.conversionsApi',
              url: '/admin/analytics/conversions-api',
            },
            {
              key: 'google-merchant',
              title: 'nav.googleMerchant',
              url: '/admin/analytics/gmc',
            },
            {
              key: 'facebook-catalogue',
              title: 'nav.facebookCatalogue',
              url: '/admin/analytics/facebook-catalogue',
            },
            {
              key: 'custom-scripts',
              title: 'nav.customScripts',
              url: '/admin/analytics/custom-scripts',
            },
            {
              key: 'sitemap-generator',
              title: 'nav.sitemapGenerator',
              url: '/admin/analytics/sitemap',
            },
            {
              key: 'global-seo',
              title: 'nav.globalSeo',
              url: '/admin/analytics/seo',
            },
          ],
        },
      ],
    },
    {
      key: 'report',
      title: 'nav.report',
      items: [],
    },
    {
      key: 'content-design',
      title: 'nav.contentDesign',
      items: [],
    },
    {
      key: 'communication',
      title: 'nav.communication',
      items: [],
    },
    {
      key: 'integrations',
      title: 'nav.integrations',
      items: [],
    },
    {
      key: 'settings',
      title: 'nav.settings',
      items: [
        {
          key: 'staffs',
          title: 'nav.staffs',
          icon: Users,
          items: [
            {
              key: 'all-staffs',
              title: 'nav.allStaffs',
              url: '/admin/users',
              permission: PERMISSIONS.USERS.INDEX,
            },
            {
              key: 'staff-roles',
              title: 'nav.staffRoles',
              url: '/admin/role',
              permission: PERMISSIONS.ROLES.INDEX,
            },
            {
              key: 'staff-permissions',
              title: 'nav.staffPermissions',
              url: '/admin/permission',
              permission: PERMISSIONS.PERMISSIONS.INDEX,
            },
          ],
        },
      ],
    },
  ],
}
