import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useExecutions } from './executions-provider'

type ExecutionCancelDialogProps = {
  open: boolean
}

export function ExecutionCancelDialog({ open }: ExecutionCancelDialogProps) {
  const { setOpen } = useExecutions()

  const handleCancel = () => {
    // TODO: Implement cancel mutation
    // console.log('Cancelling execution:', currentExecution?.id)
    setOpen(null)
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Execution</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this execution? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep running</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>Yes, cancel</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
