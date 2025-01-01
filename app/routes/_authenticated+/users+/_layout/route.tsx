import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { Link, Outlet } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import { users as initialUsers } from '../_shared/data/users'
import type { Route } from './+types/route'
import { columns } from './components/users-columns'
import { UsersTable } from './components/users-table'

export const loader = () => {
  return { users: initialUsers }
}

export default function Users({ loaderData: { users } }: Route.ComponentProps) {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="space-x-1" asChild>
              <Link to="/users/invite">
                <span>Invite User</span> <IconMailPlus size={18} />
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link to="/users/add">
                <span>Add User</span> <IconUserPlus size={18} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <UsersTable data={users} columns={columns} />
        </div>

        <Outlet />
      </Main>
    </>
  )
}
