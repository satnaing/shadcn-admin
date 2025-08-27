import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { PlayCircle, PauseCircle, Plus, MoreVertical, Clock, Layers, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EmptyState from '@/components/empty-state'
import { Page } from '@/components/page'
import PlaybooksSkeleton from './components/playbooks-skeleton'
import { usePlaybooksQuery, usePlaybookUpdateMutation } from './graphql/operations.generated'

export default function PlaybooksPage() {
  const navigate = useNavigate()
  const { data, loading, refetch } = usePlaybooksQuery()
  const [updatePlaybook] = usePlaybookUpdateMutation()

  const playbooks = data?.playbooks || []

  const handleCardClick = (playbookId: string) => {
    navigate({ to: '/plays/$playbookId', params: { playbookId } })
  }

  const handleTogglePlaybook = async (e: React.MouseEvent, playbook: any) => {
    e.stopPropagation()
    try {
      await updatePlaybook({
        variables: {
          input: {
            id: playbook.id,
            isEnabled: !playbook.isEnabled,
          },
        },
      })
      toast.success(playbook.isEnabled ? 'Playbook deactivated' : 'Playbook activated', {
        description: `${playbook.name} has been ${playbook.isEnabled ? 'deactivated' : 'activated'} successfully`,
      })
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update playbook. ${error.message}`)
    }
  }

  if (loading) {
    return (
      <Page title='Plays' description='Automate your workflow processes with plays'>
        <PlaybooksSkeleton />
      </Page>
    )
  }

  if (playbooks.length === 0) {
    return (
      <Page title='Plays' description='Automate your workflow processes with plays'>
        <EmptyState
          Icon={PlayCircle}
          title='No plays created'
          description='Get started by creating your first play'
          ctaText='Create Play'
          ctaIcon={Plus}
          onCtaClick={() => navigate({ to: '/plays/new' })}
        />
      </Page>
    )
  }

  return (
    <Page
      title='Plays'
      description='Automate your workflow processes with plays'
      // actions={
      //   <Button onClick={() => navigate({ to: '/plays/new' })}>
      //     <Plus className='mr-2 h-4 w-4' />
      //     Create Play
      //   </Button>
      // }
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {playbooks.map((playbook) => (
          <Card
            key={playbook.id}
            className='cursor-pointer overflow-hidden transition-shadow hover:shadow-lg'
            onClick={() => handleCardClick(playbook.id)}
          >
            <CardContent>
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <h3 className='text-lg font-semibold'>{playbook.name}</h3>
                    <div
                      className={`h-2 w-2 rounded-full ${playbook.isEnabled ? 'bg-green-500' : 'bg-yellow-500'}`}
                    />
                  </div>
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    {playbook.description || 'No description'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={(e) => handleTogglePlaybook(e, playbook)}>
                      {playbook.isEnabled ? (
                        <>
                          <PauseCircle className='mr-2 h-4 w-4' />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <PlayCircle className='mr-2 h-4 w-4' />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1.5'>
                    <Layers className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground'>
                      {playbook.scenarioCount} scenario
                      {playbook.scenarioCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground'>
                      Created {format(new Date(playbook.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {playbook.updatedAt && playbook.updatedAt !== playbook.createdAt && (
                  <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                    <Clock className='h-3 w-3' />
                    <span>Last updated {format(new Date(playbook.updatedAt), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  )
}
