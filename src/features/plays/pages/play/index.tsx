import { useState, useEffect } from 'react'
import { useParams, useSearch } from '@tanstack/react-router'
import { PlayCircle, PauseCircle, Plus, Settings, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { EditableText } from '@/components/editable-text'
import { Page } from '@/components/page'
import ActionPlanEditor from '@/features/plays/pages/play/components/action-plan-editor'
import { type PlaybookDetailsData } from '../../components/playbook-details-form'
import {
  usePlaybookQuery,
  usePlaybookUpdateMutation,
  usePlaybookScenarioUpdateMutation,
} from '../../graphql/operations.generated'
import { formatActionPlanForDisplay } from '../../utils/format-action-plan'
import { PlaybookTriggers } from './components/playbook-triggers'
import { ScenarioModal } from './components/scenario-modal'
import { PlaybookDetailSkeleton } from './components/skeleton'

export default function PlaybookDetailPage() {
  const { playbookId } = useParams({ from: '/agents/$playbookId' })
  const { isNew } = useSearch({ from: '/agents/$playbookId' })
  const [selectedScenario, setSelectedScenario] = useState<any>(null)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [singleScenarioActionPlan, setSingleScenarioActionPlan] = useState('')
  const [playbookDetails, setPlaybookDetails] = useState<PlaybookDetailsData>({
    name: '',
    description: '',
    outreachInstructions: '',
  })

  const { data, loading, refetch } = usePlaybookQuery({
    variables: { id: playbookId },
  })

  const [updatePlaybook, { loading: updatePlaybookLoading }] = usePlaybookUpdateMutation()
  const [updateScenario, { loading: updateScenarioLoading }] = usePlaybookScenarioUpdateMutation()

  const playbook = data?.playbook

  useEffect(() => {
    if (playbook) {
      setPlaybookDetails({
        name: playbook.name || '',
        description: playbook.description || '',
        outreachInstructions: playbook.outreachInstructions || '',
      })
      // Set single scenario action plan if there's only one scenario
      if (playbook.scenarios && playbook.scenarios.length === 1) {
        setSingleScenarioActionPlan(playbook.scenarios[0].actionPlan || '')
      }
    }
  }, [playbook])

  useEffect(() => {
    if (isNew && playbook) {
      toast.success('Agent created successfully!', {
        description: `${playbook.name} has been created from the template.`,
      })
    }
  }, [isNew, playbook])

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
      toast.success(playbook.isEnabled ? 'Agent deactivated' : 'Agent activated', {
        description: `${playbook.name} has been ${playbook.isEnabled ? 'deactivated' : 'activated'} successfully`,
      })
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update agent. ${error.message}`)
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
      toast.success('Agent name updated')
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update name. ${error.message}`)
      throw error
    }
  }

  const handleUpdateDetails = async (data: PlaybookDetailsData) => {
    if (!playbook) return

    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            description: data.description.trim(),
            outreachInstructions: data.outreachInstructions?.trim(),
          },
        },
      })
      toast.success('Context updated')
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update context. ${error.message}`)
      // Reset to original values on error
      setPlaybookDetails({
        name: playbook.name || '',
        description: playbook.description || '',
        outreachInstructions: playbook.outreachInstructions || '',
      })
    }
  }

  const handleUpdateSingleScenario = async () => {
    if (!playbook || !playbook.scenarios || playbook.scenarios.length !== 1) return

    const scenario = playbook.scenarios[0]

    try {
      await updateScenario({
        variables: {
          input: {
            id: scenario.id,
            actionPlan: singleScenarioActionPlan.trim(),
          },
        },
      })
      toast.success('Action plan updated')
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update action plan. ${error.message}`)
      // Reset to original value on error
      setSingleScenarioActionPlan(scenario.actionPlan || '')
    }
  }

  if (loading) {
    return (
      <Page backPath='/agents'>
        <PlaybookDetailSkeleton />
      </Page>
    )
  }

  if (!playbook) {
    return (
      <Page title='Agent not found' backPath='/agents'>
        <Card>
          <CardHeader>
            <CardTitle>Agent not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              The requested agent could not be found. It may have been deleted or you may not have
              permission to view it.
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
          <div
            className={`h-2 w-2 rounded-full ${playbook.isEnabled ? 'bg-green-500' : 'bg-yellow-500'}`}
          />
          <EditableText
            value={playbook.name}
            onSave={handleUpdateName}
            placeholder='Agent name'
            disabled={updatePlaybookLoading}
            textClassName='text-2xl font-bold'
          />
        </div>
      }
      backPath='/agents'
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

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-8'>
            {/* Identity Section */}
            <div className='space-y-3'>
              <div>
                <h3 className='mb-1 text-base font-semibold'>Identity</h3>
                <p className='text-muted-foreground text-sm'>
                  Tell the Agent what its purpose is and what it's trying to achieve.
                </p>
              </div>
              <Textarea
                id='description'
                value={playbookDetails.description}
                onChange={(e) =>
                  setPlaybookDetails({ ...playbookDetails, description: e.target.value })
                }
                placeholder='My goal is... I always...'
                className='max-h-[200px] min-h-[100px] resize-none'
                disabled={updatePlaybookLoading}
              />
            </div>

            {/* Action Plan Section */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='mb-1 text-base font-semibold'>Action Plan</h3>
                  <p className='text-muted-foreground text-sm'>
                    Add scenarios when different conditions require different actions.
                  </p>
                </div>
                <Button size='sm' variant='outline' onClick={() => setCreateScenarioOpen(true)}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Scenario
                </Button>
              </div>

              {playbook.scenarios && playbook.scenarios.length > 0 ? (
                playbook.scenarios.length === 1 ? (
                  // Single scenario: show only action plan editor
                  <div className='space-y-4'>
                    <ActionPlanEditor
                      value={singleScenarioActionPlan}
                      onChange={setSingleScenarioActionPlan}
                      disabled={updateScenarioLoading}
                    />
                    <div className='text-muted-foreground text-sm'>
                      Provide detailed steps that will be executed. Use "#" for channels & HubSpot
                      lists, or "@" for users.
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        size='sm'
                        onClick={handleUpdateSingleScenario}
                        disabled={
                          updateScenarioLoading ||
                          singleScenarioActionPlan.trim() ===
                            (playbook.scenarios[0].actionPlan || '').trim()
                        }
                        loading={updateScenarioLoading}
                      >
                        Save Action Plan
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Multiple scenarios: show cards with modals
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {playbook.scenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className='hover:bg-accent/50 group cursor-pointer rounded-lg border p-5 transition-all hover:shadow-md'
                        onClick={() => setSelectedScenario(scenario)}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0 flex-1 space-y-3'>
                            <h4 className='text-base font-semibold'>{scenario.name}</h4>

                            <div>
                              <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                                WHEN...
                              </span>
                              <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
                                {scenario.description || 'No condition defined'}
                              </p>
                            </div>

                            <div>
                              <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                                I SHOULD...
                              </span>
                              <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
                                {scenario.actionPlan
                                  ? formatActionPlanForDisplay(scenario.actionPlan).slice(0, 100) +
                                    (formatActionPlanForDisplay(scenario.actionPlan).length > 100
                                      ? '...'
                                      : '')
                                  : 'No action plan defined'}
                              </p>
                            </div>
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
                    No action plans configured yet. Add scenarios to define conditions and their
                    corresponding actions.
                  </p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className='flex justify-end pt-2'>
              <Button
                size='sm'
                onClick={() => handleUpdateDetails(playbookDetails)}
                disabled={
                  updatePlaybookLoading ||
                  (playbookDetails.description.trim() === (playbook.description || '').trim() &&
                    playbookDetails.outreachInstructions?.trim() ===
                      (playbook.outreachInstructions || '').trim())
                }
                loading={updatePlaybookLoading}
              >
                Save Changes
              </Button>
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
