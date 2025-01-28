import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/route'
import { DataTable } from './components/data-table'
import { SearchParamsQuery, columns } from './config'
import { getFacetedCounts, listFilteredTasks } from './queries.server'

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams)

  const {
    title,
    status,
    priority,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    per_page: perPage,
  } = SearchParamsQuery.parse({
    title: searchParams.get('title'),
    status: searchParams.getAll('status'),
    priority: searchParams.getAll('priority'),
    sort_by: searchParams.get('sort_by'),
    sort_order: searchParams.get('sort_order'),
    page: searchParams.get('page'),
    per_page: searchParams.get('per_page'),
  })

  // listFilteredTasks is a server-side function that fetch tasks from the database
  const { data: tasks, pagination } = listFilteredTasks({
    title,
    filters: { status, priority },
    page,
    perPage,
    sortBy,
    sortOrder,
  })

  // getFacetedCounts is a server-side function that fetches the counts of each filter
  const facetedCounts = getFacetedCounts({
    facets: ['status', 'priority'],
    title,
    filters: { status, priority },
  })

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
    <div>
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

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <DataTable
          data={tasks}
          columns={columns}
          pagination={pagination}
          facetedCounts={facetedCounts}
        />
      </div>
    </div>
  )
}
