import { createFileRoute } from '@tanstack/react-router'
import { AppPlaza } from '@/features/app-plaza'

export const Route = createFileRoute('/_authenticated/app-plaza/')({
  component: AppPlaza,
})
