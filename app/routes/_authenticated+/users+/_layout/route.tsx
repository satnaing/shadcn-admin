import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import useDialogState from '~/hooks/use-dialog-state'
import { UsersActionDialog } from '../_shared/components/users-action-dialog'
import type { User } from '../_shared/data/schema'
import { users as initialUsers } from '../_shared/data/users'
import type { Route } from './+types/route'
import { columns } from './components/users-columns'
import { UsersTable } from './components/users-table'
import UsersContextProvider, {
  type UsersDialogType,
} from './context/users-context'

export const loader = () => {
  return { users: initialUsers }
}

export default function Users({ loaderData: { users } }: Route.ComponentProps) {
  // Dialog states
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [open, setOpen] = useDialogState<UsersDialogType>(null)

  // Parse user list

  return (
    <UsersContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {/* ===== Top Heading ===== */}
      <Header sticky>
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

      {currentRow && (
        <UsersActionDialog
          key={`user-edit-${currentRow.id}`}
          open={open === 'edit'}
          onOpenChange={() => {
            setOpen('edit')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
    </UsersContextProvider>
  )
}
