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

  STAFF: {
    INDEX: 'staff.index',
    SHOW: 'staff.show',
    CREATE: 'staff.create',
    UPDATE: 'staff.update',
    DELETE: 'staff.delete',
    VIEW: 'staff.view',
  },

  ROLE: {
    INDEX: 'role.index',
    SHOW: 'role.show',
    CREATE: 'role.create',
    UPDATE: 'role.update',
    DELETE: 'role.delete',
    MANAGE: 'role.manage',
  },

  COURIER: {
    INDEX: 'courier.index',
    SHOW: 'courier.show',
    CREATE: 'courier.create',
    UPDATE: 'courier.update',
    DELETE: 'courier.delete',
  },

  PRODUCTS: {
    INDEX: 'products.index',
    SHOW: 'products.show',
    CREATE: 'products.create',
    UPDATE: 'products.update',
    DELETE: 'products.delete',
    REVIEWS: 'products.reviews',
  },

  ORDERS: {
    INDEX: 'orders.index',
    SHOW: 'orders.show',
    IN_HOUSE: 'orders.in_house',
    SELLER: 'orders.seller',
    PICKUP: 'orders.pickup',
    UNPAID: 'orders.unpaid',
    UPDATE_STATUS: 'orders.update_status',
    DELETE: 'orders.delete',
  },

  CUSTOMERS: {
    INDEX: 'customers.index',
    SHOW: 'customers.show',
    UNVERIFIED: 'customers.unverified',
    CLASSIFIED_PRODUCTS: 'customers.classified_products',
    PACKAGES: 'customers.packages',
    BAN: 'customers.ban',
    DELETE: 'customers.delete',
  },
} as const
