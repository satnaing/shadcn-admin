import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Page } from '@/components/page'
import { HubSpotConnectModal } from '@/features/integrations/components/hubspot-connect-modal'
import { SlackConnectModal } from '@/features/integrations/components/slack-connect-modal'
import { useIntegrationsQuery } from '@/graphql/operations/operations.generated'

type Integration = {
  name: string
  app: string
  description: string
  logo: string | React.ReactNode
  Component: React.FC<{
    isOpen: boolean
    onOpenChange: (open: boolean) => void
  }>
}

const ALL_INTEGRATIONS: Integration[] = [
  {
    name: 'HubSpot',
    app: 'HUBSPOT',
    description: 'Connect HubSpot to easily sync accounts between Swan and Hubspot.',
    logo: 'https://logo.clearbit.com/hubspot.com',
    Component: HubSpotConnectModal,
  },
  {
    name: 'Slack',
    app: 'SLACK',
    description: 'Connect Slack to get notifications from Swan directly in your own workspace',
    logo: 'https://logo.clearbit.com/slack.com',
    Component: SlackConnectModal,
  },
]

export function Integrations() {
  const [openModal, setOpenModal] = useState('')
  const { data: integrations } = useIntegrationsQuery()

  const apps = integrations?.integrations?.apps || []

  return (
    <Page
      title="Integrations"
      description="Connect to platforms to seamlessly sync your Swan data"
      mainFixed
    >
      <div className='grid gap-4 pt-6 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {ALL_INTEGRATIONS.map((integration) => {
            const isConnected = apps.includes(integration.app)
            
            return (
              <Card
                key={integration.name}
                className='cursor-pointer transition-shadow hover:shadow-lg'
                onClick={() => setOpenModal(integration.name)}
              >
                <CardHeader>
                  <div className='flex items-center gap-2'>
                    {typeof integration.logo === 'string' ? (
                      <img
                        className='h-8 w-8 rounded-lg'
                        src={integration.logo}
                        alt={`${integration.name} logo`}
                      />
                    ) : (
                      integration.logo
                    )}
                    <CardTitle className='text-lg font-semibold'>
                      {integration.name}
                    </CardTitle>
                  </div>
                  {isConnected && (
                    <Badge variant='default' className='bg-green-100 text-green-800'>
                      Connected
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription>{integration.description}</CardDescription>
                </CardContent>
                
                {openModal === integration.name && (
                  <integration.Component
                    key={integration.name}
                    isOpen={openModal === integration.name}
                    onOpenChange={(open) => !open && setOpenModal('')}
                  />
                )}
              </Card>
            )
          })}
      </div>
    </Page>
  )
}
