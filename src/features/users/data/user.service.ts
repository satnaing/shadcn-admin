import { authApi } from '@/api'
import type { CurrentUserApiResponse } from './users.type'

export const userService = {
  currentUser: (): Promise<CurrentUserApiResponse> => authApi.getCurrentUser(),
}
