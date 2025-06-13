import { createFileRoute } from '@tanstack/react-router'
import UPI from '@/features/UPI'

export const Route = createFileRoute('/_authenticated/upi/')({
  component: UPI,
})