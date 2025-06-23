import { createFileRoute } from '@tanstack/react-router'
import Chats from '@/features/chats'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/chats/')({
  component: () => (
    <ProtectedRoute requiredService="chats">
      <Chats />
    </ProtectedRoute>
  ),
})
