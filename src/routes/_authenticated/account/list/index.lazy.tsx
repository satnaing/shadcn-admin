import { createLazyFileRoute } from '@tanstack/react-router'
import AccountList from '@/features/account/list'

export const Route = createLazyFileRoute('/_authenticated/account/list/')({
  component: AccountList,
}) 