import { MessagingAppType } from '@/graphql/global/types.generated'
import { MoreVertical, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Confirmable from '@/components/confirmable'
import type { ConnectedAccountsQuery } from '../graphql/operations.generated'

interface AccountActionsProps {
  account: ConnectedAccountsQuery['connectedAccounts'][number]
  onReconnect: (accountId: string, messagingAppType: MessagingAppType) => void
  onDelete: (accountId: string, messagingAppType: MessagingAppType) => Promise<void>
  loading?: boolean
  deleteLoading?: boolean
}

export function AccountActions({
  account,
  onReconnect,
  onDelete,
  loading,
  deleteLoading,
}: AccountActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' disabled={loading}>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {account.linkedinExternalId && (
          <DropdownMenuItem
            disabled={loading}
            onClick={() => onReconnect(account.id, MessagingAppType.Linkedin)}
          >
            <Linkedin className='mr-2 h-4 w-4' />
            Reconnect LinkedIn
          </DropdownMenuItem>
        )}
        {account.emailExternalId && (
          <DropdownMenuItem
            disabled={loading}
            onClick={() => onReconnect(account.id, MessagingAppType.Email)}
          >
            <Mail className='mr-2 h-4 w-4' />
            Reconnect Email
          </DropdownMenuItem>
        )}
        {(account.linkedinExternalId || account.emailExternalId) && <DropdownMenuSeparator />}
        {account.linkedinExternalId && (
          <Confirmable
            titleText='Disconnect LinkedIn?'
            bodyText={`You are about to remove the LinkedIn account for "${account.name}". If this account is currently used in a campaign, this action will fail.`}
            buttonText='Disconnect LinkedIn'
            variant='danger'
            isLoading={deleteLoading}
            onConfirm={() => onDelete(account.id, MessagingAppType.Linkedin)}
          >
            <DropdownMenuItem className='text-destructive' onClick={(e) => e.preventDefault()}>
              <Linkedin className='mr-2 h-4 w-4' />
              Disconnect LinkedIn
            </DropdownMenuItem>
          </Confirmable>
        )}
        {account.emailExternalId && (
          <Confirmable
            titleText='Disconnect Email?'
            bodyText={`You are about to remove the email account for "${account.name}". If this account is currently used in a campaign, this action will fail.`}
            buttonText='Disconnect Email'
            variant='danger'
            isLoading={deleteLoading}
            onConfirm={() => onDelete(account.id, MessagingAppType.Email)}
          >
            <DropdownMenuItem className='text-destructive' onClick={(e) => e.preventDefault()}>
              <Mail className='mr-2 h-4 w-4' />
              Disconnect Email
            </DropdownMenuItem>
          </Confirmable>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
