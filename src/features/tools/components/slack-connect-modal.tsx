import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { SlackIntegrationUpdateInput } from '@/graphql/global/types.generated'
import {
  useSlackIntegrationQuery,
  useSlackIntegrationUpdateMutation,
} from '@/graphql/operations/operations.generated'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loadable } from '@/components/loadable'
import { ConnectedBadge } from '@/features/tools/components/connected-badge'
import { SlackChannelSelector } from '@/features/tools/components/slack-channel-selector'
import { useSlackAuth } from '@/features/tools/hooks/use-slack-auth'

type SlackConnectModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SlackConnectModal({ isOpen, onOpenChange }: SlackConnectModalProps) {
  const {
    data,
    loading,
    startPolling,
    stopPolling,
    refetch: refetchSlackIntegration,
  } = useSlackIntegrationQuery()

  const [mutate] = useSlackIntegrationUpdateMutation({
    onError: (error) => {
      toast.error('Error updating Slack integration', {
        description: error.message,
      })
    },
  })

  const { openSlackAuth } = useSlackAuth({
    onAuthComplete: () => {
      refetchSlackIntegration()
    },
  })

  const connected = data?.slackIntegration
  const slackIntegration = data?.slackIntegration

  const { control, reset, getValues } = useForm<SlackIntegrationUpdateInput>()

  useEffect(() => {
    if (!slackIntegration) return

    stopPolling()

    reset({
      enabled: slackIntegration.enabled,
      inboxChannel: slackIntegration.inboxChannel,
    })
  }, [slackIntegration, stopPolling, reset])

  const onSubmit = () => {
    mutate({ variables: { input: getValues() } }).then(() => {
      toast.success('Settings updated', {
        description: 'Your Slack integration settings have been saved.',
      })
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <DialogTitle>Slack</DialogTitle>
            {connected && <ConnectedBadge />}
          </div>
        </DialogHeader>

        <Loadable isLoading={loading}>
          <div className='space-y-6 py-6'>
            {!connected ? (
              <>
                <DialogDescription>
                  Connect your Slack workspace to interact directly with the Swan agent through
                  Slack. Ask questions about playbooks, get insights about companies and contacts,
                  and manage your playbook settings - all without leaving your workspace.
                </DialogDescription>

                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    When selecting a private channel, please make sure to add Swan to channel after
                    completing the integration. Feel free to reach out at hello@getswan.com if you
                    need help.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <div className='space-y-2'>
                  <Label className='text-sm font-semibold'>Connected channel</Label>
                  <div className='bg-muted/50 rounded-md border p-3'>
                    <p className='text-sm'>{slackIntegration?.channelName}</p>
                  </div>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <SlackChannelSelector
                    control={control}
                    name='inboxChannel'
                    label='Inbox Channel'
                    helperText='Select a channel for Play related messages and approvals'
                    onChange={() => onSubmit()}
                  />
                </div>
              </>
            )}
          </div>
        </Loadable>

        <DialogFooter>
          <div className='flex gap-2'>
            {connected && (
              <Button type='button' variant='outline' onClick={openSlackAuth}>
                Reconnect
              </Button>
            )}
            {connected ? (
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            ) : (
              <Button
                onClick={(e) => {
                  openSlackAuth(e)
                  startPolling(5000)
                }}
              >
                Connect
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
