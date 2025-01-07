import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Link, Outlet, useSearchParams } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/route'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import {
  FilterSchema,
  PaginationSchema,
  QuerySchema,
  SortSchema,
} from './hooks/use-data-table-state'
import { getFacetedCounts, listFilteredTasks } from './queries.server'

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams)

  const { title } = QuerySchema.parse({
    title: searchParams.get('title'),
  })

  const { ...filters } = FilterSchema.parse({
    status: searchParams.getAll('status'),
    priority: searchParams.getAll('priority'),
  })

  const { sort_by: sortBy, sort_order: sortOrder } = SortSchema.parse({
    sort_by: searchParams.get('sort_by'),
    sort_order: searchParams.get('sort_order'),
  })

  const { page: currentPage, per_page: pageSize } = PaginationSchema.parse({
    page: searchParams.get('page'),
    per_page: searchParams.get('per_page'),
  })

  // listFilteredTasks is a server-side function that fetch tasks from the database
  const { data: tasks, pagination } = listFilteredTasks({
    title,
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
  })

  // getFacetedCounts is a server-side function that fetches the counts of each filter
  const facetedCounts = getFacetedCounts({
    facets: ['status', 'priority'],
    title,
    filters,
  })

  return {
    tasks,
    pagination,
    sortBy,
    sortOrder,
    facetedCounts,
  }
}

export default function Tasks({
  loaderData: { tasks, pagination, facetedCounts },
}: Route.ComponentProps) {
  const [searchParams] = useSearchParams()

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
              <Link to={`/tasks/import?${searchParams.toString()}`}>
                <span>Import</span> <IconDownload size={18} />
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link to={`/tasks/create?${searchParams.toString()}`}>
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
