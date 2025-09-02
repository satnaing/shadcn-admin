import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { PlayCircle, PauseCircle, Plus, Settings, Layers, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { EditableText } from '@/components/editable-text'
import { Page } from '@/components/page'
import { usePlaybookQuery, usePlaybookUpdateMutation } from '../../graphql/operations.generated'
import { PlaybookTriggers } from './components/playbook-triggers'
import { ScenarioForm } from './components/scenario-form'
import { ScenarioModal } from './components/scenario-modal'
import { PlaybookDetailSkeleton } from './components/skeleton'

export default function PlaybookDetailPage() {
  const { playbookId } = useParams({ from: '/plays/$playbookId' })
  const [selectedScenario, setSelectedScenario] = useState<any>(null)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [outreachInstructions, setOutreachInstructions] = useState('')
  const [isSavingDescription, setIsSavingDescription] = useState(false)

  const { data, loading, refetch } = usePlaybookQuery({
    variables: { id: playbookId },
  })

  const [updatePlaybook, { loading: updatePlaybookLoading }] = usePlaybookUpdateMutation()

  const playbook = data?.playbook

  useEffect(() => {
    if (playbook) {
      setDescription(playbook.description || '')
      setOutreachInstructions(playbook.outreachInstructions || '')
    }
  }, [playbook])

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

  const handleUpdateDescription = async () => {
    if (!playbook) return

    const hasDescriptionChanged = description.trim() !== (playbook.description || '').trim()
    const hasOutreachChanged =
      outreachInstructions.trim() !== (playbook.outreachInstructions || '').trim()

    if (!hasDescriptionChanged && !hasOutreachChanged) return

    setIsSavingDescription(true)
    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            description: description.trim(),
            outreachInstructions: outreachInstructions.trim(),
          },
        },
      })
      toast.success('Instructions updated')
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update instructions. ${error.message}`)
      // Reset to original values on error
      setDescription(playbook.description || '')
      setOutreachInstructions(playbook.outreachInstructions || '')
    } finally {
      setIsSavingDescription(false)
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
        <div className='flex items-center gap-2'>
          <EditableText
            value={playbook.name}
            onSave={handleUpdateName}
            placeholder='Playbook name'
            disabled={updatePlaybookLoading}
            textClassName='text-2xl font-bold'
          />
          <div
            className={`h-2 w-2 rounded-full ${playbook.isEnabled ? 'bg-green-500' : 'bg-yellow-500'}`}
          />
        </div>
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
        {/* Triggers Card */}
        <PlaybookTriggers playbookId={playbookId} />

        {/* Playbook Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='mb-2 flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Playbook
                </CardTitle>
                <CardDescription>
                  Configure the context, instructions, and scenarios for this playbook
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Context & Instructions Section */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='description'>Context</Label>
                <Textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Explain briefly when this playbook runs and what Swan should be aware of'
                  className='max-h-[200px] min-h-[100px] resize-none'
                  disabled={isSavingDescription}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='outreach-instructions'>Outreach Instructions</Label>
                <Textarea
                  id='outreach-instructions'
                  value={outreachInstructions}
                  onChange={(e) => setOutreachInstructions(e.target.value)}
                  placeholder='Provide specific instructions for outreach messages and communication style'
                  className='max-h-[200px] min-h-[100px] resize-none'
                  disabled={isSavingDescription}
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  size='sm'
                  onClick={handleUpdateDescription}
                  disabled={
                    isSavingDescription ||
                    updatePlaybookLoading ||
                    (description.trim() === (playbook.description || '').trim() &&
                      outreachInstructions.trim() === (playbook.outreachInstructions || '').trim())
                  }
                  loading={isSavingDescription}
                >
                  Save Changes
                </Button>
              </div>
            </div>

            <Separator />

            {/* Scenarios Section */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='flex items-center gap-2 text-sm font-medium'>
                    <Layers className='h-4 w-4' />
                    Scenarios
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    {playbook.scenarios?.length || 0} scenario
                    {playbook.scenarios?.length !== 1 ? 's' : ''} configured
                  </p>
                </div>
                <Button size='sm' variant='outline' onClick={() => setCreateScenarioOpen(true)}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Scenario
                </Button>
              </div>

              {playbook.scenarios && playbook.scenarios.length > 0 ? (
                playbook.scenarios.length === 1 ? (
                  // Single scenario: show form directly
                  <ScenarioForm
                    mode='edit'
                    scenario={playbook.scenarios[0]}
                    onSuccess={refetch}
                    formId='single-scenario-form'
                    showButtons={true}
                  />
                ) : (
                  // Multiple scenarios: show cards with modals
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
                )
              ) : (
                <div className='rounded-lg border border-dashed p-8 text-center'>
                  <p className='text-muted-foreground text-sm'>
                    No scenarios configured for this playbook yet.
                  </p>
                </div>
              )}
            </div>
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
