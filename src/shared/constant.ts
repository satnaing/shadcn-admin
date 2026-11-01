import { env } from '@/config/env'

export enum ModeEnum {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const APP_NAME = 'Prielaz ERP'
export const APP_VERSION = '2.2.1'

export const LIMIT = 10

export const MODE = env.VITE_BASE_NODE_ENV
export const BASE_URL = env.VITE_BASE_URL

export const locales = ['az', 'en', 'tr']

export const PERMISSIONS = {
  USERS: {
    INDEX: 'users.index',
    SHOW: 'users.show',
    CREATE: 'users.create',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
    TRASH: 'users.trash',
    RESTORE: 'users.restore',
    FORCE_DELETE: 'users.force_delete',
  },

  ROLES: {
    INDEX: 'roles.index',
    SHOW: 'roles.show',
    CREATE: 'roles.create',
    UPDATE: 'roles.update',
    DELETE: 'roles.delete',
    TRASH: 'roles.trash',
    RESTORE: 'roles.restore',
    FORCE_DELETE: 'roles.force_delete',
  },

  PERMISSIONS: {
    INDEX: 'permissions.index',
    SHOW: 'permissions.show',
    CREATE: 'permissions.create',
    UPDATE: 'permissions.update',
    DELETE: 'permissions.delete',
  
    TRASH: 'permissions.trash',
    RESTORE: 'permissions.restore',
    FORCE_DELETE: 'permissions.force_delete',
  },

  LANGUAGES: {
    INDEX: 'languages.index',
    SHOW: 'languages.show',
    CREATE: 'languages.create',
    UPDATE: 'languages.update',
    DELETE: 'languages.delete',
  
    TRASH: 'languages.trash',
    RESTORE: 'languages.restore',
    FORCE_DELETE: 'languages.force_delete',
  },

  SETTINGS: {
    INDEX: 'settings.index',
    SHOW: 'settings.show',
    CREATE: 'settings.create',
    UPDATE: 'settings.update',
    DELETE: 'settings.delete',
    TRASH: 'settings.trash',
    RESTORE: 'settings.restore',
    FORCE_DELETE: 'settings.force_delete',
  },

  CURRENCIES: {
    INDEX: 'currencies.index',
    SHOW: 'currencies.show',
    CREATE: 'currencies.create',
    UPDATE: 'currencies.update',
    DELETE: 'currencies.delete',
    TRASH: 'currencies.trash',
    RESTORE: 'currencies.restore',
    FORCE_DELETE: 'currencies.force_delete',
  },

  MODULES: {
    INDEX: 'modules.index',
    UPDATE: 'modules.update',
  },

  UNITS: {
    INDEX: 'units.index',
    SHOW: 'units.show',
    CREATE: 'units.create',
    UPDATE: 'units.update',
    DELETE: 'units.delete',
    TRASH: 'units.trash',
    RESTORE: 'units.restore',
    FORCE_DELETE: 'units.force_delete',
    EXPORT: 'units.export',
    IMPORT: 'units.import',
  },

  RAW_MATERIALS: {
    INDEX: 'raw_materials.index',
    SHOW: 'raw_materials.show',
    CREATE: 'raw_materials.create',
    UPDATE: 'raw_materials.update',
    DELETE: 'raw_materials.delete',
    TRASH: 'raw_materials.trash',
    RESTORE: 'raw_materials.restore',
    FORCE_DELETE: 'raw_materials.force_delete',
    EXPORT: 'raw_materials.export',
    IMPORT: 'raw_materials.import',
  },
  SUPPLIERS: {
    INDEX: 'suppliers.index',
    SHOW: 'suppliers.show',
    CREATE: 'suppliers.create',
    UPDATE: 'suppliers.update',
    DELETE: 'suppliers.delete',
    TRASH: 'suppliers.trash',
    RESTORE: 'suppliers.restore',
    FORCE_DELETE: 'suppliers.force_delete',
    EXPORT: 'suppliers.export',
    IMPORT: 'suppliers.import',
  },

  WAREHOUSE_LOCATIONS: {
    INDEX: 'warehouse_locations.index',
    SHOW: 'warehouse_locations.show',
    CREATE: 'warehouse_locations.create',
    UPDATE: 'warehouse_locations.update',
    DELETE: 'warehouse_locations.delete',
    TRASH: 'warehouse_locations.trash',
    RESTORE: 'warehouse_locations.restore',
    FORCE_DELETE: 'warehouse_locations.force_delete',
  },

  /** Append-only ledger: no update, no delete — only a reversal. */
  STOCK_MOVEMENTS: {
    INDEX: 'stock_movements.index',
    SHOW: 'stock_movements.show',
    CREATE: 'stock_movements.create',
    EXPORT: 'stock_movements.export',
    REVERSE: 'stock_movements.reverse',
  },

  WAREHOUSE_REPORTS: {
    VIEW: 'warehouse_reports.view',
  },
  STOCK_BATCHES: {
    INDEX: 'stock_batches.index',
    SHOW: 'stock_batches.show',
    EXPORT: 'stock_batches.export',
  },

  STOCK_TAKES: {
    INDEX: 'stock_takes.index',
    SHOW: 'stock_takes.show',
    CREATE: 'stock_takes.create',
    UPDATE: 'stock_takes.update',
    DELETE: 'stock_takes.delete',
    APPLY: 'stock_takes.apply',
  },
  /* Products module */

  PRODUCTS: {
    INDEX: 'products.index',
    SHOW: 'products.show',
    CREATE: 'products.create',
    UPDATE: 'products.update',
    DELETE: 'products.delete',
    TRASH: 'products.trash',
    RESTORE: 'products.restore',
    FORCE_DELETE: 'products.force_delete',
    EXPORT: 'products.export',
    IMPORT: 'products.import',
  },

  PRODUCT_CATEGORIES: {
    INDEX: 'product_categories.index',
    SHOW: 'product_categories.show',
    CREATE: 'product_categories.create',
    UPDATE: 'product_categories.update',
    DELETE: 'product_categories.delete',
  },

  PRODUCT_UNITS: {
    INDEX: 'product_units.index',
    SHOW: 'product_units.show',
    CREATE: 'product_units.create',
    UPDATE: 'product_units.update',
    DELETE: 'product_units.delete',
  },

  PRODUCT_PRICES: {
    INDEX: 'product_prices.index',
    SHOW: 'product_prices.show',
    CREATE: 'product_prices.create',
    UPDATE: 'product_prices.update',
    DELETE: 'product_prices.delete',
  },

  PRODUCT_REPORTS: {
    VIEW: 'product_reports.view',
  },

  /* Production module */

  RECIPES: {
    INDEX: 'recipes.index',
    SHOW: 'recipes.show',
    CREATE: 'recipes.create',
    UPDATE: 'recipes.update',
    DELETE: 'recipes.delete',
  },

  PRODUCTION_ORDERS: {
    INDEX: 'production_orders.index',
    SHOW: 'production_orders.show',
    CREATE: 'production_orders.create',
    UPDATE: 'production_orders.update',
    DELETE: 'production_orders.delete',
    /** Confirming is what actually moves stock. */
    CONFIRM: 'production_orders.confirm',
  },

  PRODUCT_STOCK: {
    INDEX: 'product_stock.index',
    SHOW: 'product_stock.show',
    CREATE: 'product_stock.create',
    EXPORT: 'product_stock.export',
  },

  PRODUCTION_REPORTS: {
    VIEW: 'production_reports.view',
  },

  /* Sales module */

  SALES: {
    INDEX: 'sales.index',
    SHOW: 'sales.show',
    CREATE: 'sales.create',
    UPDATE: 'sales.update',
    DELETE: 'sales.delete',
    INVOICE: 'sales.invoice',
    /** Completing is what actually draws finished stock. */
    COMPLETE: 'sales.complete',
    REFUND: 'sales.refund',
    CANCEL: 'sales.cancel',
    EXPORT: 'sales.export',
    /** The narrow half of the matrix: only the holder's own documents. */
    VIEW_OWN: 'sales.view_own',
    UPDATE_OWN: 'sales.update_own',
  },

  CUSTOMERS: {
    INDEX: 'customers.index',
    SHOW: 'customers.show',
    CREATE: 'customers.create',
    UPDATE: 'customers.update',
    DELETE: 'customers.delete',
    TRASH: 'customers.trash',
    RESTORE: 'customers.restore',
    FORCE_DELETE: 'customers.force_delete',
    VIEW_OWN: 'customers.view_own',
    EXPORT: 'customers.export',
    IMPORT: 'customers.import',
  },


  /* Orders (Sifariş) module */

  ORDERS: {
    INDEX: 'orders.index',
    SHOW: 'orders.show',
    CREATE: 'orders.create',
    UPDATE: 'orders.update',
    DELETE: 'orders.delete',
    TRASH: 'orders.trash',
    RESTORE: 'orders.restore',
    FORCE_DELETE: 'orders.force_delete',
    FULFILL: 'orders.fulfill',
    CANCEL: 'orders.cancel',
    VIEW_OWN: 'orders.view_own',
    UPDATE_OWN: 'orders.update_own',
  },

  ORDER_REPORTS: {
    VIEW: 'order_reports.view',
  },

  ORDER_SUMMARY: {
    VIEW: 'order_summary.view',
  },

  SALES_REPORTS: {
    VIEW: 'sales_reports.view',
  },

  /* Employees (HR) module */

  EMPLOYEES: {
    INDEX: 'employees.index',
    SHOW: 'employees.show',
    CREATE: 'employees.create',
    UPDATE: 'employees.update',
    DELETE: 'employees.delete',
    TRASH: 'employees.trash',
    RESTORE: 'employees.restore',
    FORCE_DELETE: 'employees.force_delete',
    EXPORT: 'employees.export',
    IMPORT: 'employees.import',
  },

  DEPARTMENTS: {
    INDEX: 'departments.index',
    SHOW: 'departments.show',
    CREATE: 'departments.create',
    UPDATE: 'departments.update',
    DELETE: 'departments.delete',
    EXPORT: 'departments.export',
  },

  ATTENDANCE: {
    INDEX: 'attendance.index',
    SHOW: 'attendance.show',
    CREATE: 'attendance.create',
    UPDATE: 'attendance.update',
    DELETE: 'attendance.delete',
  },

  EMPLOYEE_GOALS: {
    INDEX: 'employee_goals.index',
    SHOW: 'employee_goals.show',
    CREATE: 'employee_goals.create',
    UPDATE: 'employee_goals.update',
    DELETE: 'employee_goals.delete',
  },

  PAYROLL: {
    VIEW: 'payroll.view',
    RUN: 'payroll.run',
  },

  ACTIVITY_LOGS: {
    INDEX: 'activity_logs.index',
  },

  PAYMENT_METHODS: {
    INDEX: 'payment_methods.index',
    SHOW: 'payment_methods.show',
    CREATE: 'payment_methods.create',
    UPDATE: 'payment_methods.update',
    DELETE: 'payment_methods.delete',
    TRASH: 'payment_methods.trash',
    RESTORE: 'payment_methods.restore',
    FORCE_DELETE: 'payment_methods.force_delete',
  },

  FINANCE_CATEGORIES: {
    INDEX: 'finance_categories.index',
    SHOW: 'finance_categories.show',
    CREATE: 'finance_categories.create',
    UPDATE: 'finance_categories.update',
    DELETE: 'finance_categories.delete',
    TRASH: 'finance_categories.trash',
    RESTORE: 'finance_categories.restore',
    FORCE_DELETE: 'finance_categories.force_delete',
    EXPORT: 'finance_categories.export',
  },

  FINANCE_TRANSACTIONS: {
    INDEX: 'finance_transactions.index',
    SHOW: 'finance_transactions.show',
    CREATE: 'finance_transactions.create',
    UPDATE: 'finance_transactions.update',
    DELETE: 'finance_transactions.delete',
    TRASH: 'finance_transactions.trash',
    RESTORE: 'finance_transactions.restore',
    FORCE_DELETE: 'finance_transactions.force_delete',
    EXPORT: 'finance_transactions.export',
  },

  DEBTS: {
    INDEX: 'debts.index',
    SHOW: 'debts.show',
    CREATE: 'debts.create',
    UPDATE: 'debts.update',
    DELETE: 'debts.delete',
    TRASH: 'debts.trash',
    RESTORE: 'debts.restore',
    FORCE_DELETE: 'debts.force_delete',
    EXPORT: 'debts.export',
  },

  DEBT_PAYMENTS: {
    INDEX: 'debt_payments.index',
    CREATE: 'debt_payments.create',
  },

  FINANCE_REPORTS: {
    INDEX: 'finance_reports.index',
  },
  INVOICES: {
    INDEX: 'invoices.index',
    SHOW: 'invoices.show',
    CREATE: 'invoices.create',
    UPDATE: 'invoices.update',
    DELETE: 'invoices.delete',
    TRASH: 'invoices.trash',
    RESTORE: 'invoices.restore',
    FORCE_DELETE: 'invoices.force_delete',
    DOWNLOAD_PDF: 'invoices.download_pdf',
    UPDATE_STATUS: 'invoices.update_status',
    CREATE_FROM_SALE: 'invoices.create_from_sale',
  },

  INVOICE_REPORTS: {
    VIEW: 'invoice_reports.view',
  },

  ANNOUNCEMENTS: {
    INDEX: 'announcements.index',
    CREATE: 'announcements.create',
    DELETE: 'announcements.delete',
  },

  LEAVE_REQUESTS: {
    INDEX: 'leave_requests.index',
    CREATE: 'leave_requests.create',
    APPROVE: 'leave_requests.approve',
    DELETE: 'leave_requests.delete',
  },

  LEAVE_BALANCES: {
    INDEX: 'leave_balances.index',
  },

  CASH_ACCOUNTS: {
    INDEX: 'cash_accounts.index',
    SHOW: 'cash_accounts.show',
    CREATE: 'cash_accounts.create',
    UPDATE: 'cash_accounts.update',
    DELETE: 'cash_accounts.delete',
    TRANSFER: 'cash_accounts.transfer',
  },

  ACCOUNT_TRANSFERS: {
    INDEX: 'account_transfers.index',
  },

  NOTIFICATIONS: {
    INDEX: 'notifications.index',
    MARK_READ: 'notifications.mark_read',
  },

} as const
