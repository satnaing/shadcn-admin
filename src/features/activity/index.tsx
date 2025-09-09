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

export function Activity() {
  // Fetch executions
  const { data: executionsData, loading: executionsLoading } = useQuery(ExecutionsDocument, {
    variables: {
      page: {
        offset: 0,
        limit: 100, // We'll handle pagination on the frontend for now
      },
    },
  })

  // Fetch playbooks for filtering
  const { data: playbooksData } = usePlaybooksForFilterQuery()
  const { data: scenariosData } = useScenariosForFilterQuery()

  const executions = executionsData?.executions.data || []
  const playbooks = playbooksData?.playbooks || []
  const scenarios = scenariosData?.playbookScenarios || []

  return (
    <ExecutionsProvider>
      <Page title='Activity' description='View and manage agent activity'>
        <div className='space-y-4'>
          {executionsLoading ? (
            <div className='space-y-3'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-[400px] w-full' />
            </div>
          ) : (
            <ExecutionsTable data={executions} playbooks={playbooks} scenarios={scenarios} />
          )}
        </div>
      </Page>

      <ExecutionsDialogs />
    </ExecutionsProvider>
  )
}
