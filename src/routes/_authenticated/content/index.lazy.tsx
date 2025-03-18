import { createLazyFileRoute } from '@tanstack/react-router'
import Content from '@/features/content'

export const Route = createLazyFileRoute('/_authenticated/content/')({
  component: Content,
})
