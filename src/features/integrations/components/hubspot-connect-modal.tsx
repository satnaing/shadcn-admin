import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Search, ExternalLink } from 'lucide-react'
import { debounce } from 'lodash'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ConnectedBadge } from '@/features/integrations/components/connected-badge'
import {
  useCrmIntegrationQuery,
  useCrmIntegrationUpdateMutation,
  useCrmListsQuery,
} from '@/graphql/operations/operations.generated'
import type { CrmIntegrationUpdateInput } from '@/graphql/global/types.generated'
import { CrmCompanyCreate, CrmContactCreate } from '@/graphql/global/types.generated'
import { getAuthUrlHandler } from '@/features/integrations/utils/auth-helpers'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
const IS_PROD = import.meta.env.VITE_ENV === 'production'

const SCOPES = [
  'crm.schemas.companies.write',
  'crm.schemas.contacts.write',
  'automation',
  'oauth',
  'crm.objects.contacts.write',
  'crm.objects.companies.write',
  'crm.objects.owners.read',
  'crm.objects.companies.read',
  'crm.schemas.contacts.read',
  'crm.objects.contacts.read',
  'crm.schemas.companies.read',
  'crm.lists.read',
  'crm.lists.write',
  'crm.objects.users.read',
  'crm.objects.deals.read',
  'conversations.read',
  'sales-email-read',
].join(' ')

const OPTIONAL_SCOPES = ['crm.objects.deals.write', 'conversations.write'].join(' ')

const HUBSPOT_CLIENT_ID = IS_PROD
  ? 'b9a7c197-cc7e-4bca-8fb6-223f7e9e69cc'
  : '2068b7d9-4a2c-430e-98c9-1187a81b84a5'

const AUTH_URL =
  `https://app.hubspot.com/oauth/authorize` +
  `?client_id=${HUBSPOT_CLIENT_ID}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&optional_scope=${encodeURIComponent(OPTIONAL_SCOPES)}` +
  `&redirect_uri=${APP_URL}/api/oauth/callback/hubspot`

type HubSpotConnectModalProps = {
  isOpen: boolean
  onClose: () => void
  isConnected: boolean
}

export function HubSpotConnectModal({ isOpen, onClose, isConnected }: HubSpotConnectModalProps) {
  const { toast } = useToast()
  const [query, setQuery] = useState('')

  const {
    data: listsData,
    refetch,
    loading: listsLoading,
  } = useCrmListsQuery({
    skip: !isConnected,
    variables: { q: query },
  })

  const {
    data: crmIntegrationData,
    refetch: refetchCrmIntegration,
  } = useCrmIntegrationQuery()

  const [update, { loading: updateIsLoading }] = useCrmIntegrationUpdateMutation()

  const authUrlHandler = getAuthUrlHandler(AUTH_URL, 'Hubspot Login', () => {
    refetchCrmIntegration()
  })

  const debouncedRefetch = useCallback(
    (q: string) => {
      const debouncedFn = debounce(() => refetch({ q }), 800, { trailing: true })
      debouncedFn()
    },
    [refetch],
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    debouncedRefetch(e.target.value)
  }

  const lists = listsData?.crmLists?.data || []

  const { control, register, reset, watch, handleSubmit } = useForm<CrmIntegrationUpdateInput>({
    defaultValues: {
      enabled: true,
      excludeLists: [],
      excludeContactsWithoutEmail: false,
    },
  })

  useEffect(() => {
    const d = crmIntegrationData?.crmIntegration
    if (d) {
      reset({
        enabled: d.enabled,
        excludeLists: d.excludeLists,
        companiesToCreate: d.companiesToCreate,
        contactsToCreate: d.contactsToCreate,
        notesToCreate: d.notesToCreate,
        excludeContactsWithoutEmail: d.excludeContactsWithoutEmail,
      })
    }
  }, [reset, crmIntegrationData])

  const [companySyncOption, enabled] = watch(['companiesToCreate', 'enabled'])

  const onSubmit = handleSubmit(async (data) => {
    await update({ variables: { input: data } })
    toast({
      title: 'Settings updated',
      description: 'Your HubSpot integration settings have been saved.',
    })
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <div className='flex items-center gap-3'>
              <DialogTitle>HubSpot</DialogTitle>
              {isConnected && <ConnectedBadge />}
            </div>
            <DialogDescription>
              <a
                href='https://swan-ai.notion.site/hubspot-integration'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-primary hover:underline'
              >
                Learn more about this integration <ExternalLink className='h-3 w-3' />
              </a>
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-6'>
            {!isConnected ? (
              <p className='text-sm text-muted-foreground'>
                Connect your Hubspot account to allow for seamless integration with your CRM. Sync
                identified visitors and automatically update your CRM with contact information and
                company research. Connecting will create all the necessary properties for Swan.
              </p>
            ) : (
              <>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='enabled' className='text-base font-semibold'>
                    Enabled
                  </Label>
                  <Switch id='enabled' {...register('enabled')} />
                </div>

                <Separator />

                {/* Exclusion Lists */}
                <div className='space-y-2'>
                  <Label className='text-base font-semibold'>Exclusion Lists</Label>
                  <p className='text-sm text-muted-foreground'>
                    Companies found in the selected lists will be excluded from identification
                  </p>
                  <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search lists...'
                      value={query}
                      onChange={handleSearch}
                      className='pl-8'
                      disabled={!enabled}
                    />
                  </div>
                  <Controller
                    control={control}
                    name='excludeLists'
                    render={({ field }) => (
                      <Select
                        disabled={!enabled || listsLoading}
                        value={field.value?.join(',')}
                        onValueChange={(value) => field.onChange(value ? value.split(',') : [])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select lists...' />
                        </SelectTrigger>
                        <SelectContent>
                          {lists.map((list) => (
                            <SelectItem key={list.listId} value={list.listId}>
                              {list.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <Separator />

                {/* Company Sync Options */}
                <div className='space-y-2'>
                  <Label className='text-base font-semibold'>Companies to Sync</Label>
                  <p className='text-sm text-muted-foreground'>
                    Identified companies will be created/updated on Hubspot based on their domain.
                    Synced data includes all research questions and company information
                  </p>
                  <Controller
                    control={control}
                    name='companiesToCreate'
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!enabled}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={CrmCompanyCreate.All} id='all-companies' />
                          <Label htmlFor='all-companies'>All companies</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value={CrmCompanyCreate.TargetMarket}
                            id='target-companies'
                          />
                          <Label htmlFor='target-companies'>Only companies in my Segments</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={CrmCompanyCreate.None} id='no-companies' />
                          <Label htmlFor='no-companies'>Don't sync companies</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <Separator />

                {/* Contact Sync Options */}
                <div className='space-y-2'>
                  <Label className='text-base font-semibold'>Contacts to Sync</Label>
                  <p className='text-sm text-muted-foreground'>
                    Identified contacts will be created in Hubspot based on their email. Synced data
                    includes all found contact information
                  </p>
                  <Controller
                    control={control}
                    name='contactsToCreate'
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!enabled || companySyncOption === CrmCompanyCreate.None}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={CrmContactCreate.All} id='all-contacts' />
                          <Label htmlFor='all-contacts'>All contacts</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={CrmContactCreate.Visitor} id='visitor-contacts' />
                          <Label htmlFor='visitor-contacts'>Only visitors</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value={CrmContactCreate.None} id='no-contacts' />
                          <Label htmlFor='no-contacts'>Don't sync contacts</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <Separator />

                {/* Contact Email Policy */}
                <div className='space-y-2'>
                  <Label className='text-base font-semibold'>Contact Email Policy</Label>
                  <p className='text-sm text-muted-foreground'>
                    Control whether contacts without email addresses should be synced to Hubspot
                  </p>
                  <Controller
                    control={control}
                    name='excludeContactsWithoutEmail'
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value ? 'true' : 'false'}
                        onValueChange={(val) => field.onChange(val === 'true')}
                        disabled={!enabled || companySyncOption === CrmCompanyCreate.None}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='false' id='sync-all' />
                          <Label htmlFor='sync-all'>Sync all contacts</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='true' id='sync-with-email' />
                          <Label htmlFor='sync-with-email'>Only sync contacts with email addresses</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <Separator />

                {/* Notes Sync Options */}
                <div className='space-y-2'>
                  <Label className='text-base font-semibold'>Session Notes</Label>
                  <p className='text-sm text-muted-foreground'>
                    Add a note to company records listing the session details such as timestamp and
                    pages visited
                  </p>
                  <Controller
                    control={control}
                    name='notesToCreate'
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!enabled || companySyncOption === CrmCompanyCreate.None}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='COMPANY' id='company-notes' />
                          <Label htmlFor='company-notes'>Add notes to company records</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='NONE' id='no-notes' />
                          <Label htmlFor='no-notes'>Don't create notes</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {isConnected ? (
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={(e) => {
                    e.preventDefault()
                    authUrlHandler(e as React.MouseEvent<HTMLElement>)
                  }}
                >
                  Reconnect
                </Button>
                <Button type='submit' disabled={updateIsLoading}>
                  {updateIsLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            ) : (
              <Button
                type='button'
                onClick={(e) => {
                  e.preventDefault()
                  authUrlHandler(e as React.MouseEvent<HTMLElement>)
                }}
              >
                Connect
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
