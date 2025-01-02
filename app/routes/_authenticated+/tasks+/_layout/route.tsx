import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Link, Outlet } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/route'
import { columns } from './components/columns'
import {
  DataTable,
  FilterSearchParamsSchema,
  PaginationSearchParamsSchema,
} from './components/data-table'
import { getFacetedCounts, listFilteredTasks } from './queries.server'

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams)
  const {
    page: currentPage,
    per_page: pageSize,
    ...filters
  } = FilterSearchParamsSchema.merge(PaginationSearchParamsSchema).parse({
    page: searchParams.get('page'),
    per_page: searchParams.get('per_page'),
    status: searchParams.getAll('status'),
    priority: searchParams.getAll('priority'),
  })

  // listFilteredTasks is a server-side function that fetch tasks from the database
  const { data: tasks, pagination } = listFilteredTasks(
    filters,
    currentPage,
    pageSize,
  )

  // getFacetedCounts is a server-side function that fetches the counts of each filter
  const facetedCounts = getFacetedCounts(['status', 'priority'], filters)

  return {
    tasks,
    pagination,
    facetedCounts,
  }
}

export default function Tasks({
  loaderData: { tasks, pagination, facetedCounts },
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
          <DataTable
            data={tasks}
            columns={columns}
            pagination={pagination}
            facetedCounts={facetedCounts}
          />
        </div>
        <Outlet />
      </Main>
    </>
  )
}
