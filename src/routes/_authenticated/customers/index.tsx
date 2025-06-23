import { createFileRoute } from '@tanstack/react-router'
import  Customers from '@/features/customers'
//import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/customers/')({
  // component: () => (
  //   <ProtectedRoute requiredService="Customers">
  //     <Customers />
  //   </ProtectedRoute>
  // ),
  component: Customers
})