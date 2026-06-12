import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function useUsersData() {
  const { t } = useTranslation()

  const roles = [
    {
      label: t('users.role_superadmin'),
      value: 'superadmin',
      icon: Shield,
    },
    {
      label: t('users.role_admin'),
      value: 'admin',
      icon: UserCheck,
    },
    {
      label: t('users.role_manager'),
      value: 'manager',
      icon: Users,
    },
    {
      label: t('users.role_cashier'),
      value: 'cashier',
      icon: CreditCard,
    },
  ] as const

  const statusOptions = [
    { label: t('users.status_active'), value: 'active' },
    { label: t('users.status_inactive'), value: 'inactive' },
    { label: t('users.status_invited'), value: 'invited' },
    { label: t('users.status_suspended'), value: 'suspended' },
  ]

  return { roles, statusOptions }
}
