import { createFileRoute } from '@tanstack/react-router'
import ConnectedAccountsPage from '@/features/connected-accounts'

export const Route = createFileRoute('/connected-accounts/')({
  component: ConnectedAccountsPage,
})
