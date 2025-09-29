import { useEffect } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { Activity as ActivityIcon, Cable, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/empty-state'
import { Loadable } from '@/components/loadable'
import { Page } from '@/components/page'
import { ExecutionsDialogs } from './components/executions-dialogs'
import { ExecutionsProvider } from './components/executions-provider'
import { useExecutions } from './components/executions-provider'
import { ExecutionsTable } from './components/executions-table'
import {
  ExecutionsDocument,
  usePlaybooksForFilterQuery,
  useScenariosForFilterQuery,
  useExecutionQuery,
} from './graphql/operations.generated'

const route = getRouteApi('/activity/')

function ActivityContent() {
  const search = route.useSearch()
  const navigate = useNavigate()
  const { setCurrentExecution, currentExecution } = useExecutions()

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

  // Fetch specific execution if executionId is in URL and we don't have it from table click
  const shouldFetchExecution =
    search.executionId && (!currentExecution || currentExecution.id !== search.executionId)
  const { data: executionData } = useExecutionQuery({
    variables: { id: search.executionId! },
    skip: !shouldFetchExecution,
  })

  // Set current execution when data is loaded
  useEffect(() => {
    if (executionData?.execution && shouldFetchExecution) {
      setCurrentExecution(executionData.execution)
    }
  }, [executionData, shouldFetchExecution, setCurrentExecution])

  // Use previous data while loading to prevent skeleton flash
  const currentData = executionsData || previousData

  // Fetch playbooks for filtering
  const { data: playbooksData } = usePlaybooksForFilterQuery()
  const { data: scenariosData } = useScenariosForFilterQuery()

  const executions = currentData?.executions.data || []
  const totalCount = currentData?.executions.totalCount || 0
  const playbooks = playbooksData?.playbooks || []
  const scenarios = scenariosData?.playbookScenarios || []

  // Check if we have any executions at all (not filtered, total count)
  const hasAnyActivity = totalCount > 0

  return (
    <>
      <Page title='Activity' description='View and manage agent activity'>
        <div className='space-y-4'>
          <Loadable
            isLoading={!currentData && executionsLoading}
            loader={
              <div className='space-y-3'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-[400px] w-full' />
              </div>
            }
            isEmpty={!hasAnyActivity}
            emptyComponent={
              <EmptyState
                Icon={ActivityIcon}
                title='No activity yet'
                description='Get started by connecting your tools and setting up your first play to see agent activity here'
                Cta={
                  <div className='flex gap-3'>
                    <Button variant='outline' onClick={() => navigate({ to: '/tools' })}>
                      <Cable className='mr-2 h-4 w-4' />
                      Connect Tools
                    </Button>
                    <Button onClick={() => navigate({ to: '/agents' })}>
                      <PlayCircle className='mr-2 h-4 w-4' />
                      Set Up Your First Play
                    </Button>
                  </div>
                }
              />
            }
          >
            <ExecutionsTable
              data={executions}
              playbooks={playbooks}
              scenarios={scenarios}
              totalCount={totalCount}
              isLoading={executionsLoading}
            />
          </Loadable>
        </div>
      </Page>

      <ExecutionsDialogs />
    </>
  )
}

export function Activity() {
  return (
    <ExecutionsProvider>
      <ActivityContent />
    </ExecutionsProvider>
  )
}
