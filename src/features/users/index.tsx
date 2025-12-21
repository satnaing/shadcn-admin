import { Main } from '@/components/layout/main'
import { useUsers } from '@/hooks/use-users'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

export function Users() {
  const { data: users = [], isLoading } = useUsers()

  if (isLoading) {
    return (
      <Main>
        <div className="flex items-center justify-center h-32">
          Loading...
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage your users and their roles.
          </p>
        </div>
        <DataTable columns={columns} data={users} />
      </div>
    </Main>
  )
}