import { createFileRoute } from '@tanstack/react-router'
import MapPage from '@/features/map'

export const Route = createFileRoute('/_authenticated/map/')({
  component: MapPage,
})