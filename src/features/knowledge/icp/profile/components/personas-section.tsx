import { useState } from 'react'
import { PersonaRole } from '@/graphql/global/types.generated'
import { startCase } from 'lodash'
import { Plus, MoreVertical, Users, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Confirmable from '@/components/confirmable'
import EmptyState from '@/components/empty-state'
import {
  usePersonasDeleteMutation,
  type PersonaFieldsFragment,
} from '../../graphql/operations.generated'
import PersonaForm from './persona-form'

interface PersonasSectionProps {
  targetMarketId: string
  personas: PersonaFieldsFragment[]
}

// Map roles to appropriate badge styles
const getRoleBadgeStyle = (role: PersonaRole): string => {
  const roleStyles: Record<PersonaRole, string> = {
    [PersonaRole.DecisionMaker]:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
    [PersonaRole.Champion]:
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800',
    [PersonaRole.User]:
      'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800',
    [PersonaRole.Influencer]:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
    [PersonaRole.Blocker]:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
    [PersonaRole.BudgetController]:
      'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
    [PersonaRole.TechnicalBuyer]:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800',
  }
  return roleStyles[role] || ''
}

export default function PersonasSection({ targetMarketId, personas }: PersonasSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<PersonaFieldsFragment | null>(null)
  const [deletePersonas, { loading: deleteLoading }] = usePersonasDeleteMutation({
    refetchQueries: ['TargetMarket', 'Personas'],
  })

  const handleAddPersona = () => {
    setSelectedPersona(null)
    setDialogOpen(true)
  }

  const handleEditPersona = (persona: PersonaFieldsFragment) => {
    setSelectedPersona(persona)
    setDialogOpen(true)
  }

  const handleDeletePersona = async (personaId: string) => {
    try {
      await deletePersonas({
        variables: {
          input: { ids: [personaId] },
        },
      })
      toast.success('Persona deleted successfully')
    } catch (error) {
      toast.error('Error deleting persona', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedPersona(null)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        {personas.length > 0 && (
          <p className='text-muted-foreground text-sm'>
            Define who makes up the buying committee for this ICP profile
          </p>
        )}
        <Button variant='outline' onClick={handleAddPersona} size='sm'>
          <Plus className='mr-2 h-4 w-4' />
          Add Persona
        </Button>
      </div>

      {personas.length === 0 ? (
        <Card>
          <CardContent className='py-8'>
            <EmptyState
              Icon={Users}
              title='No personas defined'
              description='Define personas to target specific roles within your ICP'
              ctaText='Add Persona'
              ctaIcon={Plus}
              onCtaClick={handleAddPersona}
            />
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {personas.map((persona) => (
            <Card key={persona.id} className='relative'>
              <CardContent>
                <div className='mb-2 flex items-start justify-between'>
                  <div>
                    <h4 className='font-semibold'>{persona.name}</h4>
                    {(
                      (persona as any).roles ||
                      ((persona as any).role ? [(persona as any).role] : [])
                    ).length > 0 && (
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {((persona as any).roles || [(persona as any).role])
                          .filter(Boolean)
                          .map((role: PersonaRole) => (
                            <Badge
                              key={role}
                              variant='outline'
                              className={cn('border text-xs', getRoleBadgeStyle(role))}
                            >
                              {startCase(role.replace(/_/g, ' ').toLowerCase())}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='-mt-2 -mr-2'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleEditPersona(persona)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                      </DropdownMenuItem>
                      <Confirmable
                        isLoading={deleteLoading}
                        titleText='Delete Persona?'
                        bodyText='This cannot be undone'
                        buttonText='Delete'
                        variant='danger'
                        onConfirm={() => handleDeletePersona(persona.id)}
                      >
                        <DropdownMenuItem
                          className='text-destructive'
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Delete
                        </DropdownMenuItem>
                      </Confirmable>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {persona.description && (
                  <p className='text-muted-foreground mb-2 text-sm'>{persona.description}</p>
                )}

                {persona.valueProp && (
                  <div className='mt-3 border-t pt-3'>
                    <p className='text-muted-foreground mb-1 text-xs font-medium'>
                      Value Proposition
                    </p>
                    <p className='text-muted-foreground line-clamp-3 text-sm'>
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
        <DialogContent className='sm:max-w-[525px]'>
          <DialogHeader>
            <DialogTitle>{selectedPersona ? 'Edit Persona' : 'Add New Persona'}</DialogTitle>
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
  )
}
