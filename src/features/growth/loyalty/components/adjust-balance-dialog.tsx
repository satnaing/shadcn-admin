import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type UserLoyaltyBalance } from '../../data/loyalty-schema'

interface AdjustBalanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserLoyaltyBalance | null
  onConfirm: (amount: number, reason: string, managerPin: string) => void
}

export function AdjustBalanceDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: AdjustBalanceDialogProps) {
  const [amount, setAmount] = useState<number | ''>('')
  const [reason, setReason] = useState('')
  const [managerPin, setManagerPin] = useState('')

  if (!user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof amount === 'number' && amount !== 0 && managerPin.length >= 4) {
      onConfirm(amount, reason, managerPin)
      onOpenChange(false)
      setAmount('')
      setReason('')
      setManagerPin('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adjust Stamps Balance</DialogTitle>
          <DialogDescription>
            Manually credit or debit stamps for{' '}
            <span className='font-medium text-foreground'>{user.userName}</span>
            .
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='amount' className='text-right'>
              Amount
            </Label>
            <Input
              id='amount'
              type='number'
              placeholder='+ / - Stamps'
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || '')}
              className='col-span-3'
              autoFocus
            />
          </div>
          <div className='col-span-4 ml-auto w-3/4 pl-2 text-xs text-muted-foreground'>
            Use positive values to add stamps, negative to deduct.
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='reason' className='text-right'>
              Reason
            </Label>
            <Textarea
              id='reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder='e.g., Compensation for order error'
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='pin' className='text-right'>
              Manager PIN
            </Label>
            <Input
              id='pin'
              type='password'
              placeholder='4-6 digits'
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
              maxLength={6}
              className='col-span-3'
            />
          </div>
          <DialogFooter>
            <Button
              type='submit'
              disabled={!amount || !reason || managerPin.length < 4}
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
