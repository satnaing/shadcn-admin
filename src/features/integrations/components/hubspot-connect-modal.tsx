import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { ConnectedBadge } from '@/features/integrations/components/connected-badge'
import {
  useCrmIntegrationQuery,
  useCrmIntegrationUpdateMutation,
} from '@/graphql/operations/operations.generated'
import type { CrmIntegrationUpdateInput } from '@/graphql/global/types.generated'
import { getAuthUrlHandler } from '@/features/integrations/utils/auth-helpers'
import { Loadable } from '@/components/loadable'

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
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
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
                className='flex items-center gap-1 text-primary hover:underline'
              >
                Learn more about this integration <ExternalLink className='h-3 w-3' />
              </a>
            </DialogDescription>
          </DialogHeader>

        <Loadable isLoading={loading}>  
          <div className='space-y-6 py-6'>
            {!crmIntegrationData?.crmIntegration ? (
              <p className='text-sm text-muted-foreground'>
                Connect your Hubspot account to allow for seamless integration with your CRM. Sync
                identified visitors and automatically update your CRM with contact information and
                company research. Connecting will create all the necessary properties for Swan.
              </p>
            ) : (
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-between'>
                      <FormLabel className='text-base font-semibold'>
                        Enabled
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
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
