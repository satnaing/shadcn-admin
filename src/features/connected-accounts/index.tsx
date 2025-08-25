import { Page } from '@/components/page'
import EmptyState from '@/components/empty-state'
import { AddAccountDropdown } from './components/add-account-dropdown'
import { AccountsTable } from './components/accounts-table'
import { ConnectedAccountsSkeleton } from './components/connected-accounts-skeleton'
import { toast } from 'sonner'
import {
  useConnectedAccountsQuery,
  useConnectAccountUrlMutation,
  useConnectedAccountDeleteMutation,
  ConnectedAccountsDocument,
  useReconnectAccountUrlMutation,
} from './graphql/operations.generated'
import type { MessagingAppType } from '@/graphql/global/types.generated'

export default function ConnectedAccountsPage() {
  const { data, loading, startPolling } = useConnectedAccountsQuery()
  const [del, { loading: delLoading }] = useConnectedAccountDeleteMutation({
    onError: (e) => {
      if (e.graphQLErrors[0]?.extensions?.code === 'VALIDATION_FAILED') {
        toast.error('Error deleting account', {
          description: e.graphQLErrors[0].message,
        })
      }
    },
    refetchQueries: [ConnectedAccountsDocument],
  })
  const [createUrl, { loading: urlLoading }] = useConnectAccountUrlMutation()
  const [createReconnectUrl, { loading: reconnectUrlLoading }] =
    useReconnectAccountUrlMutation()

  const handleConnectAccount = async (
    messagingAppType: MessagingAppType,
    accountId?: string
  ) => {
    const { data } = await createUrl({
      variables: { input: { messagingAppType, ...(accountId && { accountId }) } },
    })
    startPolling(4000)
    window.open(data?.connectedAccountConnectionUrl.url)
  }

  const handleReconnectAccount = async (
    accountId: string,
    messagingAppType: MessagingAppType
  ) => {
    try {
      const { data } = await createReconnectUrl({
        variables: { input: { accountId, messagingAppType } },
      })

      window.open(data?.connectedAccountReconnectionUrl.url)
    } catch (_e) {
      toast.error(`Couldn't reconnect ${messagingAppType.toLowerCase()}`)
    }
  }

  const handleDelete = async (accountId: string, messagingAppType: MessagingAppType) => {
    await del({
      variables: {
        input: {
          id: accountId,
          messagingAppType,
        },
      },
    })
  }

  const hasAccounts = data?.connectedAccounts && data.connectedAccounts.length > 0

  return (
    <Page
      title="Email & LinkedIn Accounts"
      description="Connect accounts you'll use to engage prospects"
      actions={
        hasAccounts ? (
          <AddAccountDropdown
            onConnect={handleConnectAccount}
            loading={urlLoading}
          />
        ) : undefined
      }
      loading={loading}
      skeleton={<ConnectedAccountsSkeleton />}
    >
      <div className="space-y-6">
        {!hasAccounts && (
          <EmptyState
            title="No connected accounts"
            description="Get started by connecting your first account"
            Cta={
              <AddAccountDropdown
                onConnect={handleConnectAccount}
                loading={urlLoading}
              />
            }
          />
        )}
        {hasAccounts && (
          <AccountsTable
            accounts={data.connectedAccounts}
            onReconnect={handleReconnectAccount}
            onConnect={handleConnectAccount}
            onDelete={handleDelete}
            reconnectLoading={reconnectUrlLoading}
            connectLoading={urlLoading}
            deleteLoading={delLoading}
          />
        )}
      </div>
    </Page>
  )
}