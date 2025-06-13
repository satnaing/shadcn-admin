 import { createFileRoute } from '@tanstack/react-router'
 import BBPS from '@/features/BBPS'
 
 export const Route = createFileRoute('/_authenticated/bbps/')({
   component: BBPS,
 })
