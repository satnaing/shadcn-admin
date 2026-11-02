import { createFileRoute } from '@tanstack/react-router'
import { AttributesPage } from '@/features/attributes'

export const Route = createFileRoute('/_authenticated/admin/attributes/')({
  component: AttributesPage,
})
