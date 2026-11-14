import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/features/auth/data/auth.store'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState()

    if (!accessToken) {
      if (import.meta.env.DEV) {
        useAuthStore.getState().setRole('admin')
        return
      }
      throw redirect({
        to: '/sign-in',
        replace: true,
      })
    }
  },
})
