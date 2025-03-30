import { createLazyFileRoute } from '@tanstack/react-router'
import Companies from '@/features/companies'

export const Route = createLazyFileRoute('/_authenticated/companies/')({
  component: Companies,
})
