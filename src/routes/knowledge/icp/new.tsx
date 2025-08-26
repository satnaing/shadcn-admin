import { createFileRoute } from '@tanstack/react-router'
import ICPProfilePage from '@/features/knowledge/icp/profile'

export const Route = createFileRoute('/knowledge/icp/new')({
  component: () => <ICPProfilePage />,
})
