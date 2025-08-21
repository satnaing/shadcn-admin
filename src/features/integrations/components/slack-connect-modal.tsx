import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { ConnectedBadge } from '@/features/integrations/components/connected-badge'
import { SlackChannelSelector } from '@/features/integrations/components/slack-channel-selector'
import { SlackUserSelector } from '@/features/integrations/components/slack-user-selector'
import { useSlackAuth } from '@/features/integrations/hooks/use-slack-auth'
import {
  useSlackIntegrationQuery,
  useSlackIntegrationUpdateMutation,
} from '@/graphql/operations/operations.generated'
import type { SlackIntegrationUpdateInput } from '@/graphql/global/types.generated'
import { SlackNotificationsType } from '@/graphql/global/types.generated'

type SlackConnectModalProps = {
  isOpen: boolean
  onClose: () => void
  isConnected: boolean
}

export function SlackConnectModal({ isOpen, onClose, isConnected }: SlackConnectModalProps) {
  const { toast } = useToast()

  const {
    data,
    startPolling,
    stopPolling,
    refetch: refetchSlackIntegration,
  } = useSlackIntegrationQuery()

  const [mutate] = useSlackIntegrationUpdateMutation({
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating Slack integration',
        description: error.message,
      })
    },
  })

  const { openSlackAuth } = useSlackAuth({
    onAuthComplete: () => {
      refetchSlackIntegration()
    },
  })

  const connected = isConnected || data?.slackIntegration
  const slackIntegration = data?.slackIntegration

  const { control, reset, getValues } = useForm<SlackIntegrationUpdateInput>()

  useEffect(() => {
    if (!slackIntegration) return

    stopPolling()

    reset({
      notificationsType: slackIntegration.notificationsType,
      enabled: slackIntegration.enabled,
      sendDailyDigest: slackIntegration.sendDailyDigest,
      sendPlayReminders: slackIntegration.sendPlayReminders,
      inboxChannel: slackIntegration.inboxChannel,
    })
  }, [slackIntegration, stopPolling, reset])

  const onSubmit = () => {
    mutate({ variables: { input: getValues() } }).then(() => {
      toast({
        title: 'Settings updated',
        description: 'Your Slack integration settings have been saved.',
      })
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <DialogTitle>Slack</DialogTitle>
            {connected && <ConnectedBadge />}
          </div>
        </DialogHeader>

        <div className='space-y-6 py-6'>
          {!connected ? (
            <>
              <DialogDescription>
                Connect your Slack workspace to receive real-time notifications when visitors are
                identified, and to interact directly with the Swan agent through Slack. Ask
                questions about visitors, get insights about companies, and manage your visitor
                identification settings - all without leaving your workspace.
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
                <div className='rounded-md border bg-muted/50 p-3'>
                  <p className='text-sm'>{slackIntegration?.channelName}</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-3'>
                <Label className='text-base font-semibold'>Notifications</Label>
                <Controller
                  control={control}
                  name='notificationsType'
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e)
                        onSubmit()
                      }}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value={SlackNotificationsType.OnlyTargetMarket}
                          id='target-notifications'
                        />
                        <Label htmlFor='target-notifications' className='text-sm font-normal'>
                          Notify me only on companies in my Segments
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value={SlackNotificationsType.All}
                          id='all-notifications'
                        />
                        <Label htmlFor='all-notifications' className='text-sm font-normal'>
                          Notify me on all identifications
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <Separator />

              <div className='space-y-3'>
                <Label className='text-base font-semibold'>Digests</Label>
                <Controller
                  control={control}
                  name='sendDailyDigest'
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value?.toString()}
                      onValueChange={(e) => {
                        field.onChange(e === 'true')
                        onSubmit()
                      }}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='true' id='daily-digest-on' />
                        <Label htmlFor='daily-digest-on' className='text-sm font-normal'>
                          Send daily digest with a summary of the last 24H
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='false' id='daily-digest-off' />
                        <Label htmlFor='daily-digest-off' className='text-sm font-normal'>
                          Off
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <Separator />

              <div className='space-y-3'>
                <Label className='text-base font-semibold'>Reminders</Label>
                <Controller
                  control={control}
                  name='sendPlayReminders'
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value?.toString()}
                      onValueChange={(e) => {
                        field.onChange(e === 'true')
                        onSubmit()
                      }}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='true' id='reminders-on' />
                        <Label htmlFor='reminders-on' className='text-sm font-normal'>
                          Get reminders from Swan about contacts without Plays
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='false' id='reminders-off' />
                        <Label htmlFor='reminders-off' className='text-sm font-normal'>
                          Off
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
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

                {getValues('inboxChannel')?.id && (
                  <SlackUserSelector
                    control={control}
                    name='inboxChannel.userIdsToTag'
                    channelId={getValues('inboxChannel')?.id}
                    label='Users to Notify'
                    helperText='Select specific users to tag for new messages in the inbox channel. Leave empty to tag all channel members'
                    taggingDisabledFieldName='inboxChannel.taggingDisabled'
                    onTaggingDisabledChange={() => onSubmit()}
                    onChange={() => onSubmit()}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <div className='flex gap-2'>
            {connected && (
              <Button type='button' variant='outline' onClick={openSlackAuth}>
                Reconnect
              </Button>
            )}
            {connected ? (
              <Button onClick={onClose}>Done</Button>
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
