import { createLazyFileRoute } from '@tanstack/react-router'
import AccountGroups from '@/features/account/groups'

export const Route = createLazyFileRoute('/_authenticated/account/groups/')({
  component: AccountGroups,
})
