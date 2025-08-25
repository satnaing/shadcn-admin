import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  PauseCircle,
  Plus, 
  MoreVertical,
  Clock,
  Layers,
  Calendar
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from '@tanstack/react-router';
import EmptyState from '@/components/empty-state';
import { usePlaybooksQuery, usePlaybookUpdateMutation } from './graphql/operations.generated';
import { toast } from 'sonner';
import { Page } from '@/components/page';
import { format } from 'date-fns';
import PlaybooksSkeleton from './components/playbooks-skeleton';

export default function PlaybooksPage() {
  const navigate = useNavigate();
  const { data, loading, refetch } = usePlaybooksQuery();
  const [updatePlaybook] = usePlaybookUpdateMutation();

  const playbooks = data?.playbooks || [];

  const handleCardClick = (playbookId: string) => {
    navigate({ to: '/plays/$playbookId', params: { playbookId } });
  };

  const handleTogglePlaybook = async (e: React.MouseEvent, playbook: any) => {
    e.stopPropagation();
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





  if (loading) {
    return (
      <Page 
        title="Plays" 
        description="Automate your workflow processes with plays"
      >
        <PlaybooksSkeleton />
      </Page>
    );
  }

  if (playbooks.length === 0) {
    return (
      <Page
        title="Plays"
        description="Automate your workflow processes with plays"
      >
        <EmptyState
          Icon={PlayCircle}
          title="No plays created"
          description="Get started by creating your first play"
          ctaText="Create Play"
          ctaIcon={Plus}
          onCtaClick={() => navigate({ to: '/plays/new' })}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Plays"
      description="Automate your workflow processes with plays"
      actions={
        <Button onClick={() => navigate({ to: '/plays/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Play
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playbooks.map((playbook) => (
          <Card 
            key={playbook.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(playbook.id)}
          >
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{playbook.name}</h3>
                    <Badge 
                      variant={playbook.isEnabled ? 'default' : 'secondary'}
                      className={playbook.isEnabled ? 'bg-green-500' : ''}
                    >
                      {playbook.isEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {playbook.description || 'No description'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => handleTogglePlaybook(e, playbook)}
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
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {playbook.scenarioCount} scenario{playbook.scenarioCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Created {format(new Date(playbook.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                
                {playbook.updatedAt && playbook.updatedAt !== playbook.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Last updated {format(new Date(playbook.updatedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  );
}
