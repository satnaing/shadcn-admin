import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Page } from '@/components/page'
import { ExecutionsDialogs } from './components/executions-dialogs'
import { ExecutionsProvider } from './components/executions-provider'
import { ExecutionsTable } from './components/executions-table'
import {
  ExecutionsDocument,
  usePlaybooksForFilterQuery,
  useScenariosForFilterQuery,
} from './graphql/operations.generated'

const route = getRouteApi('/activity/')

export function Activity() {
  const search = route.useSearch()

  // Calculate pagination offset
  const offset = ((search.page || 1) - 1) * (search.pageSize || 20)

  // Build filters from URL params
  const filters = {
    ...(search.status && { status: search.status }),
    ...(search.type && { type: search.type }),
    ...(search.playbookId && { playbookId: search.playbookId }),
    ...(search.scenarioId && { scenarioId: search.scenarioId }),
  }

  // Fetch executions with filters
  const {
    data: executionsData,
    loading: executionsLoading,
    previousData,
  } = useQuery(ExecutionsDocument, {
    variables: {
      page: {
        offset,
        limit: search.pageSize || 20,
      },
      ...(Object.keys(filters).length > 0 && { filters }),
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  // Use previous data while loading to prevent skeleton flash
  const currentData = executionsData || previousData

  // Fetch playbooks for filtering
  const { data: playbooksData } = usePlaybooksForFilterQuery()
  const { data: scenariosData } = useScenariosForFilterQuery()

  const executions = currentData?.executions.data || []
  const totalCount = currentData?.executions.totalCount || 0
  const playbooks = playbooksData?.playbooks || []
  const scenarios = scenariosData?.playbookScenarios || []

  return (
    <ExecutionsProvider>
      <Page title='Activity' description='View and manage agent activity'>
        <div className='space-y-4'>
          {!currentData && executionsLoading ? (
            <div className='space-y-3'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-[400px] w-full' />
            </div>
          ) : (
            <ExecutionsTable
              data={executions}
              playbooks={playbooks}
              scenarios={scenarios}
              totalCount={totalCount}
              isLoading={executionsLoading}
            />
          )}
        </div>
      </Page>

      <ExecutionsDialogs />
    </ExecutionsProvider>
  )
}
