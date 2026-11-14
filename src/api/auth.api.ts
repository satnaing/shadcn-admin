import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse } from '@/api/types'
import type {
  AuthLoginResponseType,
  LoginInterface,
  RegisterInterface,
} from '@/features/auth/data/auth.type'
import type { CurrentUserApiResponse } from '@/features/users/data/users.type'

export const authApi = {
  login: (credentials: LoginInterface) =>
    api.post<AuthLoginResponseType, LoginInterface>(ENDPOINTS.AUTH.LOGIN, credentials),
  register: (data: RegisterInterface) =>
    api.post<AuthLoginResponseType, RegisterInterface>(ENDPOINTS.AUTH.REGISTER, data),
  logout: () => api.post<ApiMessageResponse>(ENDPOINTS.AUTH.LOGOUT),
  refresh: () => api.put<AuthLoginResponseType, unknown>(ENDPOINTS.AUTH.REFRESH, {}),
  getCurrentUser: () => api.get<CurrentUserApiResponse>(ENDPOINTS.AUTH.ME),
}
