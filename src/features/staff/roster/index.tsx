import { useAppStore } from '@/hooks/use-app-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageTitle } from '@/components/page-title'
import { RosterCalendar } from '@/features/staff/_components/roster-calendar'
import { TeamList } from '@/features/staff/_components/team-list'

export default function RosterPage() {
  const shopId = useAppStore((state) => state.activeShopId)

  if (!shopId)
    return <div className='p-6'>Please select a shop to view the roster.</div>

  return (
    <div className='space-y-6 p-6'>
      <PageTitle
        title='Team & Roster'
        subtitle='Manage shift schedules and team members for this location.'
      />

      <Tabs defaultValue='team'>
        <TabsList>
          <TabsTrigger value='team'>Team List</TabsTrigger>
          <TabsTrigger value='schedule'>Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value='team' className='mt-6'>
          <TeamList shopId={shopId} />
        </TabsContent>
        <TabsContent value='schedule' className='mt-6'>
          <RosterCalendar shopId={shopId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
