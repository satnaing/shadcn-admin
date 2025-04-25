import FollowerCollectPage from '@/features/task/follower-collect'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/task/follower-collect/')({
  component: FollowerCollectPage,
})
