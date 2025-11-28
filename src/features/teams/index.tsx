import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TeamsTable } from './components/teams-table'
import { TeamsPrimaryButtons } from './components/teams-primary-buttons'
import { TeamsProvider } from './components/teams-provider'

export function Teams() {
  return (
    <TeamsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Teams</h2>
            <p className='text-muted-foreground'>
              Manage your teams and team members
            </p>
          </div>
          <TeamsPrimaryButtons />
        </div>
        <TeamsTable />
      </Main>
    </TeamsProvider>
  )
}
