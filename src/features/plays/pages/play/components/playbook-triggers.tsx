import { useState } from 'react'
import { TriggerType, type Trigger } from '@/graphql/global/types.generated'
import { Zap, Plus, Users, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTriggersQuery } from '../../../graphql/operations.generated'
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

  const handleAddTrigger = () => {
    toast.info('Adding new triggers coming soon!')
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
            <div className='py-8 text-center'>
              <p className='text-muted-foreground text-sm'>Loading triggers...</p>
            </div>
          ) : error ? (
            <div className='py-8 text-center'>
              <p className='text-destructive text-sm'>Failed to load triggers</p>
            </div>
          ) : triggers.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
          ) : (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground mb-4 text-sm'>No triggers configured yet</p>
              <Button variant='outline' size='sm' onClick={handleAddTrigger}>
                <Plus className='mr-2 h-4 w-4' />
                Add Trigger
              </Button>
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
