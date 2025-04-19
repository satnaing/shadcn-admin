import { authService } from '@/services/auth-service';
import { create } from 'zustand'

export interface AuthUser {
  id: number;
  username: string;
  nickname: string | null;
  avatar: string | null;
  lastLoginTime: string | null;
}

export interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {

  const initUser = async () => {
    authService.getUserInfo().then((user) => {
      localStorage.setItem('user', JSON.stringify(user))
      set((state) => ({ ...state, auth: { ...state.auth, user } }))
    }).catch((error) => {
      console.error('获取用户信息失败:', error)
      localStorage.removeItem('user')
      set((state) => ({ ...state, auth: { ...state.auth, user: null } }))
    })
  };

  initUser();

  const localUser = localStorage.getItem('user')
  const user: AuthUser | null = localUser ? JSON.parse(localUser) : null

  return {
    auth: {
      user: user,
      setUser: (user) => {
        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      reset: () =>
        set((state) => {
          localStorage.removeItem('user')
          return {
            ...state,
            auth: { ...state.auth, user: null },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
