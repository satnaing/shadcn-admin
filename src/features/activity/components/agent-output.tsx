import { startCase } from 'lodash'
import { Card } from '@/components/ui/card'
import { Loadable } from '@/components/loadable'
import { useExecutionArtifactsQuery } from '../graphql/operations.generated'

type AgentOutputProps = {
  executionId: string
}

export function AgentOutput({ executionId }: AgentOutputProps) {
  const { data, loading } = useExecutionArtifactsQuery({
    variables: {
      filters: {
        executionId,
      },
    },
  })

  const artifacts = data?.executionArtifacts || []

  return (
    <Loadable
      isLoading={loading}
      label='Loading resources...'
      isEmpty={artifacts.length === 0}
      emptyComponent={
        <div className='py-8 text-center'>
          <p className='text-muted-foreground text-sm'>No resources found for this execution.</p>
        </div>
      }
      className='flex items-center justify-center py-8'
      spinnerClassName='text-muted-foreground'
    >
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {artifacts.map((artifact) => (
          <Card key={artifact.id} className='p-4'>
            <div className='flex flex-col gap-2'>
              <a
                href={artifact.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary text-xs hover:underline'
              >
                <h4 className='text-sm font-medium'>{artifact.displayName}</h4>
              </a>
              <div className='flex flex-col gap-1'>
                {artifact.entityType && (
                  <span className='text-muted-foreground text-xs'>
                    Type: <span className='font-mono'>{startCase(artifact.entityType)}</span>
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Loadable>
  )
}
