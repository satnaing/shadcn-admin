import { createFileRoute } from '@tanstack/react-router'
import DrawPage from '@/features/draw'

export const Route = createFileRoute('/_authenticated/draw/')({
  component: DrawPage,
})