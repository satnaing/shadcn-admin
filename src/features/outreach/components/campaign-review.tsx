import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { CampaignStepType } from '@/graphql/global/types.generated'
import { Mail, Linkedin, UserPlus, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loadable } from '@/components/loadable'
import {
  useGetCampaignWithStepsQuery,
  useCampaignApproveStepsMutation,
  GetCampaignContactsDocument,
  type GetCampaignWithStepsQuery,
} from '../graphql/operations.generated'

interface CampaignReviewProps {
  campaignId: string
  campaignContactId: string
  onApprove: () => void
  onCancel: () => void
}

interface StepFormData {
  [stepId: string]: {
    message?: string
    subject?: string
    waitValue?: number
    waitUnit?: 'hours' | 'days'
  }
}

const stepTypeConfig: Record<
  CampaignStepType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  EMAIL_MESSAGE: {
    icon: <Mail className='h-4 w-4' />,
    label: 'Email',
    color: 'bg-blue-100 text-blue-600',
  },
  LI_MESSAGE: {
    icon: <Linkedin className='h-4 w-4' />,
    label: 'LinkedIn Message',
    color: 'bg-purple-100 text-purple-600',
  },
  LI_CONNECTION_REQUEST: {
    icon: <UserPlus className='h-4 w-4' />,
    label: 'Connection Request',
    color: 'bg-green-100 text-green-600',
  },
  LI_PROFILE_VISIT: {
    icon: <Linkedin className='h-4 w-4' />,
    label: 'Profile Visit',
    color: 'bg-gray-100 text-gray-600',
  },
  WAIT: {
    icon: <Clock className='h-4 w-4' />,
    label: 'Wait',
    color: 'bg-yellow-100 text-yellow-600',
  },
}

export function CampaignReview({
  campaignId,
  campaignContactId,
  onApprove,
  onCancel,
}: CampaignReviewProps) {
  const { data, loading } = useGetCampaignWithStepsQuery({
    variables: { campaignId },
  })

  const [approveSteps, { loading: approving }] = useCampaignApproveStepsMutation({
    refetchQueries: [GetCampaignContactsDocument],
  })

  const { register, handleSubmit, setValue, watch } = useForm<StepFormData>()

  type CampaignStep = NonNullable<GetCampaignWithStepsQuery['campaign']>['steps'][number]
  const [orderedSteps, setOrderedSteps] = useState<CampaignStep[]>([])

  useEffect(() => {
    if (data?.campaign?.steps) {
      // Build the step sequence by following successStepId chain
      const stepsById = new Map(data.campaign.steps.map((step) => [step.id, step]))
      const ordered: CampaignStep[] = []

      // Find entry step
      let currentStep = data.campaign.steps.find((step) => step.isEntry)

      // Follow the chain
      while (currentStep) {
        ordered.push(currentStep)
        if (currentStep.successStepId) {
          currentStep = stepsById.get(currentStep.successStepId)
        } else {
          currentStep = undefined
        }
      }

      setOrderedSteps(ordered)

      // Initialize form values for message and wait steps
      ordered.forEach((step) => {
        const stepData = step.data as any

        if (
          step.type === 'EMAIL_MESSAGE' ||
          step.type === 'LI_MESSAGE' ||
          step.type === 'LI_CONNECTION_REQUEST'
        ) {
          setValue(`${step.id}.message`, stepData.template || stepData.message || '')
          if (step.type === 'EMAIL_MESSAGE' && stepData.subjectTemplate) {
            setValue(`${step.id}.subject`, stepData.subjectTemplate)
          }
        }

        if (step.type === 'WAIT' && stepData) {
          setValue(`${step.id}.waitValue`, parseInt(stepData.value))
          setValue(`${step.id}.waitUnit`, stepData.unit)
        }
      })
    }
  }, [data, setValue])

  const onSubmit = async (formData: StepFormData) => {
    // Validate wait steps don't exceed 7 days
    for (const stepId in formData) {
      const step = formData[stepId]
      if (step.waitValue && step.waitUnit) {
        const totalHours = step.waitUnit === 'days' ? step.waitValue * 24 : step.waitValue
        if (totalHours > 168) {
          // 7 days = 168 hours
          toast.error('Wait time cannot exceed 7 days')
          return
        }
      }
    }

    try {
      // Build the updatedSteps array for the mutation
      const updatedSteps = Object.entries(formData)
        .filter(([, stepData]) => {
          // Only include steps that have message or subject updates
          return stepData.message !== undefined || stepData.subject !== undefined
        })
        .map(([stepId, stepData]) => ({
          stepId,
          template: stepData.message,
          subjectTemplate: stepData.subject,
        }))

      const result = await approveSteps({
        variables: {
          input: {
            campaignContactId,
            updatedSteps,
          },
        },
      })

      if (result.data?.campaignApproveSteps.success) {
        toast.success('Campaign steps approved successfully')
        onApprove()
      } else {
        toast.error(result.data?.campaignApproveSteps.code || 'Failed to approve campaign steps')
      }
    } catch (error) {
      // Log error for debugging but don't expose to console in production
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while approving campaign steps'
      toast.error(errorMessage)
    }
  }

  return (
    <Loadable
      isLoading={loading}
      label='Loading campaign steps...'
      isEmpty={!data?.campaign}
      emptyComponent={
        <div className='text-muted-foreground py-8 text-center'>Failed to load campaign data</div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <h3 className='mb-1 text-lg font-semibold'>Campaign Review</h3>
          <p className='text-muted-foreground text-sm'>
            Review and edit the campaign messages before approval
          </p>
        </div>

        <ScrollArea className='h-[calc(100vh-330px)]'>
          <div className='space-y-8 px-3'>
            {orderedSteps.map((step, index) => {
              const config = stepTypeConfig[step.type]
              const stepData = step.data as any
              const isMessageStep = step.type === 'EMAIL_MESSAGE' || step.type === 'LI_MESSAGE'

              return (
                <Card key={step.id} className='relative'>
                  {/* Step number indicator */}
                  <div className='bg-background absolute top-4 -left-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium'>
                    {index + 1}
                  </div>

                  <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center gap-2 text-sm'>
                      <div className={cn('rounded p-1', config.color)}>{config.icon}</div>
                      {config.label}
                      {step.type === 'WAIT' && stepData && (
                        <span className='text-muted-foreground ml-auto text-xs'>
                          Current: {stepData.value} {stepData.unit}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>

                  {isMessageStep && (
                    <CardContent className='space-y-3'>
                      {step.type === 'EMAIL_MESSAGE' && (
                        <div className='space-y-2'>
                          <Label htmlFor={`${step.id}-subject`}>Subject</Label>
                          <Input
                            id={`${step.id}-subject`}
                            {...register(`${step.id}.subject`)}
                            placeholder='Email subject...'
                          />
                        </div>
                      )}

                      <div className='space-y-2'>
                        <Label htmlFor={`${step.id}-message`}>
                          {step.type === 'LI_CONNECTION_REQUEST' ? 'Connection Note' : 'Message'}
                        </Label>
                        <Textarea
                          id={`${step.id}-message`}
                          {...register(`${step.id}.message`)}
                          placeholder='Enter message...'
                          rows={4}
                          className='resize-none'
                        />
                      </div>

                      {/* Show timeout for connection requests */}
                      {stepData.timeout && (
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <Clock className='h-4 w-4' />
                          <span>
                            Connection request will expire after {stepData.timeout.value}{' '}
                            {stepData.timeout.unit}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  )}

                  {step.type === 'WAIT' && (
                    <CardContent className='space-y-3'>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='space-y-2'>
                          <Label htmlFor={`${step.id}-waitValue`}>Duration</Label>
                          <Input
                            id={`${step.id}-waitValue`}
                            type='number'
                            min='1'
                            max={watch(`${step.id}.waitUnit`) === 'days' ? 7 : 168}
                            {...register(`${step.id}.waitValue`, {
                              valueAsNumber: true,
                              validate: (value) => {
                                if (!value) return true
                                const unit = watch(`${step.id}.waitUnit`) || 'hours'
                                const totalHours = unit === 'days' ? value * 24 : value
                                return totalHours <= 168 || 'Maximum wait time is 7 days'
                              },
                            })}
                            placeholder='Enter duration...'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor={`${step.id}-waitUnit`}>Unit</Label>
                          <Select
                            value={watch(`${step.id}.waitUnit`)}
                            onValueChange={(value) => {
                              const formValue = watch(step.id) || {}
                              setValue(step.id, {
                                ...formValue,
                                waitUnit: value as 'hours' | 'days',
                              })
                            }}
                          >
                            <SelectTrigger id={`${step.id}-waitUnit`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='hours'>Hours</SelectItem>
                              <SelectItem value='days'>Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        Maximum wait time is 7 days (168 hours)
                      </p>
                    </CardContent>
                  )}

                  {step.type === 'LI_PROFILE_VISIT' && (
                    <CardContent>
                      <p className='text-muted-foreground text-sm'>
                        Visit LinkedIn profile before sending message
                      </p>
                    </CardContent>
                  )}

                  {/* Connector line */}
                  {index < orderedSteps.length - 1 && (
                    <div className='bg-border absolute -bottom-8 left-2 h-8 w-px' />
                  )}
                </Card>
              )
            })}
          </div>
        </ScrollArea>

        <div className='flex gap-3 border-t pt-4'>
          <Button type='submit' loading={approving} className='flex-1'>
            {approving ? 'Approving...' : 'Approve and Save'}
          </Button>
          <Button
            type='button'
            variant='outline'
            disabled={approving}
            className='flex-1'
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Loadable>
  )
}
