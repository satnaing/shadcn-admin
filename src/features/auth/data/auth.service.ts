import { authApi } from '@/api'
import type {
  LoginInterface,
  RegisterInterface,
} from './auth.type'

export const authService = {
  login: (data: LoginInterface) => {
    return authApi.login(data)
  },

  register: (data: RegisterInterface) => {
    return authApi.register(data)
  },

  logout: () => {
    return authApi.logout()
  },

  refreshToken: () => {
    return authApi.refresh()
  },
}
