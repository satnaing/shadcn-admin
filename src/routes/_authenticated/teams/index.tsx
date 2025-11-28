import { createFileRoute } from '@tanstack/react-router'
import { TeamsPage } from '@/features/teams'

export const Route = createFileRoute('/_authenticated/teams/')({
  component: TeamsPage,
})
