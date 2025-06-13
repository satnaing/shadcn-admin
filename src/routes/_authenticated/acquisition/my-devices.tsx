import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/coming-soon.tsx'

export const Route = createFileRoute('/_authenticated/acquisition/my-devices')({
  component: ComingSoon,
})


