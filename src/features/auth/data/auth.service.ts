import { requestInstanceClient } from '@/config/api'
import type {
  AuthLoginResponseType,
  LoginInterface,
  RegisterInterface,
} from './auth.type'

export const authService = {
  login: (data: LoginInterface) => {
    return requestInstanceClient.post<AuthLoginResponseType, LoginInterface>(
      '/auth/login',
      data
    )
  },

  register: (data: RegisterInterface) => {
    return requestInstanceClient.post<unknown, RegisterInterface>(
      '/auth/register',
      data
    )
  },

  logout: () => {
    return requestInstanceClient.delete('/auth/logout')
  },

  refreshToken: () => {
    return requestInstanceClient.put<AuthLoginResponseType, unknown>(
      '/auth/refresh',
      {}
    )
  },
}
