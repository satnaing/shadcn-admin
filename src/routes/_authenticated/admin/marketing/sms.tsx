import { createFileRoute } from '@tanstack/react-router'
import { BulkSmsPage } from '@/features/marketing/sms'

export const Route = createFileRoute('/_authenticated/admin/marketing/sms')({
  component: BulkSmsPage,
})
