import { createFileRoute, redirect } from '@tanstack/react-router'
import supabase from '@/utils/supabase/client'

export const Route = createFileRoute('/(auth)/sign-out')({
  loader: async () => {
    supabase.auth.signOut()
    return redirect({ to: '/' })
  },
})
