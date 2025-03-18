import { createLazyFileRoute } from '@tanstack/react-router'
import RefereceData from '@/features/referencedata'

export const Route = createLazyFileRoute('/_authenticated/referencedata/')({
  component: RefereceData,
})


