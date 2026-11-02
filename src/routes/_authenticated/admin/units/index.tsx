import { createFileRoute } from '@tanstack/react-router'
import { UnitsPage } from '@/features/units'

export const Route = createFileRoute('/_authenticated/admin/units/')({
  component: UnitsPage,
})
