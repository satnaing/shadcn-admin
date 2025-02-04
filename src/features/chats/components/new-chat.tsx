import { useEffect, useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChatUser } from '../data/chat-types'

type User = Omit<ChatUser, 'messages'>

type Props = {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function NewChat({ users, onOpenChange, open }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    } else {
      handleRemoveUser(user.id)
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  useEffect(() => {
    if (!open) {
      setSelectedUsers([])
    }
  }, [open])

  const onSubmit = () => {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(selectedUsers, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-sm text-zinc-400'>To:</span>
            {selectedUsers.map((user) => (
              <Badge key={user.id} variant='default'>
                {user.fullName}
                <button
                  className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRemoveUser(user.id)
                    }
                  }}
                  onClick={() => handleRemoveUser(user.id)}
                >
                  <IconX className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            ))}
          </div>
          <Command className='rounded-lg border'>
            <CommandInput
              placeholder='Search people...'
              className='text-foreground'
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelectUser(user)}
                    className='flex items-center justify-between gap-2'
                  >
                    <div className='flex items-center gap-2'>
                      <img
                        src={user.profile || '/placeholder.svg'}
                        alt={user.fullName}
                        className='h-8 w-8 rounded-full'
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>
                          {user.fullName}
                        </span>
                        <span className='text-xs text-zinc-400'>
                          {user.username}
                        </span>
                      </div>
                    </div>

                    {selectedUsers.find((u) => u.id === user.id) && (
                      <IconCheck className='h-4 w-4' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <Button
            variant={'default'}
            onClick={onSubmit}
            disabled={selectedUsers.length === 0}
          >
            Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
