import { createFileRoute } from '@tanstack/react-router'
import ActivityLogs from '@/features/activity-logs'

export const Route = createFileRoute('/_authenticated/activity-logs/')({
  component: ActivityLogs,
})
