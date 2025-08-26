import { useState } from 'react'
import { type Control, Controller } from 'react-hook-form'
import {
  useSlackIntegrationQuery,
  useSlackChannelsQuery,
} from '@/graphql/operations/operations.generated'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SlackChannelSelectorProps {
  control: Control<any>
  name: string
  label?: string
  helperText?: string
  isRequired?: boolean
  isDisabled?: boolean
  onChange?: (value: any) => void
}

export function SlackChannelSelector({
  control,
  name,
  label = 'Notification Channel',
  helperText = 'Select a channel for notifications',
  isDisabled = false,
  onChange,
}: SlackChannelSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<'list' | 'id'>('list')
  const { data: slackData } = useSlackIntegrationQuery()
  const { data: slackChannelsData, loading: slackChannelsLoading } = useSlackChannelsQuery({})

  const channelOptions =
    slackChannelsData?.slackChannels?.map((channel) => ({
      value: channel.id,
      label: `#${channel.name}${
        channel.id === slackData?.slackIntegration?.channelId ? ' (Default Channel)' : ''
      }`,
      name: channel.name,
    })) || []

  const validateChannelId = (id: string): string | boolean => {
    if (!id) return 'ID is required'

    if (id.length !== 11) {
      return 'Channel ID must be 11 characters long'
    }

    if (!id.startsWith('C')) {
      return 'This looks like a private channel. Only public channels are supported.'
    }

    return true
  }

  return (
    <div className='space-y-2'>
      <Label className='text-sm font-medium'>{label}</Label>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: (value) => {
            if (selectionMode === 'id') {
              return validateChannelId(value?.id || '')
            }
            return true
          },
        }}
        render={({ field, fieldState }) => {
          // Add current value as an option if it exists but isn't in the options list
          const enhancedOptions = [...channelOptions]
          const currentValueMissing =
            field.value?.id && !channelOptions.some((option) => option.value === field.value.id)

          if (currentValueMissing) {
            enhancedOptions.push({
              value: field.value.id,
              label: `#${field.value.name || field.value.id}`,
              name: field.value.name || field.value.id,
            })
          }

          return (
            <div className='space-y-2'>
              <div className='flex gap-2'>
                <Select
                  value={selectionMode}
                  onValueChange={(value) => setSelectionMode(value as 'list' | 'id')}
                  disabled={isDisabled || !slackData?.slackIntegration?.enabled}
                >
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='list'>From List</SelectItem>
                    <SelectItem value='id'>By ID</SelectItem>
                  </SelectContent>
                </Select>

                {selectionMode === 'list' ? (
                  <Select
                    disabled={
                      isDisabled || !slackData?.slackIntegration?.enabled || slackChannelsLoading
                    }
                    value={field.value?.id}
                    onValueChange={(value) => {
                      const option = enhancedOptions.find((opt) => opt.value === value)
                      const newValue = option
                        ? {
                            id: option.value,
                            name: option.name,
                          }
                        : null
                      field.onChange(newValue)
                      onChange?.(newValue)
                    }}
                  >
                    <SelectTrigger className='flex-1'>
                      <SelectValue placeholder='Select a Slack channel...' />
                    </SelectTrigger>
                    <SelectContent>
                      {enhancedOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className='flex flex-1 items-center gap-2'>
                    <Input
                      placeholder='Enter channel ID'
                      value={field.value?.id || ''}
                      disabled={isDisabled || !slackData?.slackIntegration?.enabled}
                      onChange={(e) => {
                        const newValue = {
                          id: e.target.value,
                          name: e.target.value,
                        }
                        field.onChange(newValue)
                        onChange?.(newValue)
                      }}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Info className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className='max-w-xs'>
                          <p>
                            To find a channel ID in Slack, right-click on the channel and select
                            'View channel details'. The channel ID appears at the bottom of the
                            window that opens, right under 'Leave Channel'.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

              {fieldState.error && (
                <p className='text-destructive text-sm'>{fieldState.error.message}</p>
              )}

              <p className='text-muted-foreground text-sm'>
                {helperText}. If you can't find the channel in the list, add the channel by ID.
              </p>
            </div>
          )
        }}
      />
    </div>
  )
}
