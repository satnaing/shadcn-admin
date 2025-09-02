import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { CrmIntegrationUpdateInput } from '@/graphql/global/types.generated'
import {
  useCrmIntegrationQuery,
  useCrmIntegrationUpdateMutation,
} from '@/graphql/operations/operations.generated'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Loadable } from '@/components/loadable'
import { ConnectedBadge } from '@/features/tools/components/connected-badge'
import { getAuthUrlHandler } from '@/features/tools/utils/auth-helpers'

const APP_URL = import.meta.env.VITE_APP_URL
const IS_PROD = import.meta.env.VITE_ENV === 'production'

const SCOPES = [
  'automation',
  'conversations.read',
  'crm.lists.read',
  'crm.lists.write',
  'crm.objects.companies.read',
  'crm.objects.companies.write',
  'crm.objects.contacts.read',
  'crm.objects.contacts.write',
  'crm.objects.deals.read',
  'crm.objects.deals.write',
  'crm.objects.owners.read',
  'crm.objects.products.read',
  'crm.objects.products.write',
  'crm.objects.users.read',
  'crm.schemas.companies.read',
  'crm.schemas.companies.write',
  'crm.schemas.contacts.read',
  'crm.schemas.contacts.write',
  'oauth',
  'sales-email-read',
].join(' ')

const HUBSPOT_CLIENT_ID = IS_PROD
  ? '06687ae8-83e3-4973-a3b6-ed4e1576bc5a'
  : '45f81c64-b017-4f90-8b34-3af1b14573ea'

const AUTH_URL =
  `https://app.hubspot.com/oauth/authorize` +
  `?client_id=${HUBSPOT_CLIENT_ID}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&redirect_uri=${APP_URL}/oauth/callback/hubspot`

type HubSpotConnectModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function HubSpotConnectModal({ isOpen, onOpenChange }: HubSpotConnectModalProps) {
  const {
    data: crmIntegrationData,
    refetch: refetchCrmIntegration,
    loading,
  } = useCrmIntegrationQuery()

  const [update, { loading: updateIsLoading }] = useCrmIntegrationUpdateMutation()

  const authUrlHandler = getAuthUrlHandler(AUTH_URL, 'Hubspot Login', () => {
    refetchCrmIntegration()
  })

  const form = useForm<CrmIntegrationUpdateInput>({
    defaultValues: {
      enabled: true,
    },
  })

  const { setValue, handleSubmit } = form

  useEffect(() => {
    const i = crmIntegrationData?.crmIntegration
    if (i) {
      setValue('enabled', i.enabled)
    }
  }, [setValue, crmIntegrationData])

  const onSubmit = handleSubmit(async (data) => {
    await update({ variables: { input: data } })
    toast.success('Settings updated', {
      description: 'Your HubSpot integration settings have been saved.',
    })
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <div className='flex items-center gap-3'>
                <DialogTitle>HubSpot</DialogTitle>
                {crmIntegrationData?.crmIntegration && <ConnectedBadge />}
              </div>
              <DialogDescription>
                <a
                  href='https://swan-ai.notion.site/hubspot-integration'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary flex items-center gap-1 hover:underline'
                >
                  Learn more about this integration <ExternalLink className='h-3 w-3' />
                </a>
              </DialogDescription>
            </DialogHeader>

            <Loadable isLoading={loading}>
              <div className='space-y-6 py-6'>
                {!crmIntegrationData?.crmIntegration ? (
                  <p className='text-muted-foreground text-sm'>
                    Connect your Hubspot account to allow for seamless integration with your CRM.
                    Sync identified visitors and automatically update your CRM with contact
                    information and company research. Connecting will create all the necessary
                    properties for Swan.
                  </p>
                ) : (
                  <FormField
                    control={form.control}
                    name='enabled'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between'>
                        <FormLabel className='text-base font-semibold'>Enabled</FormLabel>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </Loadable>

            <DialogFooter>
              {crmIntegrationData?.crmIntegration ? (
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
                  <Button type='submit' loading={updateIsLoading}>
                    Save
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
