import { useState } from 'react';
import { Page } from '@/components/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, PauseCircle, Plus, Settings, Layers } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { usePlaybookQuery, usePlaybookUpdateMutation } from '../../graphql/operations.generated';
import { toast } from 'sonner';
import { PlaybookDetailSkeleton } from './components/skeleton';
import { EditableText } from '@/components/editable-text';
import { ScenarioModal } from './components/scenario-modal';
import { PlaybookTriggers } from './components/playbook-triggers';

export default function PlaybookDetailPage() {
  const { playbookId } = useParams({ from: '/plays/$playbookId' });
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false);
  
  const { data, loading, refetch } = usePlaybookQuery({
    variables: { id: playbookId }
  });
  
  const [updatePlaybook, { loading: updatePlaybookLoading }] = usePlaybookUpdateMutation();
  
  const playbook = data?.playbook;
  
  const handleTogglePlaybook = async () => {
    if (!playbook) return;
    
    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            isEnabled: !playbook.isEnabled,
          }
        }
      });
      toast.success(
        playbook.isEnabled ? 'Playbook deactivated' : 'Playbook activated',
        {
          description: `${playbook.name} has been ${playbook.isEnabled ? 'deactivated' : 'activated'} successfully`,
        }
      );
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update playbook. ${error.message}`);
    }
  };

  const handleUpdateName = async (newName: string) => {
    if (!playbook) return;
    
    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            name: newName,
          }
        }
      });
      toast.success('Playbook name updated');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update name. ${error.message}`);
      throw error;
    }
  };

  const handleUpdateDescription = async (newDescription: string) => {
    if (!playbook) return;
    
    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            description: newDescription,
          }
        }
      });
      toast.success('Playbook description updated');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to update description. ${error.message}`);
      throw error;
    }
  };

  if (loading) {
    return (
      <Page
        actions={
          <Button variant="outline" onClick={() => navigate({ to: '/plays' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Playbooks
          </Button>
        }
      >
        <PlaybookDetailSkeleton />
      </Page>
    );
  }

  if (!playbook) {
    return (
      <Page
        actions={
          <Button variant="outline" onClick={() => navigate({ to: '/plays' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Playbooks
          </Button>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Playbook not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The requested playbook could not be found. It may have been deleted or you may not have permission to view it.
            </p>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/plays' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            loading={updatePlaybookLoading}
            variant={playbook.isEnabled ? "destructive" : "default"}
            onClick={handleTogglePlaybook}
          >
            {playbook.isEnabled ? (
              <>
                <PauseCircle className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Editable Title and Description */}
        <div className="mb-8 space-y-3">
          <EditableText
            value={playbook.name}
            onSave={handleUpdateName}
            placeholder="Playbook name"
            disabled={updatePlaybookLoading}
            textClassName="text-2xl font-bold"
          />
          <EditableText
            value={playbook.description || ''}
            onSave={handleUpdateDescription}
            variant={'multiLine'}
            placeholder="Playbook description"
            disabled={updatePlaybookLoading}
            textClassName="text-sm text-muted-foreground"
          />
        </div>

        {/* Triggers Card */}
        <PlaybookTriggers playbookId={playbookId} />

        {/* Scenarios Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5" />
                  Scenarios
                </CardTitle>
                <CardDescription>
                  {playbook.scenarios?.length || 0} scenario{playbook.scenarios?.length !== 1 ? 's' : ''} configured
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setCreateScenarioOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Scenario
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {playbook.scenarios && playbook.scenarios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playbook.scenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{scenario.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {scenario.description || 'No description'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScenario(scenario);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
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
          setSelectedScenario(null);
          setCreateScenarioOpen(false);
        }}
        onSuccess={refetch}
      />
    </Page>
  );
}
