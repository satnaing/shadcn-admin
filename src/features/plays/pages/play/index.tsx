import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { PlayCircle, PauseCircle, Plus, Settings, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { EditableText } from '@/components/editable-text'
import { Page } from '@/components/page'
import { usePlaybookQuery, usePlaybookUpdateMutation } from '../../graphql/operations.generated'
import { PlaybookTriggers } from './components/playbook-triggers'
import { ScenarioModal } from './components/scenario-modal'
import { PlaybookDetailSkeleton } from './components/skeleton'

export default function PlaybookDetailPage() {
  const { playbookId } = useParams({ from: '/plays/$playbookId' })
  const [selectedScenario, setSelectedScenario] = useState<any>(null)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  const { data, loading, refetch } = usePlaybookQuery({
    variables: { id: playbookId },
  })

  const [updatePlaybook, { loading: updatePlaybookLoading }] = usePlaybookUpdateMutation()

  const playbook = data?.playbook

  const handleTogglePlaybook = async () => {
    if (!playbook) return

    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            isEnabled: !playbook.isEnabled,
          },
        },
      })
      toast.success(playbook.isEnabled ? 'Playbook deactivated' : 'Playbook activated', {
        description: `${playbook.name} has been ${playbook.isEnabled ? 'deactivated' : 'activated'} successfully`,
      })
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update playbook. ${error.message}`)
    }
  }

  const handleUpdateName = async (newName: string) => {
    if (!playbook) return

    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            name: newName,
          },
        },
      })
      toast.success('Playbook name updated')
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update name. ${error.message}`)
      throw error
    }
  }

  const handleUpdateDescription = async (newDescription: string) => {
    if (!playbook) return

    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            description: newDescription,
          },
        },
      })
      toast.success('Playbook description updated')
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update description. ${error.message}`)
      throw error
    }
  }

  if (loading) {
    return (
      <Page backPath='/plays'>
        <PlaybookDetailSkeleton />
      </Page>
    )
  }

  if (!playbook) {
    return (
      <Page title='Playbook not found' backPath='/plays'>
        <Card>
          <CardHeader>
            <CardTitle>Playbook not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              The requested playbook could not be found. It may have been deleted or you may not
              have permission to view it.
            </p>
          </CardContent>
        </Card>
      </Page>
    )
  }

  return (
    <Page
      title={
        <EditableText
          value={playbook.name}
          onSave={handleUpdateName}
          placeholder='Playbook name'
          disabled={updatePlaybookLoading}
          textClassName='text-2xl font-bold'
        />
      }
      backPath='/plays'
      actions={
        <Button
          loading={updatePlaybookLoading}
          variant={playbook.isEnabled ? 'destructive' : 'default'}
          onClick={handleTogglePlaybook}
        >
          {playbook.isEnabled ? (
            <>
              <PauseCircle className='mr-2 h-4 w-4' />
              Deactivate
            </>
          ) : (
            <>
              <PlayCircle className='mr-2 h-4 w-4' />
              Activate
            </>
          )}
        </Button>
      }
    >
      <div className='space-y-6'>
        {/* Editable Description */}
        <div className='mb-8'>
          <EditableText
            value={playbook.description || ''}
            onSave={handleUpdateDescription}
            variant={'multiLine'}
            placeholder='Playbook description'
            disabled={updatePlaybookLoading}
            textClassName='text-sm text-muted-foreground'
          />
        </div>

        {/* Triggers Card */}
        <PlaybookTriggers playbookId={playbookId} />

        {/* Scenarios Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='mb-2 flex items-center gap-2'>
                  <Layers className='h-5 w-5' />
                  Scenarios
                </CardTitle>
                <CardDescription>
                  {playbook.scenarios?.length || 0} scenario
                  {playbook.scenarios?.length !== 1 ? 's' : ''} configured
                </CardDescription>
              </div>
              <Button size='sm' variant='outline' onClick={() => setCreateScenarioOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Add Scenario
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {playbook.scenarios && playbook.scenarios.length > 0 ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {playbook.scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className='hover:bg-accent/50 group cursor-pointer rounded-lg border p-4 transition-colors'
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0 flex-1'>
                        <h4 className='truncate font-medium'>{scenario.name}</h4>
                        <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
                          {scenario.description || 'No description'}
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedScenario(scenario)
                        }}
                      >
                        <Settings className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8 text-center'>
                <p className='text-muted-foreground text-sm'>
                  No scenarios configured for this playbook yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scenario Modal */}
      <ScenarioModal
        mode={selectedScenario ? 'edit' : 'create'}
        playbookId={playbookId}
        scenario={selectedScenario}
        isOpen={!!selectedScenario || createScenarioOpen}
        onClose={() => {
          setSelectedScenario(null)
          setCreateScenarioOpen(false)
        }}
        onSuccess={refetch}
      />
    </Page>
  )
}
