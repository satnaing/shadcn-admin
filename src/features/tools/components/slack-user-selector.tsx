import { type Control, Controller, useWatch } from 'react-hook-form'
import { useSlackUsersQuery } from '@/graphql/operations/operations.generated'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loadable } from '@/components/loadable'

interface SlackUserSelectorProps {
  control: Control<any>
  name: string
  channelId?: string
  label?: string
  helperText?: string
  isRequired?: boolean
  isDisabled?: boolean
  onChange?: (value: any) => void
  taggingDisabledFieldName?: string
  onTaggingDisabledChange?: (taggingDisabled: boolean) => void
}

export function SlackUserSelector({
  control,
  name,
  channelId,
  label,
  helperText,
  isDisabled = false,
  onChange,
  taggingDisabledFieldName,
  onTaggingDisabledChange,
}: SlackUserSelectorProps) {
  const { data: slackUsersData, loading: slackUsersLoading } = useSlackUsersQuery({
    variables: { channelId: channelId || '' },
    skip: !channelId,
  })

  // Watch the taggingDisabled field value to control the dropdown state
  const taggingDisabled = useWatch({
    control,
    name: taggingDisabledFieldName || '',
    disabled: !taggingDisabledFieldName,
  })

  const userOptions =
    slackUsersData?.slackUsers
      ?.filter((u) => !u.isBot)
      .map((user) => ({
        value: user.id,
        label: `${user.realName || user.name} (${user.id})`,
      })) || []

  return (
    <div className='space-y-2'>
      <Label className='text-sm font-medium'>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          // Convert string array from form to display value
          const selectedUsers = Array.isArray(field.value) ? field.value : []

          return (
            <div className='space-y-2'>
              <Loadable
                isLoading={!!channelId && !taggingDisabled && slackUsersLoading}
                label='Loading users...'
                className='w-full'
              >
                <div className='border-input bg-background min-h-10 rounded-md border px-3 py-2'>
                  {!channelId ? (
                    <span className='text-muted-foreground text-sm'>Select a channel first</span>
                  ) : taggingDisabled ? (
                    <span className='text-muted-foreground text-sm'>Tagging disabled</span>
                  ) : selectedUsers.length === 0 ? (
                    <span className='text-muted-foreground text-sm'>Select users...</span>
                  ) : (
                    <div className='flex flex-wrap gap-1'>
                      {selectedUsers.map((userId: string) => {
                        const user = userOptions.find((opt) => opt.value === userId)
                        return user ? (
                          <Badge key={userId} variant='secondary' className='text-xs'>
                            {user.label}
                            <button
                              type='button'
                              className='text-muted-foreground hover:text-foreground ml-1'
                              onClick={() => {
                                const newValue = selectedUsers.filter((id) => id !== userId)
                                field.onChange(newValue)
                                onChange?.(newValue)
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </Loadable>

              {channelId && !taggingDisabled && !slackUsersLoading && (
                <Select
                  disabled={isDisabled || !channelId || taggingDisabled}
                  value=''
                  onValueChange={(value) => {
                    if (!selectedUsers.includes(value)) {
                      const newValue = [...selectedUsers, value]
                      field.onChange(newValue)
                      onChange?.(newValue)
                    }
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Add a user...' />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions
                      .filter((opt) => !selectedUsers.includes(opt.value))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}

              {fieldState.error && (
                <p className='text-destructive text-sm'>{fieldState.error.message}</p>
              )}
            </div>
          )
        }}
      />

      {taggingDisabledFieldName && (
        <Controller
          control={control}
          name={taggingDisabledFieldName}
          render={({ field }) => (
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='disable-tagging'
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  onTaggingDisabledChange?.(checked as boolean)
                }}
              />
              <Label
                htmlFor='disable-tagging'
                className='text-muted-foreground text-sm font-normal'
              >
                Disable tagging users in messages
              </Label>
            </div>
          )}
        />
      )}

      <p className='text-muted-foreground text-sm'>
        {channelId ? helperText : 'Please select a channel first to load users'}
      </p>
    </div>
  )
}
