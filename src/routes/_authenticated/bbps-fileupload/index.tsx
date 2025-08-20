 import { createFileRoute } from '@tanstack/react-router'
 import Bbps_Fileupload from '@/features/bbps_fileupload'
 import { ProtectedRoute } from '@/components/ProtectedRoute'
 
 export const Route = createFileRoute('/_authenticated/bbps-fileupload/')({
   component: () => (
     <ProtectedRoute requiredService="bbps-fileupload">
       <Bbps_Fileupload />
     </ProtectedRoute>
   ),
 })