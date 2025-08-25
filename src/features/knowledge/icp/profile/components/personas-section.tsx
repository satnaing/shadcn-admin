import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  MoreVertical, 
  Users, 
  Edit, 
  Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EmptyState from '@/components/empty-state';
import PersonaForm from './persona-form';
import { 
  usePersonasDeleteMutation,
  type PersonaFieldsFragment 
} from '../../graphql/operations.generated';
import { toast } from 'sonner';
import Confirmable from '@/components/confirmable';

const MAX_PERSONAS = 3;

interface PersonasSectionProps {
  targetMarketId: string;
  personas: PersonaFieldsFragment[];
}

export default function PersonasSection({ targetMarketId, personas }: PersonasSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaFieldsFragment | null>(null);
  const [deletePersonas, { loading: deleteLoading }] = usePersonasDeleteMutation({
    refetchQueries: ['TargetMarket', 'Personas'],
  });

  const handleAddPersona = () => {
    setSelectedPersona(null);
    setDialogOpen(true);
  };

  const handleEditPersona = (persona: PersonaFieldsFragment) => {
    setSelectedPersona(persona);
    setDialogOpen(true);
  };

  const handleDeletePersona = async (personaId: string) => {
    try {
      await deletePersonas({
        variables: {
          input: { ids: [personaId] },
        },
      });
      toast.success('Persona deleted successfully');
    } catch (error) {
      toast.error('Error deleting persona', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPersona(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {personas.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Define up to {MAX_PERSONAS} personas for this ICP profile
          </p>
        )}
        <Button
          variant="outline" 
          onClick={handleAddPersona}
          disabled={personas.length >= MAX_PERSONAS}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Persona
        </Button>
      </div>

      {personas.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              Icon={Users}
              title="No personas defined"
              description="Define personas to target specific roles within your ICP"
              ctaText="Add Persona"
              ctaIcon={Plus}
              onCtaClick={handleAddPersona}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <Card key={persona.id} className="relative">
              <CardContent >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{persona.name}</h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPersona(persona)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <Confirmable
                        isLoading={deleteLoading}
                        titleText="Delete Persona?"
                        bodyText="This cannot be undone"
                        buttonText="Delete"
                        variant="danger"
                        onConfirm={() => handleDeletePersona(persona.id)}
                      >
                        <DropdownMenuItem 
                          className="text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </Confirmable>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {persona.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {persona.description}
                  </p>
                )}
                
                {persona.valueProp && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Value Proposition</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {persona.valueProp}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPersona ? 'Edit Persona' : 'Add New Persona'}
            </DialogTitle>
            <DialogDescription>
              Define a specific role or title to target within your ICP
            </DialogDescription>
          </DialogHeader>
          <PersonaForm
            persona={selectedPersona}
            targetMarketId={targetMarketId}
            onSuccess={handleDialogClose}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
