import { format } from 'date-fns'
import type { MessagingAppType } from '@/graphql/global/types.generated'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ConnectedAccountsQuery } from '../graphql/operations.generated'
import { AccountActions } from './account-actions'
import { AccountIcons } from './account-icons'

interface AccountsTableProps {
  accounts: ConnectedAccountsQuery['connectedAccounts']
  onReconnect: (accountId: string, messagingAppType: MessagingAppType) => void
  onConnect: (messagingAppType: MessagingAppType, accountId: string) => void
  onDelete: (accountId: string, messagingAppType: MessagingAppType) => Promise<void>
  reconnectLoading?: boolean
  connectLoading?: boolean
  deleteLoading?: boolean
}

export function AccountsTable({
  accounts,
  onReconnect,
  onConnect,
  onDelete,
  reconnectLoading,
  connectLoading,
  deleteLoading,
}: AccountsTableProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Accounts</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead className='w-[70px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={account.profilePicUrl || ''} />
                    <AvatarFallback>
                      {account.name
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>{account.name}</p>
                    <div className='flex items-center gap-1'>
                      {account.linkedinExternalId && !account.isLinkedinEnabled && (
                        <p className='text-destructive text-xs'>LinkedIn Disconnected</p>
                      )}
                      {account.emailProvider && !account.isEmailEnabled && (
                        <p className='text-destructive text-xs'>Email Disconnected</p>
                      )}
                    </div>
                    <p className='text-muted-foreground text-xs'>{account.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <AccountIcons account={account} onReconnect={onReconnect} onConnect={onConnect} />
              </TableCell>
              <TableCell>
                <span className='text-sm'>{account.email || '-'}</span>
              </TableCell>
              <TableCell>
                <span className='text-sm'>
                  {format(new Date(account.createdAt), 'MMM dd, yyyy')}
                </span>
              </TableCell>
              <TableCell>
                <AccountActions
                  account={account}
                  onReconnect={onReconnect}
                  onDelete={onDelete}
                  loading={reconnectLoading || connectLoading}
                  deleteLoading={deleteLoading}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
