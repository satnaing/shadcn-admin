import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Link, Outlet } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import { tasks as initialTasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'
import { columns } from './components/columns'
import {
  DataTable,
  PaginationSearchParamsSchema,
} from './components/data-table'

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams)
  const { page: currentPage, per_page: pageSize } =
    PaginationSearchParamsSchema.parse({
      page: searchParams.get('page'),
      per_page: searchParams.get('per_page'),
    })

  // slice the tasks based on the current page and page size
  const tasks = initialTasks.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize,
  )
  const totalPages = Math.ceil(initialTasks.length / pageSize)
  const totalItems = initialTasks.length

  return {
    tasks,
    pagination: { currentPage, pageSize, totalPages, totalItems },
  }
}

export default function Tasks({
  loaderData: { tasks, pagination },
}: Route.ComponentProps) {
  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="space-x-1" asChild>
              <Link to="/tasks/import">
                <span>Import</span> <IconDownload size={18} />
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link to="/tasks/create">
                <span>Create</span> <IconPlus size={18} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable data={tasks} columns={columns} pagination={pagination} />
        </div>
        <Outlet />
      </Main>
    </>
  )
}
