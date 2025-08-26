import { format } from 'date-fns'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { executionStatuses } from '../data/data'
import { useExecutions } from './executions-provider'
import { parseSlackMarkdown } from '../utils/slack-markdown-parser'

type ExecutionViewDialogProps = {
  open: boolean
}

export function ExecutionViewDialog({ open }: ExecutionViewDialogProps) {
  const { setOpen, currentExecution } = useExecutions()

  if (!currentExecution) return null

  const status = executionStatuses.find(s => s.value === currentExecution.status)

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)} >
      <DialogContent className="sm:max-w-[600px]" scrollable>
        <DialogHeader>
          <DialogTitle>Execution Details</DialogTitle>
          <DialogDescription>
            View detailed information about this currentExecution.
          </DialogDescription>
        </DialogHeader>
        
        <DialogBody>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-sm font-mono">{currentExecution.id}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center gap-2 mt-1">
                {status && (
                  <>
                    {status.icon && (
                      <status.icon 
                        className={`size-4 ${
                          status.icon.displayName === 'Loader2' ? 'animate-spin' : ''
                        } text-muted-foreground`} 
                      />
                    )}
                    <Badge variant="outline">{status.label}</Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Started At</p>
              <p className="text-sm">
                {format(new Date(currentExecution.createdAt), 'PPpp')}
              </p>
            </div>
            
            {currentExecution.completedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed At</p>
                <p className="text-sm">
                  {format(new Date(currentExecution.completedAt), 'PPpp')}
                </p>
              </div>
            )}
          </div>

          {currentExecution.summary && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Summary</p>
                <div className="text-sm space-y-1">
                  {parseSlackMarkdown(currentExecution.summary)}
                </div>
              </div>
            </>
          )}

          {currentExecution.errorMessage && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Error Message</p>
                <p className="text-sm text-destructive whitespace-pre-wrap">{currentExecution.errorMessage}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-sm">{currentExecution.type}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Initiated From</p>
              <p className="text-sm">{currentExecution.initiatedFrom}</p>
            </div>
          </div>

          {currentExecution.initiatedBy && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Initiated By</p>
              <p className="text-sm">{currentExecution.initiatedBy}</p>
            </div>
          )}
        </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
