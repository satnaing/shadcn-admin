import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { AccountListDialogs } from './components/account-list-dialogs'
import { AccountListPrimaryButtons } from './components/account-list-primary-buttons'
import AccountListProvider from './context/account-list-context'
import { columns } from './components/account-list-columns'
import { accountService } from '@/services/account-services'
import { DataTableToolbar } from './components/data-table-toolbar'
import { DataTable } from '@/components/data-table'
import { Account } from './data/schema'

// 账号列表主组件
export default function AccountList() {
  return (
    <AccountListProvider>
      <Header fixed hideSpacer>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>账号管理</h2>
            <p className='text-muted-foreground'>
              管理TikTok账号。
            </p>
          </div>
          <AccountListPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable<Account> columns={columns} service={accountService} Toolbar={DataTableToolbar} />
        </div>
      </Main>

      <AccountListDialogs />
    </AccountListProvider>
  )
} 