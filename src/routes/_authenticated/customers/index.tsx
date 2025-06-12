import { createFileRoute } from '@tanstack/react-router'
import  Customers from '@/features/customers'

export const Route = createFileRoute('/_authenticated/customers/')({
  component: Customers,
})