import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsers } from './hooks/use-users-query'
import { Skeleton } from '@/components/ui/skeleton'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch users from API
  const { data, isLoading, error } = useUsers({
    skip: 0,
    limit: 1000, // Fetch all for client-side filtering (can optimize later)
  })

  return (
    <UsersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-[400px] w-full' />
          </div>
        ) : error ? (
          <div className='flex h-[400px] items-center justify-center rounded-md border border-destructive bg-destructive/10'>
            <div className='text-center'>
              <p className='text-destructive font-semibold'>
                Failed to load users
              </p>
              <p className='text-muted-foreground text-sm mt-2'>
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          </div>
        ) : (
          <UsersTable
            data={data?.users || []}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
