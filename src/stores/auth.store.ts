import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'

interface IAuthStore {
  session: Session | null
  setSession: (session: Session | null) => void
  isSessionLoaded: boolean
  setIsSessionLoaded: (value: boolean) => void
}

export const useAuthStore = create<IAuthStore>((set) => ({
  session: null,
  setSession: (session: Session | null) =>
    set({ session, isSessionLoaded: true }),
  isSessionLoaded: false,
  setIsSessionLoaded: (value: boolean) => set({ isSessionLoaded: value }),
}))
