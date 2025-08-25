import { Linkedin, Mail } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MessagingAppType } from '@/graphql/global/types.generated'
import type { ConnectedAccountsQuery } from '../graphql/operations.generated'

interface AccountIconsProps {
  account: ConnectedAccountsQuery['connectedAccounts'][number]
  onReconnect: (accountId: string, messagingAppType: MessagingAppType) => void
  onConnect: (messagingAppType: MessagingAppType, accountId: string) => void
}

export function AccountIcons({ account, onReconnect, onConnect }: AccountIconsProps) {
  const hasLinkedIn = !!account.linkedinExternalId
  const hasEmail = !!account.emailExternalId
  const isLinkedInDisconnected = hasLinkedIn && !account.isLinkedinEnabled
  const isEmailDisconnected = hasEmail && !account.isEmailEnabled

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* LinkedIn Icon */}
        {hasLinkedIn ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`rounded-md p-2 border-2 transition-colors ${
                  isLinkedInDisconnected
                    ? 'border-destructive/50 text-destructive hover:border-destructive hover:text-destructive cursor-pointer'
                    : 'border-primary/30 text-primary cursor-default'
                }`}
                onClick={
                  isLinkedInDisconnected
                    ? () => onReconnect(account.id, MessagingAppType.Linkedin)
                    : undefined
                }
              >
                <Linkedin className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isLinkedInDisconnected
                ? 'LinkedIn disconnected - click to reconnect'
                : 'LinkedIn connected'}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="rounded-md p-2 border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors"
                onClick={() => onConnect(MessagingAppType.Linkedin, account.id)}
              >
                <Linkedin className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Click to connect LinkedIn</TooltipContent>
          </Tooltip>
        )}

        {/* Email Icon */}
        {hasEmail ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`rounded-md p-2 border-2 transition-colors ${
                  isEmailDisconnected
                    ? 'border-destructive/50 text-destructive hover:border-destructive hover:text-destructive cursor-pointer'
                    : 'border-primary/30 text-primary cursor-default'
                }`}
                onClick={
                  isEmailDisconnected
                    ? () => onReconnect(account.id, MessagingAppType.Email)
                    : undefined
                }
              >
                <Mail className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isEmailDisconnected
                ? 'Email disconnected - click to reconnect'
                : 'Email connected'}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="rounded-md p-2 border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-muted-foreground cursor-pointer transition-colors"
                onClick={() => onConnect(MessagingAppType.Email, account.id)}
              >
                <Mail className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Click to connect email</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
