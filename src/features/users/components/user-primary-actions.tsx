import { useState } from 'react'
import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { UsersActionDialog } from './users-action-dialog'

export function UserPrimaryActions() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className='flex gap-2'>
        <Button variant='outline'>
          Invite User
          <IconMailPlus />
        </Button>
        <Button onClick={() => setOpen(true)}>
          Add User
          <IconUserPlus />
        </Button>
      </div>

      <UsersActionDialog key='user-add' open={open} onOpenChange={setOpen} />
    </>
  )
}
