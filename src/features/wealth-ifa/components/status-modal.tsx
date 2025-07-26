// components/StatusModal.tsx
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

// import { DialogClose } from '@radix-ui/react-dialog'

interface StatusModalProps {
  name: string
  children: React.ReactNode
  onSubmit: (status: 'approved' | 'rejected') => void
}

export default function StatusModal({
  name,
  children,
  onSubmit,
}: StatusModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-full max-w-xs'>
        <DialogHeader>
          <DialogTitle>Update Status for {name}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col justify-center gap-2 py-4'>
          <Button onClick={() => onSubmit('approved')}>Approve</Button>
          <Button onClick={() => onSubmit('rejected')} variant='destructive'>
            Reject
          </Button>
        </div>
        <DialogFooter>
          {/* <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
