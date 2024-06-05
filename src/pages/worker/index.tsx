import { useState } from 'react'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { getDate } from '@/lib/get-date'
import {
  IconAdjustmentsHorizontal,
  IconPlayerPlay,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'

import { tasks } from './data'

// will change to data from backend job
const jobText = new Map<string, string>([
  ['all', 'All Jobs'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function Worker() {
  const [sort, setSort] = useState('ascending')
  const [jobType, setJobType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTasks = tasks
    .sort((a, b) =>
      sort === 'ascending'
        ? a.task.localeCompare(b.task)
        : b.task.localeCompare(a.task)
    )
    .filter((app) =>
      jobType === 'connected'
        ? app.connected
        : jobType === 'notConnected'
          ? !app.connected
          : true
    )
    .filter((app) => app.task.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}

      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Worker Jobs
            </h2>
            <p className='text-muted-foreground'>
              accept jobs that apply to your skill set
            </p>
          </div>
        </div>

        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter jobs...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className='w-36'>
                <SelectValue>{jobText.get(jobType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Apps</SelectItem>
                <SelectItem value='available'>Connected</SelectItem>
                <SelectItem value='notAvailable'>Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />

        <ul className='no-scrollbar grid gap-4 overflow-y-scroll pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredTasks.map((job: any) => (
            <li
              key={job.task}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                >
                  {job.logo}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={`${job.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {job.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{job.task}</h2>
                <p className='mb-2 line-clamp-2 text-gray-500'>{job.desc}</p>
              </div>
              <div className='text-sm text-gray-500'>
                <div className='flex'>
                  <h3 className='mr-2'>posted by:</h3>
                  <p>{job.postedBy}</p>
                </div>
                <div className='flex'>
                  <h3 className='mr-2 '>posted</h3>
                  <p className=''>{getDate(job.posted)}</p>
                </div>
                <div className='flex'>
                  <h3 className='mr-2 '>expires:</h3>
                  <p className=''>{getDate(job.expires)}</p>
                </div>
              </div>
              <Button className='text-md my-2' variant='outline'>
                Start ({job.price} nBTC)
                <IconPlayerPlay className='ml-2' />
              </Button>
            </li>
          ))}
        </ul>
      </LayoutBody>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
  },
]
