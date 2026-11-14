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
  MODULES: {
    LIST: `${ADMIN}/modules`,
    ITEM: (id: string) => `${ADMIN}/modules/${id}`,
    UPLOAD: `${ADMIN}/modules/upload`,
  },
} as const
