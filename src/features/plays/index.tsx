import { useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { PlayCircle, PauseCircle, Plus, MoreVertical, Clock, Calendar } from 'lucide-react'
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
import PlaybookTemplatesModal from './components/playbook-templates-modal'
import PlaybooksSkeleton from './components/playbooks-skeleton'
import { usePlaybooksQuery, usePlaybookUpdateMutation } from './graphql/operations.generated'

export default function PlaybooksPage() {
  const navigate = useNavigate()
  const { data, loading, refetch } = usePlaybooksQuery()
  const [updatePlaybook] = usePlaybookUpdateMutation()
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)

  const playbooks = (data?.playbooks || []).filter((playbook) => !playbook.deletedAt)

  const handleCardClick = (playbookId: string) => {
    navigate({ to: '/agents/$playbookId', params: { playbookId } })
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
      toast.success(playbook.isEnabled ? 'Agent deactivated' : 'Agent activated', {
        description: `${playbook.name} has been ${playbook.isEnabled ? 'deactivated' : 'activated'} successfully`,
      })
      refetch()
    } catch (error: any) {
      toast.error(`Failed to update agent. ${error.message}`)
    }
  }

  if (loading) {
    return (
      <Page title='Agents' description='Intelligent AI agents that help you grow your business'>
        <PlaybooksSkeleton />
      </Page>
    )
  }

  if (playbooks.length === 0) {
    return (
      <Page title='Agents' description='Intelligent AI agents that help you grow your business'>
        <EmptyState
          Icon={PlayCircle}
          title='No agents created'
          description='Get started by creating your first agent'
          ctaText='Create Agent'
          ctaIcon={Plus}
          onCtaClick={() => setIsTemplatesModalOpen(true)}
        />

        <PlaybookTemplatesModal
          isOpen={isTemplatesModalOpen}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      </Page>
    )
  }

  return (
    <Page
      title='Agents'
      description='Intelligent AI agents that help you grow your business'
      actions={
        <Button onClick={() => setIsTemplatesModalOpen(true)}>
          <Plus className='h-4 w-4' />
          Create Agent
        </Button>
      }
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {playbooks.map((playbook, index) => (
          <Card
            key={playbook.id}
            className='animate-fade-in-up cursor-pointer overflow-hidden opacity-0 transition-shadow hover:shadow-lg'
            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
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

              <div className='text-muted-foreground mt-4 flex items-center gap-4 text-xs'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>Created {format(new Date(playbook.createdAt), 'MMM dd')}</span>
                </div>
                {playbook.updatedAt && playbook.updatedAt !== playbook.createdAt && (
                  <div className='flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    <span>Updated {format(new Date(playbook.updatedAt), 'MMM dd')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlaybookTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
      />
    </Page>
  )
}
