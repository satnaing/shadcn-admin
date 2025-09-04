import { useNavigate } from '@tanstack/react-router'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  usePlaybookTemplatesQuery,
  usePlaybookCreateFromTemplateMutation,
  PlaybooksDocument,
} from '../graphql/operations.generated'

interface PlaybookTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PlaybookTemplatesModal({ isOpen, onClose }: PlaybookTemplatesModalProps) {
  const navigate = useNavigate()
  const { data, loading } = usePlaybookTemplatesQuery({ skip: !isOpen })
  const [createFromTemplate, { loading: createFromTemplateLoading }] =
    usePlaybookCreateFromTemplateMutation({
      refetchQueries: [PlaybooksDocument],
    })

  const templates = data?.playbookTemplates || []

  const handleTemplateSelect = async (templateId: string) => {
    try {
      const { data } = await createFromTemplate({
        variables: {
          input: {
            templateId,
          },
        },
      })

      if (data?.playbookCreateFromTemplate) {
        onClose()
        navigate({
          to: '/plays/$playbookId',
          params: { playbookId: data.playbookCreateFromTemplate.id },
          search: { isNew: true },
        })
      }
    } catch (error: any) {
      toast.error('Failed to create playbook', {
        description: error.message || 'Please try again',
      })
    }
  }

  const handleCreateFromScratch = () => {
    navigate({ to: '/plays/new' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[80vh] min-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create a New Play</DialogTitle>
          <DialogDescription>
            Choose a template to get started quickly, or create your own from scratch.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-6'>
          {loading ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[...Array(4)].map((_, i) => (
                <Card key={`loading-template-skeleton-${i}`} className='h-32'>
                  <CardHeader>
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='mt-2 h-3 w-full' />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* Create from scratch card */}
              <Card
                className={`hover:border-primary cursor-pointer border-2 border-dashed transition-colors ${createFromTemplateLoading ? 'pointer-events-none opacity-50' : ''}`}
                onClick={handleCreateFromScratch}
              >
                <CardContent className='flex h-32 flex-col items-center justify-center p-6'>
                  <Plus className='text-muted-foreground mb-2 h-8 w-8' />
                  <h3 className='text-lg font-semibold'>Create from scratch</h3>
                  <p className='text-muted-foreground mt-1 text-center text-sm'>
                    Start with a blank playbook
                  </p>
                </CardContent>
              </Card>

              {/* Template cards */}
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`hover:border-primary cursor-pointer transition-colors ${createFromTemplateLoading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between text-base'>
                      {template.name}
                      {createFromTemplateLoading && <Loader2 className='h-4 w-4 animate-spin' />}
                    </CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {template.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground text-sm'>
                      {template.scenarioCount} scenario{template.scenarioCount !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
