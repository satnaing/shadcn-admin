import FriendListPage from '@/features/tiktok/friend'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tiktok/friend/')({
  component: FriendListPage,
})
