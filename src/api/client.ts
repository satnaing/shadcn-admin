/**
 * API klienti. Axios instance, auth header-ləri, 401 logout və mock adapter
 * `@/config/interceptor` + `@/config/api`-da hazırdır — burada yenisi qurulmur,
 * yalnız `src/api` qatı üçün vahid giriş nöqtəsi kimi ixrac olunur.
 */
export { requestInstanceClient as apiClient, api } from '@/config/api'
export { instance as axiosInstance, buildAuthHeaders } from '@/config/interceptor'
