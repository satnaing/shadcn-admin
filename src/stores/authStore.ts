import { authService } from '@/services/auth.service';
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
    const user = await authService.getUserInfo()
    set((state) => ({ ...state, auth: { ...state.auth, user } }))
  };

  initUser();

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      reset: () =>
        set((state) => {
          return {
            ...state,
            auth: { ...state.auth, user: null },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
