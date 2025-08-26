import { useQuery } from '@apollo/client'
import { Page } from '@/components/page'
import { Skeleton } from '@/components/ui/skeleton'
import { ExecutionsDocument, PlaybooksForFilterDocument } from './graphql/operations.generated'
import { ExecutionsDialogs } from './components/executions-dialogs'
import { ExecutionsProvider } from './components/executions-provider'
import { ExecutionsTable } from './components/executions-table'

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
  const { data: playbooksData } = useQuery(PlaybooksForFilterDocument)

  const executions = executionsData?.executions.data || []
  const playbooks = playbooksData?.playbooks || []

  return (
    <ExecutionsProvider>
      <Page
        title="Activity"
        description="View and manage agent activity"
        mainFixed
      >
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {executionsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <ExecutionsTable data={executions} playbooks={playbooks} />
          )}
        </div>
      </Page>

      <ExecutionsDialogs />
    </ExecutionsProvider>
  )
}
