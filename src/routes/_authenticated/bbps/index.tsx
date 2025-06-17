 import { createFileRoute } from '@tanstack/react-router'
 import BBPS from '@/features/bbps'
 
 export const Route = createFileRoute('/_authenticated/bbps/')({
   component: BBPS,
 })