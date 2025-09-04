import { useState } from 'react'
import { TriggerType, type Trigger } from '@/graphql/global/types.generated'
import { Zap, Users, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { IconHubspot } from '@/assets/brand-icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
      return 'Whenever a new website visitor is de-anonymized'
    case TriggerType.HubspotWorkflow:
      return 'Triggered by custom action from within a Hubspot Workflow'
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
              <CardTitle className='mb-2 flex items-center gap-2'>
                <Zap className='h-5 w-5' />
                Triggers
              </CardTitle>
              <CardDescription>Define when this playbook should be executed</CardDescription>
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
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[1, 2].map((index) => (
                <TriggerCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className='py-8 text-center'>
              <p className='text-destructive text-sm'>Failed to load triggers</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* Always show the default HubSpot workflow trigger */}
              <div
                key={hubspotWorkflowTrigger.id}
                className='bg-muted/30 relative cursor-default rounded-lg border border-dashed p-4'
              >
                <div className='flex items-start gap-3'>
                  <div className='rounded-lg bg-orange-500/10 p-2'>
                    <IconHubspot className='h-5 w-5 text-orange-500' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1 flex items-center gap-2'>
                      <h4 className='truncate font-medium'>{hubspotWorkflowTrigger.name}</h4>
                      <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs'>
                        Default
                      </span>
                    </div>
                    <p className='text-muted-foreground line-clamp-2 text-sm'>
                      {hubspotWorkflowTrigger.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show other configured triggers */}
              {triggers.map((trigger) => {
                const Icon = getTriggerIcon(trigger.type)
                return (
                  <div
                    key={trigger.id}
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
                )
              })}
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
