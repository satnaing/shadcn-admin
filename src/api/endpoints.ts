/** URL constants. `VITE_BASE_URL` (`/api/v1`) is the baseURL — paths only here. */
const ADMIN = '/admin'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  MENU: `${ADMIN}/menu`,
  PAGES: {
    LIST: `${ADMIN}/pages`,
    ITEM: (id: number | string) => `${ADMIN}/pages/${id}`,
    DRAFT: (id: number | string) => `${ADMIN}/pages/${id}/draft`,
    PUBLISH: (id: number | string) => `${ADMIN}/pages/${id}/publish`,
    REVISIONS: (id: number | string) => `${ADMIN}/pages/${id}/revisions`,
    RESTORE: (id: number | string, rev: number) => `${ADMIN}/pages/${id}/revisions/${rev}/restore`,
    PREVIEW_TOKEN: (id: number | string) => `${ADMIN}/pages/${id}/preview-token`,
    TEMPLATES: `${ADMIN}/page-templates`,
    SECTION_CATALOG: `${ADMIN}/themes/active/sections`,
  },
  DASHBOARD: `${ADMIN}/dashboard`,
  ROLES: {
    LIST: `${ADMIN}/roles`,
    ITEM: (id: number | string) => `${ADMIN}/roles/${id}`,
  },
  LANGUAGES: {
    LIST: `${ADMIN}/languages`,
    ITEM: (id: number | string) => `${ADMIN}/languages/${id}`,
  },
  CURRENCIES: {
    LIST: `${ADMIN}/currencies`,
    ITEM: (id: number | string) => `${ADMIN}/currencies/${id}`,
  },
  SETTINGS: (group: string) => `${ADMIN}/settings/${group}`,
  THEMES: {
    LIST: `${ADMIN}/themes`,
    COMPATIBILITY: (id: string) => `${ADMIN}/themes/${id}/compatibility`,
    ACTIVATE: (id: string) => `${ADMIN}/themes/${id}/activate`,
    SETTINGS: (block: string) => `${ADMIN}/themes/settings/${block}`,
    MENUS: `${ADMIN}/themes/menus`,
    MENU: (location: string) => `${ADMIN}/themes/menus/${location}`,
    BANNERS: `${ADMIN}/themes/banners`,
    BANNER: (id: number | string) => `${ADMIN}/themes/banners/${id}`,
    BANNER_TOGGLE: (id: number | string) => `${ADMIN}/themes/banners/${id}/toggle`,
    BANNER_REORDER: `${ADMIN}/themes/banners/reorder`,
    BANNER_GROUP: (group: string) => `${ADMIN}/themes/banner-groups/${group}`,
  },
  MODULES: {
    LIST: `${ADMIN}/modules`,
    ITEM: (id: string) => `${ADMIN}/modules/${id}`,
    UPLOAD: `${ADMIN}/modules/upload`,
    BATCH: `${ADMIN}/modules/batch`,
    UPDATE: (id: string) => `${ADMIN}/modules/${id}/update`,
  },
  BLOGS: {
    LIST: `${ADMIN}/blogs`,
    ITEM: (id: number | string) => `${ADMIN}/blogs/${id}`,
    CATEGORIES: `${ADMIN}/blog-categories`,
    CATEGORY: (id: number | string) => `${ADMIN}/blog-categories/${id}`,
  },
} as const
