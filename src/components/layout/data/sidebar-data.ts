import {
  BarChart3,
  Boxes,
  Megaphone,
  CalendarClock,
  ClipboardList,
  Command,
  Factory,
  Banknote,
  BookOpen,
  FileBarChart,
  FileText,
  Landmark,
  HandCoins,
  CreditCard,
  Wallet,
  Languages,
  LayoutDashboard,
  Package,
  PackageOpen,
  Receipt,
  Settings2,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  Target,
  Users,
  UsersRound,
} from 'lucide-react'
import { PERMISSIONS } from '@/shared/constant'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'admin',
    email: 'admin@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Prielaz',
      logo: Command,
      plan: 'ERP',
    },
  ],
  navGroups: [
    {
      key: 'general',
      title: 'general.title',
      items: [
        {
          key: 'dashboard',
          title: 'general.dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },

    {
      key: 'user-management',
      title: 'userManagement.title',
      items: [
        {
          key: 'users',
          title: 'userManagement.users.title',
          icon: Users,
          items: [
            {
              key: 'users-all',
              title: 'userManagement.users.all',
              url: '/users',
              permission: PERMISSIONS.USERS.INDEX,
            },
            {
              key: 'roles',
              title: 'userManagement.users.roles',
              url: '/role',
              permission: PERMISSIONS.ROLES.INDEX,
            },
            {
              key: 'permissions',
              title: 'userManagement.users.permissions',
              url: '/permission',
              permission: PERMISSIONS.PERMISSIONS.INDEX,
            },
          ],
        },
      ],
    },

    /*
     * Warehouse module. Collapsible like the users group, and its permissions
     * disappear from `auth/me` while the module is switched off, so the whole
     * group hides itself.
     */
    {
      key: 'warehouse',
      title: 'warehouse.title',
      items: [
        {
          key: 'warehouse-stock',
          title: 'warehouse.stock',
          icon: Package,
          items: [
            {
              key: 'stock-movements',
              title: 'warehouse.stockMovements',
              url: '/stock-movement',
              permission: PERMISSIONS.STOCK_MOVEMENTS.INDEX,
            },
            {
              key: 'raw-materials',
              title: 'warehouse.rawMaterials',
              url: '/raw-material',
              permission: PERMISSIONS.RAW_MATERIALS.INDEX,
            },
            {
              key: 'stock-takes',
              title: 'warehouse.stockTakes',
              url: '/stock-take',
              permission: PERMISSIONS.STOCK_TAKES.INDEX,
            },
            {
              key: 'warehouse-reports',
              title: 'warehouse.reports',
              url: '/warehouse-report',
              permission: PERMISSIONS.WAREHOUSE_REPORTS.VIEW,
            },
          ],
        },
        {
          key: 'warehouse-catalogue',
          title: 'warehouse.catalogue',
          icon: Boxes,
          items: [
            {
              key: 'suppliers',
              title: 'warehouse.suppliers',
              url: '/supplier',
              permission: PERMISSIONS.SUPPLIERS.INDEX,
            },
            {
              key: 'warehouse-locations',
              title: 'warehouse.locations',
              url: '/warehouse-location',
              permission: PERMISSIONS.WAREHOUSE_LOCATIONS.INDEX,
            },
            {
              key: 'units',
              title: 'warehouse.units',
              url: '/unit',
              permission: PERMISSIONS.UNITS.INDEX,
            },
          ],
        },
      ],
    },

    /*
     * Production module. Hides itself the same way the warehouse group does
     * when the module is switched off.
     */
    {
      key: 'production',
      title: 'production.title',
      items: [
        {
          key: 'production-manufacturing',
          title: 'production.manufacturing',
          icon: Factory,
          items: [
            {
              key: 'production-orders',
              title: 'production.orders',
              url: '/production-order',
              permission: PERMISSIONS.PRODUCTION_ORDERS.INDEX,
            },
            {
              key: 'recipes',
              title: 'production.recipes',
              url: '/recipe',
              permission: PERMISSIONS.RECIPES.INDEX,
            },
          ],
        },
      ],
    },

    /*
     * Products module. The finished-goods catalogue is its own module now:
     * Production writes into its ledger and Sales draws from it, but a shop
     * that only resells can run this with Production switched off.
     */
    {
      key: 'products',
      title: 'products.title',
      items: [
        {
          key: 'products-catalogue',
          title: 'products.catalogue',
          icon: PackageOpen,
          items: [
            {
              key: 'products-all',
              title: 'products.all',
              url: '/product',
              permission: PERMISSIONS.PRODUCTS.INDEX,
            },
            {
              key: 'product-categories',
              title: 'products.categories',
              url: '/product-category',
              permission: PERMISSIONS.PRODUCT_CATEGORIES.INDEX,
            },
          ],
        },
        {
          key: 'products-stock',
          title: 'products.stock',
          icon: Boxes,
          items: [
            {
              key: 'product-stock',
              title: 'products.productStock',
              url: '/product-stock',
              permission: PERMISSIONS.PRODUCT_STOCK.INDEX,
            },
            {
              key: 'product-reports',
              title: 'products.reports',
              url: '/product-report',
              permission: PERMISSIONS.PRODUCT_REPORTS.VIEW,
            },
          ],
        },
      ],
    },

    /*
     * Sales module. A seller who only holds the "own" permissions still gets
     * these links; the API narrows what they contain.
     */
    {
      key: 'sales',
      title: 'sales.title',
      items: [
        {
          key: 'sales-desk',
          title: 'sales.desk',
          icon: ShoppingCart,
          items: [
            {
              key: 'sales-all',
              title: 'sales.all',
              url: '/sale',
              permission: PERMISSIONS.SALES.INDEX,
              anyPermission: [PERMISSIONS.SALES.INDEX, PERMISSIONS.SALES.VIEW_OWN],
            },
            {
              key: 'customers',
              title: 'sales.customers',
              url: '/customer',
              permission: PERMISSIONS.CUSTOMERS.INDEX,
              anyPermission: [
                PERMISSIONS.CUSTOMERS.INDEX,
                PERMISSIONS.CUSTOMERS.VIEW_OWN,
              ],
            },
          ],
        },
        {
          key: 'sales-insight',
          title: 'sales.insight',
          icon: Receipt,
          items: [
            {
              key: 'sales-reports',
              title: 'sales.reports',
              url: '/sales-report',
              permission: PERMISSIONS.SALES_REPORTS.VIEW,
            },
          ],
        },
      ],
    },


    /*
     * Orders module. Pre-orders / backorders that feed into Sales once
     * stock is available from Production.
     */
    {
      key: 'orders',
      title: 'orders.title',
      items: [
        {
          key: 'orders-all',
          title: 'orders.all',
          url: '/order',
          icon: ClipboardList,
          permission: PERMISSIONS.ORDERS.INDEX,
          anyPermission: [PERMISSIONS.ORDERS.INDEX, PERMISSIONS.ORDERS.VIEW_OWN],
        },
        {
          key: 'order-summary',
          title: 'orders.summary',
          url: '/order-summary',
          icon: BarChart3,
          permission: PERMISSIONS.ORDER_SUMMARY.VIEW,
        },
      ],
    },

    /*
     * Employees (HR). The people the other modules point at.
     */
    {
      key: 'hr',
      title: 'hr.title',
      items: [
        {
          key: 'hr-people',
          title: 'hr.people',
          icon: UsersRound,
          items: [
            {
              key: 'employees',
              title: 'hr.employees',
              url: '/employee',
              permission: PERMISSIONS.EMPLOYEES.INDEX,
            },
            {
              key: 'departments',
              title: 'hr.departments',
              url: '/department',
              permission: PERMISSIONS.DEPARTMENTS.INDEX,
            },
          ],
        },
        {
          key: 'hr-time',
          title: 'hr.time',
          icon: CalendarClock,
          items: [
            {
              key: 'attendance',
              title: 'hr.attendance',
              url: '/attendance',
              permission: PERMISSIONS.ATTENDANCE.INDEX,
            },
            {
              key: 'leave',
              title: 'hr.leave',
              url: '/leave',
              permission: PERMISSIONS.LEAVE_REQUESTS.INDEX,
            },
            {
              key: 'payroll',
              title: 'hr.payroll',
              url: '/payroll',
              permission: PERMISSIONS.PAYROLL.VIEW,
            },
          ],
        },
        {
          key: 'hr-performance',
          title: 'hr.performance',
          icon: Target,
          items: [
            {
              key: 'employee-goals',
              title: 'hr.goals',
              url: '/employee-goal',
              permission: PERMISSIONS.EMPLOYEE_GOALS.INDEX,
            },
            {
              key: 'announcements',
              title: 'hr.announcements',
              url: '/announcement',
              icon: Megaphone,
              permission: PERMISSIONS.ANNOUNCEMENTS.INDEX,
            },
            {
              key: 'activity-logs',
              title: 'hr.activityLog',
              url: '/activity-log',
              permission: PERMISSIONS.ACTIVITY_LOGS.INDEX,
            },
          ],
        },
      ],
    },


    /*
     * Finance module. Income/expense tracking, debts, payments, reports.
     */
    {
      key: 'finance',
      title: 'finance.title',
      items: [
        {
          key: 'finance-categories',
          title: 'finance.categories',
          url: '/finance-category',
          icon: BookOpen,
          permission: PERMISSIONS.FINANCE_CATEGORIES.INDEX,
        },
        {
          key: 'payment-methods',
          title: 'finance.paymentMethods',
          url: '/payment-method',
          icon: CreditCard,
          permission: PERMISSIONS.PAYMENT_METHODS.INDEX,
        },
                {
          key: 'invoices',
          title: 'finance.invoices',
          url: '/invoice',
          icon: FileText,
          permission: PERMISSIONS.INVOICES.INDEX,
        },
        {
          key: 'cash-accounts',
          title: 'finance.cashAccounts',
          url: '/cash-account',
          icon: Landmark,
          permission: PERMISSIONS.CASH_ACCOUNTS.INDEX,
        },
        {
          key: 'finance-transactions',
          title: 'finance.transactions',
          url: '/finance-transaction',
          icon: Wallet,
          permission: PERMISSIONS.FINANCE_TRANSACTIONS.INDEX,
        },
        {
          key: 'debts',
          title: 'finance.debts',
          url: '/debt',
          icon: HandCoins,
          permission: PERMISSIONS.DEBTS.INDEX,
        },
        {
          key: 'finance-reports',
          title: 'finance.reports',
          url: '/finance-report',
          icon: FileBarChart,
          permission: PERMISSIONS.FINANCE_REPORTS.INDEX,
        },
      ],
    },

    {
      key: 'platform',
      title: 'platform.title',
      items: [
        {
          key: 'currencies',
          title: 'platform.currencies',
          url: '/currency',
          icon: Banknote,
          permission: PERMISSIONS.CURRENCIES.INDEX,
        },
        {
          key: 'modules',
          title: 'platform.modules',
          url: '/module',
          icon: Settings2,
          permission: PERMISSIONS.MODULES.INDEX,
        },
        {
          key: 'languages',
          title: 'platform.languages',
          url: '/language',
          icon: Languages,
          permission: PERMISSIONS.LANGUAGES.INDEX,
        },
        {
          key: 'site-settings',
          title: 'platform.siteSettings',
          url: '/setting',
          icon: SlidersHorizontal,
          permission: PERMISSIONS.SETTINGS.INDEX,
        },
        {
          key: 'trash',
          title: 'platform.trash',
          url: '/trash',
          icon: Trash2,
          // Any module's trash permission is enough to open the section; the
          // page itself only draws the tabs the user may actually read.
          permission: PERMISSIONS.SETTINGS.TRASH,
        },
      ],
    },
  ],
}
