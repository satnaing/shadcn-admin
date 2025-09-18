import { getRouteApi } from '@tanstack/react-router'
import { Page } from '@/components/page'
import { OutreachProvider } from './components/outreach-provider'
import { OutreachTable } from './components/outreach-table'
import { OutreachTimelineSheet } from './components/outreach-timeline-sheet'
import { useGetCampaignContactsQuery } from './graphql/operations.generated'

const route = getRouteApi('/outreach/')

export default function OutreachFeature() {
  const search = route.useSearch()

  // Calculate pagination offset
  const offset = ((search.page || 1) - 1) * (search.pageSize || 20)

  // Build filters from URL params
  const filters = {
    ...(search.status && { status: search.status }),
    ...(search.senderId && { senderId: search.senderId }),
    ...(search.filter && { searchTerm: search.filter }),
  }

  const { data, loading } = useGetCampaignContactsQuery({
    variables: {
      page: {
        offset,
        limit: search.pageSize || 20,
      },
      ...(Object.keys(filters).length > 0 && { filters }),
    },
  })

  const outreachData = data?.campaignContacts?.data || []
  const totalCount = data?.campaignContacts?.totalCount ?? 0

  return (
    <OutreachProvider>
      <Page title='Outreach' description='View and manage contacts being outreached to'>
        <OutreachTable data={outreachData} totalCount={totalCount} isLoading={loading} />
        <OutreachTimelineSheet />
      </Page>
    </OutreachProvider>
  )
}
