import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { executionStatuses } from '../data/data'
import { parseSlackMarkdown } from '../utils/slack-markdown-parser'
import { useExecutions } from './executions-provider'

type ExecutionViewDialogProps = {
  open: boolean
}

export function ExecutionViewDialog({ open }: ExecutionViewDialogProps) {
  const { setOpen, currentExecution } = useExecutions()

  if (!currentExecution) return null

  const status = executionStatuses.find((s) => s.value === currentExecution.status)

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className='sm:max-w-[600px]' scrollable>
        <DialogHeader>
          <DialogTitle>Execution Details</DialogTitle>
          <DialogDescription>
            View detailed information about this currentExecution.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>ID</p>
                <p className='font-mono text-sm'>{currentExecution.id}</p>
              </div>

              <div>
                <p className='text-muted-foreground text-sm font-medium'>Status</p>
                <div className='mt-1 flex items-center gap-2'>
                  {status && (
                    <>
                      {status.icon && (
                        <status.icon
                          className={`size-4 ${
                            status.icon.displayName === 'Loader2' ? 'animate-spin' : ''
                          } text-muted-foreground`}
                        />
                      )}
                      <Badge variant='outline'>{status.label}</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>Started At</p>
                <p className='text-sm'>{format(new Date(currentExecution.createdAt), 'PPpp')}</p>
              </div>

              {currentExecution.completedAt && (
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>Completed At</p>
                  <p className='text-sm'>
                    {format(new Date(currentExecution.completedAt), 'PPpp')}
                  </p>
                </div>
              )}
            </div>

            {currentExecution.summary && (
              <>
                <Separator />
                <div>
                  <p className='text-muted-foreground mb-2 text-sm font-medium'>Summary</p>
                  <div className='space-y-1 text-sm'>
                    {parseSlackMarkdown(currentExecution.summary)}
                  </div>
                </div>
              </>
            )}

            {currentExecution.errorMessage && (
              <>
                <Separator />
                <div>
                  <p className='text-muted-foreground mb-2 text-sm font-medium'>Error Message</p>
                  <p className='text-destructive text-sm whitespace-pre-wrap'>
                    {currentExecution.errorMessage}
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>Type</p>
                <p className='text-sm'>{currentExecution.type}</p>
              </div>

              <div>
                <p className='text-muted-foreground text-sm font-medium'>Initiated From</p>
                <p className='text-sm'>{currentExecution.initiatedFrom}</p>
              </div>
            </div>

            {currentExecution.initiatedBy && (
              <div>
                <p className='text-muted-foreground text-sm font-medium'>Initiated By</p>
                <p className='text-sm'>{currentExecution.initiatedBy}</p>
              </div>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
