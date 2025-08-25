import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Settings, Plus, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useTriggersQuery } from '../../../graphql/operations.generated';
import { TriggerType, type Trigger } from '@/graphql/global/types.generated';
import { TriggerConfigModal } from './trigger-config-modal';

interface PlaybookTriggersProps {
  playbookId: string;
}

const getTriggerIcon = (type: TriggerType) => {
  switch (type) {
    case TriggerType.CompanyAddedToList:
      return Users;
    case TriggerType.NewWebsiteVisitor:
      return Eye;
    default:
      return Zap;
  }
};

const getTriggerTypeLabel = (type: TriggerType) => {
  switch (type) {
    case TriggerType.CompanyAddedToList:
      return 'Company Added to List';
    case TriggerType.NewWebsiteVisitor:
      return 'Whenever a new website visitor is de-anonymized';
    default:
      return type;
  }
};

export function PlaybookTriggers({ playbookId }: PlaybookTriggersProps) {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const { data, loading, error, refetch } = useTriggersQuery({
    variables: {
      filters: {
        playbookId
      }
    }
  });

  const triggers = data?.triggers || [];

  const handleTriggerClick = (trigger: Trigger) => {
    if (trigger.type === TriggerType.NewWebsiteVisitor) {
      setSelectedTrigger(trigger);
      setIsConfigModalOpen(true);
    } else {
      toast.info('Configuration for this trigger type coming soon!');
    }
  };

  const handleAddTrigger = () => {
    toast.info('Adding new triggers coming soon!');
  };

  const handleConfigureTriggers = () => {
    toast.info('Bulk trigger configuration coming soon!');
  };

  return (
    <>
      <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5" />
              Triggers
            </CardTitle>
            <CardDescription>
              Define when this playbook should be executed
            </CardDescription>
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
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Loading triggers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Failed to load triggers</p>
          </div>
        ) : triggers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {triggers.map((trigger) => {
              const Icon = getTriggerIcon(trigger.type);
              return (
                <div
                  key={trigger.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleTriggerClick(trigger)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${trigger.isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${trigger.isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{trigger.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {trigger.description || `${getTriggerTypeLabel(trigger.type)} trigger`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              No triggers configured yet
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddTrigger}
            >
              <Plus className="mr-2 h-4 w-4" />
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
        setIsConfigModalOpen(false);
        setSelectedTrigger(null);
      }}
      onSuccess={() => refetch()}
    />
    </>
  );
}
