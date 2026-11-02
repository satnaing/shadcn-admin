export interface RoleMockItem {
  [key: string]: unknown
  id: number
  name: string
  scope: 'admin' | 'seller'
  description?: string
  permissions: string[]
  users_count: number
  created_at: string
}

export interface PermissionModule {
  module: string
  label: string
  operations: {
    name: string
    key: string
    label: string
  }[]
}

export const permissionsMatrixMock: PermissionModule[] = [
  {
    module: 'users',
    label: 'İstifadəçilər',
    operations: [
      { name: 'index', key: 'users.index', label: 'Baxış' },
      { name: 'show', key: 'users.show', label: 'Ətraflı' },
      { name: 'create', key: 'users.create', label: 'Yaratmaq' },
      { name: 'update', key: 'users.update', label: 'Düzəliş' },
      { name: 'delete', key: 'users.delete', label: 'Silmək' },
      { name: 'trash', key: 'users.trash', label: 'Zibil qutusu' },
    ],
  },
  {
    module: 'roles',
    label: 'Rollar',
    operations: [
      { name: 'index', key: 'roles.index', label: 'Baxış' },
      { name: 'show', key: 'roles.show', label: 'Ətraflı' },
      { name: 'create', key: 'roles.create', label: 'Yaratmaq' },
      { name: 'update', key: 'roles.update', label: 'Düzəliş' },
      { name: 'delete', key: 'roles.delete', label: 'Silmək' },
    ],
  },
  {
    module: 'permissions',
    label: 'İcazələr',
    operations: [
      { name: 'index', key: 'permissions.index', label: 'Baxış' },
      { name: 'show', key: 'permissions.show', label: 'Ətraflı' },
      { name: 'create', key: 'permissions.create', label: 'Yaratmaq' },
      { name: 'update', key: 'permissions.update', label: 'Düzəliş' },
      { name: 'delete', key: 'permissions.delete', label: 'Silmək' },
    ],
  },
  {
    module: 'staff',
    label: 'İşçilər',
    operations: [
      { name: 'index', key: 'staff.index', label: 'Baxış' },
      { name: 'show', key: 'staff.show', label: 'Ətraflı' },
      { name: 'create', key: 'staff.create', label: 'Yaratmaq' },
      { name: 'update', key: 'staff.update', label: 'Düzəliş' },
      { name: 'delete', key: 'staff.delete', label: 'Silmək' },
      { name: 'view', key: 'staff.view', label: 'Görüntüləmə' },
    ],
  },
  {
    module: 'role',
    label: 'Rol İdarəetməsi',
    operations: [
      { name: 'index', key: 'role.index', label: 'Baxış' },
      { name: 'create', key: 'role.create', label: 'Yaratmaq' },
      { name: 'update', key: 'role.update', label: 'Düzəliş' },
      { name: 'delete', key: 'role.delete', label: 'Silmək' },
      { name: 'manage', key: 'role.manage', label: 'İdarə etmək' },
    ],
  },
  {
    module: 'products',
    label: 'Məhsullar',
    operations: [
      { name: 'index', key: 'products.index', label: 'Baxış' },
      { name: 'show', key: 'products.show', label: 'Ətraflı' },
      { name: 'create', key: 'products.create', label: 'Yaratmaq' },
      { name: 'update', key: 'products.update', label: 'Düzəliş' },
      { name: 'delete', key: 'products.delete', label: 'Silmək' },
      { name: 'export', key: 'products.export', label: 'İxrac' },
      { name: 'import', key: 'products.import', label: 'İdxal' },
    ],
  },
  {
    module: 'orders',
    label: 'Sifarişlər',
    operations: [
      { name: 'index', key: 'orders.index', label: 'Baxış' },
      { name: 'show', key: 'orders.show', label: 'Ətraflı' },
      { name: 'update', key: 'orders.update', label: 'Düzəliş' },
      { name: 'update_status', key: 'orders.update_status', label: 'Status dəyişmə' },
    ],
  },
  {
    module: 'sellers',
    label: 'Satıcılar',
    operations: [
      { name: 'index', key: 'sellers.index', label: 'Baxış' },
      { name: 'show', key: 'sellers.show', label: 'Ətraflı' },
      { name: 'approve', key: 'sellers.approve', label: 'Təsdiq etmək' },
    ],
  },
  {
    module: 'courier',
    label: 'Kuryer',
    operations: [
      { name: 'index', key: 'courier.index', label: 'Baxış' },
      { name: 'show', key: 'courier.show', label: 'Ətraflı' },
      { name: 'update', key: 'courier.update', label: 'Düzəliş' },
    ],
  },
]

export const rolesMock: RoleMockItem[] = [
  {
    id: 1,
    name: 'Super Admin',
    scope: 'admin',
    description: 'Bütün səlahiyyətlərə malik əsas sistem inzibatçısı',
    permissions: [
      'users.index', 'users.show', 'users.create', 'users.update', 'users.delete',
      'roles.index', 'roles.show', 'roles.create', 'roles.update', 'roles.delete',
      'permissions.index', 'permissions.show', 'permissions.create',
      'staff.index', 'staff.show', 'staff.create', 'staff.update', 'staff.delete', 'staff.view',
      'role.index', 'role.create', 'role.update', 'role.delete', 'role.manage',
      'products.index', 'products.show', 'products.create', 'products.update', 'products.delete',
      'orders.index', 'orders.show', 'orders.update', 'orders.update_status',
      'sellers.index', 'sellers.show', 'sellers.approve',
      'courier.index', 'courier.show', 'courier.update',
    ],
    users_count: 2,
    created_at: '2026-01-01',
  },
  {
    id: 2,
    name: 'Katalog Meneceri',
    scope: 'admin',
    description: 'Məhsul, kateqoriya və brendlərin idarə olunması',
    permissions: [
      'products.index', 'products.show', 'products.create', 'products.update',
      'products.export', 'products.import',
    ],
    users_count: 3,
    created_at: '2026-01-05',
  },
  {
    id: 3,
    name: 'Sifariş Meneceri',
    scope: 'admin',
    description: 'Sifariş və çatdırılmaların izlənməsi',
    permissions: [
      'orders.index', 'orders.show', 'orders.update', 'orders.update_status',
    ],
    users_count: 4,
    created_at: '2026-01-10',
  },
  {
    id: 4,
    name: 'Dəstək Təmsilçisi',
    scope: 'admin',
    description: 'Müştəri müraciətləri və sorğularının cavablandırılması',
    permissions: [
      'users.index', 'users.show',
      'orders.index', 'orders.show',
    ],
    users_count: 5,
    created_at: '2026-01-15',
  },
  {
    id: 5,
    name: 'Maliyyə Meneceri',
    scope: 'admin',
    description: 'Hesabatlar və satıcı çıxarışlarının təsdiqi',
    permissions: [
      'orders.index', 'orders.show',
      'sellers.index', 'sellers.show',
    ],
    users_count: 2,
    created_at: '2026-02-01',
  },
  {
    id: 6,
    name: 'Satıcı Meneceri',
    scope: 'admin',
    description: 'Satıcıların qeydiyyatı və yoxlanışı',
    permissions: [
      'sellers.index', 'sellers.show', 'sellers.approve',
    ],
    users_count: 3,
    created_at: '2026-02-10',
  },
  {
    id: 7,
    name: 'Kuryer Koordinatoru',
    scope: 'admin',
    description: 'Kuryerlərin fəaliyyətinin tənzimlənməsi',
    permissions: [
      'courier.index', 'courier.show', 'courier.update',
      'orders.index', 'orders.show',
    ],
    users_count: 2,
    created_at: '2026-02-20',
  },
  {
    id: 8,
    name: 'Məzmun Redaktoru',
    scope: 'admin',
    description: 'Banner və bloq yazılarının idarə olunması',
    permissions: [
      'products.index', 'products.show',
    ],
    users_count: 1,
    created_at: '2026-03-01',
  },
  {
    id: 9,
    name: 'Audit və Təhlükəsizlik',
    scope: 'admin',
    description: 'Jurnal və fəaliyyət izləməsi',
    permissions: [
      'users.index', 'users.show',
      'roles.index', 'roles.show',
    ],
    users_count: 1,
    created_at: '2026-03-10',
  },
  {
    id: 10,
    name: 'Satıcı Mağaza Meneceri',
    scope: 'seller',
    description: 'Satıcının məhsul və sifariş idarəetməsi',
    permissions: [
      'products.index', 'products.show', 'products.create', 'products.update',
      'orders.index', 'orders.show', 'orders.update_status',
      'staff.index', 'staff.view',
    ],
    users_count: 8,
    created_at: '2026-03-15',
  },
  {
    id: 11,
    name: 'Satıcı Kassaçısı',
    scope: 'seller',
    description: 'Satış və POS əməliyyatları',
    permissions: [
      'products.index', 'products.show',
      'orders.index', 'orders.show',
    ],
    users_count: 12,
    created_at: '2026-03-20',
  },
  {
    id: 12,
    name: 'Satıcı Anbardarı',
    scope: 'seller',
    description: 'Məhsul ehtiyatı və qalıqların tənzimlənməsi',
    permissions: [
      'products.index', 'products.show', 'products.update',
    ],
    users_count: 6,
    created_at: '2026-04-01',
  },
]
