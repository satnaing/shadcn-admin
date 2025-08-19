 import { createFileRoute } from '@tanstack/react-router'
 import Upi_Analytics from '@/features/UPI_Analytics'
 import { ProtectedRoute } from '@/components/ProtectedRoute'
 
 export const Route = createFileRoute('/_authenticated/upi_analytics/')({
   component: () => (
     <ProtectedRoute requiredService="upi-analytics">
       <Upi_Analytics />
     </ProtectedRoute>
   ),
 })