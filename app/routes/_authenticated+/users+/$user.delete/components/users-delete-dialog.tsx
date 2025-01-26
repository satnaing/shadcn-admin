import { IconAlertTriangle } from '@tabler/icons-react'
import { useState } from 'react'
import { ConfirmDialog } from '~/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { User } from '../../_shared/data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function UsersDeleteDialog({ open, onOpenChange, user }: Props) {
  const [value, setValue] = useState('')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      disabled={value.trim() !== user.username}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">{user.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className="font-bold">{user.role.toUpperCase()}</span> from
            the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter username to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  )
}
