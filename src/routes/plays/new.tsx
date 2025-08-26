import { createFileRoute } from '@tanstack/react-router'
import PlaybookNewPage from '@/features/plays/new'

export const Route = createFileRoute('/plays/new')({
  component: PlaybookNewPage,
})
