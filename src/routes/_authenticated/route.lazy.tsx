import { createLazyFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createLazyFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})
