import { createFileRoute } from '@tanstack/react-router'
import { Tools } from '@/features/tools'

export const Route = createFileRoute('/tools/')({
  component: Tools,
})
