import React, { useState } from 'react'
import { TriggerType, type Trigger } from '@/graphql/global/types.generated'
import { Zap, Users, Eye, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { IconHubspot } from '@/assets/brand-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTriggersQuery } from '../../../graphql/operations.generated'
import { TriggerCardSkeleton } from './trigger-card-skeleton'
import { TriggerConfigModal } from './trigger-config-modal'

interface PlaybookTriggersProps {
  playbookId: string
}

const getTriggerIcon = (type: TriggerType) => {
  switch (type) {
    case TriggerType.CompanyAddedToList:
      return Users
    case TriggerType.NewWebsiteVisitor:
      return Eye
    case TriggerType.HubspotWorkflow:
      return IconHubspot
    default:
      return Zap
  }
}

const getTriggerTypeLabel = (type: TriggerType) => {
  switch (type) {
    case TriggerType.CompanyAddedToList:
      return 'Company Added to List'
    case TriggerType.NewWebsiteVisitor:
      return 'When a visitor to the website is de-anonymized'
    case TriggerType.HubspotWorkflow:
      return 'When triggered from a HubSpot workflow'
    default:
      return type
  }
}

export function PlaybookTriggers({ playbookId }: PlaybookTriggersProps) {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const { data, loading, error, refetch } = useTriggersQuery({
    variables: {
      filters: {
        playbookId,
      },
    },
  })

  const triggers = data?.triggers || []

  const handleTriggerClick = (trigger: Trigger) => {
    if (trigger.type === TriggerType.NewWebsiteVisitor) {
      setSelectedTrigger(trigger)
      setIsConfigModalOpen(true)
    } else {
      toast.info('Configuration for this trigger type coming soon!')
    }
  }

  // Default HubSpot workflow trigger that appears on all plays
  const hubspotWorkflowTrigger = {
    id: 'default-hubspot-workflow',
    name: 'HubSpot Workflow',
    type: TriggerType.HubspotWorkflow,
    description: 'Any play can be triggered by using the dedicated Swan workflow action in HubSpot',
    isEnabled: true,
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Zap className='h-5 w-5' />
                Triggers
              </CardTitle>
            </div>
            {/* <Button 
            size="sm" 
            variant="outline"
            onClick={handleConfigureTriggers}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-4'>
              {[1, 2].map((index) => (
                <TriggerCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className='py-8 text-center'>
              <p className='text-destructive text-sm'>Failed to load triggers</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {/* Show other configured triggers first */}
              {triggers.map((trigger, index) => {
                const Icon = getTriggerIcon(trigger.type)
                return (
                  <React.Fragment key={trigger.id}>
                    {index > 0 && (
                      <div className='flex items-center py-2'>
                        <span className='text-muted-foreground text-sm font-medium'>OR</span>
                      </div>
                    )}
                    <div
                      className='hover:bg-accent/50 cursor-pointer rounded-lg border p-4 transition-colors'
                      onClick={() => handleTriggerClick(trigger)}
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={`rounded-lg p-2 ${trigger.isEnabled ? 'bg-primary/10' : 'bg-muted'}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${trigger.isEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <h4 className='truncate font-medium'>{trigger.name}</h4>
                          </div>
                          <p className='text-muted-foreground line-clamp-2 text-sm'>
                            {trigger.description || getTriggerTypeLabel(trigger.type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}

              {/* OR separator before HubSpot trigger */}
              {triggers.length > 0 && (
                <div className='flex items-center py-2'>
                  <span className='text-muted-foreground text-sm font-medium'>OR</span>
                </div>
              )}

              {/* HubSpot workflow trigger */}
              <div
                key={hubspotWorkflowTrigger.id}
                className='bg-muted/30 relative cursor-default rounded-lg border border-dashed p-4'
              >
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-orange-500/10 p-2'>
                    <IconHubspot className='h-5 w-5 text-orange-500' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-sm'>
                      When triggered from a HubSpot workflow
                    </p>
                  </div>
                </div>
              </div>

              {/* OR separator before manual trigger */}
              <div className='flex items-center py-2'>
                <span className='text-muted-foreground text-sm font-medium'>OR</span>
              </div>

              {/* Manual trigger - When you ask me */}
              <div className='bg-muted/30 relative cursor-default rounded-lg border border-dashed p-4'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-blue-500/10 p-2'>
                    <MessageSquare className='h-5 w-5 text-blue-500' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground text-sm'>When you ask me</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trigger Configuration Modal */}
      <TriggerConfigModal
        trigger={selectedTrigger}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false)
          setSelectedTrigger(null)
        }}
        onSuccess={() => refetch()}
      />
    </>
  )
}
