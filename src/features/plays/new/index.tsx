import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CheckCircle, Layers, Plus, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperPanel,
  StepperContent,
  StepperNav,
} from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'
import { Page } from '@/components/page'
import { HubspotTriggerCard } from '../components/hubspot-trigger-card'
import { type PlaybookDetailsData } from '../components/playbook-details-form'
import {
  usePlayCreateMutation,
  usePlaybookScenarioCreateMutation,
} from '../graphql/operations.generated'
import ActionPlanEditor from '../pages/play/components/action-plan-editor'
import { ScenarioForm, type ScenarioFormData } from '../pages/play/components/scenario-form'
import { formatActionPlanForDisplay } from '../utils/format-action-plan'

interface ScenarioData extends ScenarioFormData {
  id: string
}

export default function PlaybookNewPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)

  // Step 1: Agent details
  const [playbookData, setPlaybookData] = useState<PlaybookDetailsData>({
    name: '',
    description: '',
    outreachInstructions: '', // Keep for compatibility but won't be used
  })

  // Step 3: Scenarios
  const [scenarios, setScenarios] = useState<ScenarioData[]>([
    {
      id: 'temp-1',
      name: 'Scenario 1',
      description: 'Whenever an event occurs',
      actionPlan: '',
    },
  ])
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null)

  // Mutations
  const [createPlaybook] = usePlayCreateMutation()
  const [createScenario] = usePlaybookScenarioCreateMutation()

  const handlePlaybookChange = (data: PlaybookDetailsData) => {
    setPlaybookData(data)
  }

  const handleAddScenario = (formData: ScenarioFormData) => {
    const newScenario: ScenarioData = {
      ...formData,
      id: `temp-${Date.now()}`,
    }
    setScenarios((prev) => [...prev, newScenario])
    setEditingScenarioId(newScenario.id)
    toast.success('Scenario added')
  }

  const handleEditScenario = (scenarioId: string, formData: ScenarioFormData) => {
    setScenarios((prev) => prev.map((s) => (s.id === scenarioId ? { ...formData, id: s.id } : s)))
    setEditingScenarioId(null)
    toast.success('Scenario updated')
  }

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
    toast.success('Scenario removed')
  }

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate step 1
      if (!playbookData.name.trim()) {
        toast.error('Please provide an agent name')
        return
      }
      if (!playbookData.description.trim()) {
        toast.error('Please provide a description')
        return
      }
    }

    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleCreate = async () => {
    // Validate all required fields
    if (!playbookData.name.trim() || !playbookData.description.trim()) {
      toast.error('Please complete all required fields')
      setActiveStep(1)
      return
    }

    if (scenarios.length === 0) {
      toast.error('Please add at least one scenario')
      return
    }

    setIsCreating(true)

    try {
      // Step 1: Create the agent
      const { data: playbookResponse } = await createPlaybook({
        variables: {
          input: {
            name: playbookData.name,
            description: playbookData.description,
          },
        },
      })

      if (!playbookResponse?.playCreate) {
        toast.error('Failed to create agent', { description: 'Please try again' })
        return
      }

      const newPlaybookId = playbookResponse.playCreate.id

      // Step 2: Create scenarios for the playbook
      const scenarioPromises = scenarios.map((scenario) =>
        createScenario({
          variables: {
            input: {
              playbookId: newPlaybookId,
              name: scenario.name,
              description: scenario.description,
              actionPlan: scenario.actionPlan,
            },
          },
        })
      )

      await Promise.all(scenarioPromises)

      navigate({
        to: '/agents/$playbookId',
        params: { playbookId: newPlaybookId },
        search: { isNew: true },
      })
    } catch (error: any) {
      toast.error('Failed to create agent', {
        description: error.message || 'Please try again',
      })
      setIsCreating(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return !!playbookData.name.trim() && !!playbookData.description.trim()
      case 2:
        return true // Triggers are informational only
      case 3:
        return scenarios.length > 0
      default:
        return false
    }
  }

  return (
    <Page
      title='Create Agent'
      description='Set up your new agent step by step'
      actions={
        <Button variant='outline' onClick={() => navigate({ to: '/agents' })}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Cancel
        </Button>
      }
    >
      <div className='mx-auto max-w-4xl space-y-6'>
        <Stepper value={activeStep} onValueChange={setActiveStep}>
          <StepperNav className='mt-3 mb-6'>
            <StepperItem step={1} completed={isStepValid(1)}>
              <StepperTrigger>
                <StepperIndicator>
                  {isStepValid(1) ? <CheckCircle className='h-4 w-4' /> : <span>1</span>}
                </StepperIndicator>
                <div className='ml-2'>
                  <StepperTitle>Details</StepperTitle>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem step={2} completed={isStepValid(2) && activeStep > 1}>
              <StepperTrigger>
                <StepperIndicator>
                  {isStepValid(2) && activeStep > 2 ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <span>2</span>
                  )}
                </StepperIndicator>
                <div className='ml-2'>
                  <StepperTitle>Triggers</StepperTitle>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem step={3}>
              <StepperTrigger>
                <StepperIndicator>
                  <span>3</span>
                </StepperIndicator>
                <div className='ml-2'>
                  <StepperTitle>Action Plan</StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
          </StepperNav>

          <StepperPanel>
            {/* Step 1: Agent Details */}
            <StepperContent value={1}>
              <Card>
                <CardContent className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Name *</Label>
                    <Input
                      id='name'
                      placeholder='Enter agent name'
                      value={playbookData.name}
                      onChange={(e) =>
                        handlePlaybookChange({
                          ...playbookData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Identity</Label>
                    <Textarea
                      id='description'
                      value={playbookData.description}
                      onChange={(e) =>
                        handlePlaybookChange({
                          ...playbookData,
                          description: e.target.value,
                        })
                      }
                      placeholder='My goal is to... I always...'
                      className='max-h-[200px] min-h-[100px] resize-none'
                    />
                    <p className='text-muted-foreground text-sm'>
                      Tell the Agent what its purpose is and what it's trying to achieve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StepperContent>

            {/* Step 2: Triggers */}
            <StepperContent value={2}>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Zap className='h-5 w-5' />
                    Triggers
                  </CardTitle>
                  <CardDescription>
                    Your agent can be triggered by the following events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <HubspotTriggerCard />
                    <p className='text-muted-foreground text-sm'>
                      Additional triggers can be configured after creating the agent.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StepperContent>

            {/* Step 3: Action Plan */}
            <StepperContent value={3}>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Layers className='h-5 w-5' />
                    Action Plan
                  </CardTitle>
                  <CardDescription>
                    {scenarios.length === 1 && !editingScenarioId
                      ? 'Tell the agent what it does once triggered. Add scenarios when different conditions require different actions.'
                      : 'Define scenarios with conditions and actions. Swan analyzes the situation first, then executes the matching action plan.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scenarios.length === 0 ? (
                    <div className='space-y-4'>
                      <div className='rounded-lg border border-dashed p-8 text-center'>
                        <p className='text-muted-foreground mb-4 text-sm'>
                          No scenarios added yet. Add at least one scenario to define conditions and
                          their corresponding actions.
                        </p>
                      </div>

                      <ScenarioForm
                        mode='create'
                        onSuccess={handleAddScenario}
                        showButtons={true}
                        formId='new-scenario-form'
                        skipMutation={true}
                      />
                    </div>
                  ) : scenarios.length === 1 && !editingScenarioId ? (
                    // Simplified view for single scenario
                    <div className='space-y-4'>
                      <div>
                        <ActionPlanEditor
                          value={scenarios[0].actionPlan}
                          onChange={(value) => {
                            setScenarios((prev) => [{ ...prev[0], actionPlan: value }])
                          }}
                          disabled={isCreating}
                        />
                        <p className='text-muted-foreground mt-2 text-sm'>
                          Use "@" to tag users or "#" for channels & HubSpot lists
                        </p>
                      </div>

                      <Button
                        variant='outline'
                        onClick={() => {
                          handleAddScenario({ name: '', description: '', actionPlan: '' })
                        }}
                        className='w-full'
                      >
                        <Plus className='h-4 w-4' />
                        Add Scenario with Conditions
                      </Button>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {/* List of scenarios */}
                      <div className='space-y-3'>
                        {scenarios.map((scenario) => (
                          <div key={scenario.id} className='rounded-lg border p-4'>
                            {editingScenarioId === scenario.id ? (
                              // Inline edit form
                              <ScenarioForm
                                mode='edit'
                                scenario={scenario}
                                onSuccess={(formData) => handleEditScenario(scenario.id, formData)}
                                onCancel={() => setEditingScenarioId(null)}
                                showButtons={true}
                                formId={`edit-scenario-${scenario.id}`}
                                skipMutation
                              />
                            ) : (
                              // Display mode
                              <div className='flex items-start justify-between gap-2'>
                                <div className='min-w-0 flex-1 space-y-2'>
                                  <h4 className='font-medium'>{scenario.name}</h4>
                                  <div className='space-y-1'>
                                    <p className='text-muted-foreground text-xs font-medium uppercase'>
                                      When
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                      {scenario.description}
                                    </p>
                                  </div>
                                  <div className='space-y-1'>
                                    <p className='text-muted-foreground text-xs font-medium uppercase'>
                                      Then
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                      {formatActionPlanForDisplay(scenario.actionPlan)}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex gap-2'>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => setEditingScenarioId(scenario.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => handleDeleteScenario(scenario.id)}
                                    disabled={scenarios.length === 1}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add new scenario card */}
                      <Button
                        className='w-full'
                        variant='outline'
                        onClick={() =>
                          handleAddScenario({ name: '', description: '', actionPlan: '' })
                        }
                      >
                        <Plus className='h-4 w-4' />
                        Add Another Scenario
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </StepperContent>
          </StepperPanel>
        </Stepper>

        {/* Navigation buttons */}
        <div className='flex items-center justify-between'>
          <Button variant='outline' onClick={handleBack} disabled={activeStep === 1 || isCreating}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>

          {activeStep < 3 ? (
            <Button onClick={handleNext} disabled={!isStepValid(activeStep)}>
              Next
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!isStepValid(3) || isCreating}
              loading={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Agent'}
            </Button>
          )}
        </div>
      </div>
    </Page>
  )
}
