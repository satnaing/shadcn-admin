import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { Link, Outlet, useSearchParams } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/route'
import { columns } from './components/users-columns'
import { UsersTable } from './components/users-table'
import {
  FilterSchema,
  PaginationSchema,
  QuerySchema,
  SortSchema,
} from './hooks/use-data-table-state'
import { getFacetedCounts, listFilteredUsers } from './queries.server'

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams)

  const { username } = QuerySchema.parse({
    username: searchParams.get('username'),
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

  const { pagination, data: users } = listFilteredUsers({
    username,
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
  })

  const facetedCounts = getFacetedCounts({
    facets: ['status', 'role'],
    username,
    filters,
  })

  return { users, pagination, facetedCounts }
}

export default function Users({
  loaderData: { users, pagination, facetedCounts },
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
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="space-x-1" asChild>
              <Link to={`/users/invite?${searchParams.toString()}`}>
                <span>Invite User</span> <IconMailPlus size={18} />
              </Link>
            </Button>
            <Button className="space-x-1" asChild>
              <Link to={`/users/add?${searchParams.toString()}`}>
                <span>Add User</span> <IconUserPlus size={18} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <UsersTable
            data={users}
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
