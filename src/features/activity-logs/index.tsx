import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columns } from './components/activity-logs-columns'
import { ActivityLogsExportButton } from './components/activity-logs-export-button'
import { ActivityLogsTable } from './components/activity-logs-table'
import { ActivityLogsTimeline } from './components/activity-logs-timeline'
import { activityLogs } from './data/activity-logs'
import { activityLogListSchema } from './data/schema'

export default function ActivityLogs() {
  // Parse activity log list
  const logList = activityLogListSchema.parse(activityLogs)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Activity Logs</h2>
            <p className='text-muted-foreground'>
              Track all user actions and system events in real-time.
            </p>
          </div>
          <ActivityLogsExportButton data={logList} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <Tabs defaultValue='table' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='table'>Table View</TabsTrigger>
              <TabsTrigger value='timeline'>Timeline View</TabsTrigger>
            </TabsList>
            <TabsContent value='table' className='space-y-4'>
              <ActivityLogsTable data={logList} columns={columns} />
            </TabsContent>
            <TabsContent value='timeline' className='space-y-4'>
              <ActivityLogsTimeline data={logList} />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}
