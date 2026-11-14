import { createFileRoute, redirect } from '@tanstack/react-router'
import { getPanelConfig, type Role } from '@/config/panels'
import { useAuthStore } from '@/features/auth/data/auth.store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()

    // Customer has no panel -> 403
    if (user?.role === 'customer') {
      throw redirect({
        to: '/403',
        replace: true,
      })
    }

    const role = (user?.role ?? user?.roles?.[0]?.name ?? 'admin') as Role
    const config = getPanelConfig(role)
    const target = config?.landing ?? '/admin'

    throw redirect({
      to: target,
      replace: true,
    })
  },
})
