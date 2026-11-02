import { createFileRoute } from '@tanstack/react-router'
import { PopupsPage } from '@/features/marketing/popups'

export const Route = createFileRoute('/_authenticated/admin/marketing/popups')({
  component: PopupsPage,
})
