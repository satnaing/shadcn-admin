import { useNavigate } from '@tanstack/react-router'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
          to: '/agents/$playbookId',
          params: { playbookId: data.playbookCreateFromTemplate.id },
          search: { isNew: true },
        })
      }
    } catch (error: any) {
      toast.error('Failed to create agent', {
        description: error.message || 'Please try again',
      })
    }
  }

  const handleCreateFromScratch = () => {
    navigate({ to: '/agents/new' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[80vh] min-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create a New Agent</DialogTitle>
          <DialogDescription>
            Choose a template to get started quickly, or create your own from scratch.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-6'>
          {loading ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[1, 2, 3, 4].map((skeletonId) => (
                <Card key={`skeleton-${skeletonId}`} className='h-32'>
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
                    Start with a blank agent
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
                  <CardContent className='flex h-32 flex-col items-center justify-center p-6'>
                    {createFromTemplateLoading && <Loader2 className='mb-2 h-4 w-4 animate-spin' />}
                    <h3 className='text-center text-lg font-semibold'>{template.name}</h3>
                    <p className='text-muted-foreground mt-1 line-clamp-2 text-center text-sm'>
                      {template.description || 'No description available'}
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
