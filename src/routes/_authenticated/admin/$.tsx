import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

// Module-declared screens (POS, wholesale…) have no UI in admin2 yet.
export const Route = createFileRoute('/_authenticated/admin/$')({
  component: ComingSoon,
})
