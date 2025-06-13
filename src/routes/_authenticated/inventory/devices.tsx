import { createFileRoute } from '@tanstack/react-router'
import Devices from '@/features/devices'

export const Route = createFileRoute('/_authenticated/inventory/devices')({
  component: Devices,
})
