import { Linkedin, Mail, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessagingAppType } from '@/graphql/global/types.generated'

interface AddAccountDropdownProps {
  onConnect: (messagingAppType: MessagingAppType) => void
  loading?: boolean
}

export function AddAccountDropdown({ onConnect, loading }: AddAccountDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => onConnect(MessagingAppType.Linkedin)}
          disabled={loading}
        >
          <Linkedin className="mr-2 h-4 w-4" />
          Add LinkedIn Account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onConnect(MessagingAppType.Email)}
          disabled={loading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Add Email Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
