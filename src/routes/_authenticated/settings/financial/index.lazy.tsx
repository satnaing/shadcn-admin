import { createLazyFileRoute } from '@tanstack/react-router'
import FinancialSettingsPage from '@/features/settings/financial'

export const Route = createLazyFileRoute('/_authenticated/settings/financial/')({
  component: FinancialSettingsPage,
})
