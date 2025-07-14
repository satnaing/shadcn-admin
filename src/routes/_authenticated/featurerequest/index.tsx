import { createFileRoute } from '@tanstack/react-router'
import Apps from '@/features/featurerequest'

export const Route = createFileRoute('/_authenticated/featurerequest/')({
  component: Apps,
})
