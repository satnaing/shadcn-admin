import { createFileRoute } from '@tanstack/react-router'
import { Teams } from '@/features/teams'

export const Route = createFileRoute('/_authenticated/teams/')({
  component: Teams,
})
