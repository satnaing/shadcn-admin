import { parseWithZod } from '@conform-to/zod'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { data, Link, Outlet } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import { tasks as initialTasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export const loader = () => {
  return { tasks: initialTasks }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: z.object({
      id: z.string(),
      label: z.string(),
    }),
  })
  if (submission.status !== 'success') {
    throw data(null, { status: 400 })
  }

  // update the task label
  const task = initialTasks.find((task) => task.id === submission.value.id)
  if (!task) {
    throw data(null, { status: 404 })
  }
  task.label = submission.value.label

  return dataWithSuccess(null, {
    message: 'Task label updated successfully!',
    description: `The task ${submission.value.id} has been updated with the label ${submission.value.label}.`,
  })
}

export default function Tasks({ loaderData: { tasks } }: Route.ComponentProps) {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header sticky>
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
          <DataTable data={tasks} columns={columns} />
        </div>
        <Outlet />
      </Main>
    </>
  )
}
