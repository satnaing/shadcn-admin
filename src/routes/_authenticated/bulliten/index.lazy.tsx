import { createLazyFileRoute } from '@tanstack/react-router'
import Bulliten from '@/features/bulliten'

export const Route = createLazyFileRoute('/_authenticated/bulliten/')({
  component: Bulliten,
})
