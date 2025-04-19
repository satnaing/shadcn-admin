import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { AccountListTable } from './components/account-list-table'
import { AccountListDialogs } from './components/account-list-dialogs'
import { AccountListPrimaryButtons } from './components/account-list-primary-buttons'
import AccountListProvider from './context/account-list-context'

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
            <h2 className='text-2xl font-bold tracking-tight'>账号列表</h2>
            <p className='text-muted-foreground'>
              管理抖音/TikTok账号，支持分组、导入等功能。
            </p>
          </div>
          <AccountListPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <AccountListTable />
        </div>
      </Main>

      <AccountListDialogs />
    </AccountListProvider>
  )
} 