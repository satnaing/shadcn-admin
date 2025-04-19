import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { AccountGroupsDialogs } from './components/account-groups-dialogs'
import { AccountGroupsPrimaryButtons } from './components/account-groups-primary-buttons'
import { AccountGroupsTable } from './components/account-groups-table'
import AccountGroupsProvider from './context/account-groups-context'

export default function AccountGroups() {
  
  return (
    <AccountGroupsProvider>
      <Header fixed hideSpacer>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>账号分组</h2>
            <p className='text-muted-foreground'>
              账号分组管理。
            </p>
          </div>
          <AccountGroupsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <AccountGroupsTable/>
        </div>
      </Main>

      <AccountGroupsDialogs />
    </AccountGroupsProvider>
  )
} 