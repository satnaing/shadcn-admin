import { createFileRoute } from '@tanstack/react-router'
import { ShiftPage } from '@/features/operations/shift/shift-page'

export const Route = createFileRoute('/_authenticated/ops/session')({
  component: ShiftPage,
})
