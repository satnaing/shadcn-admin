import { Fragment, useState } from 'react'
import { useIntegrationsQuery } from '@/graphql/operations/operations.generated'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Page } from '@/components/page'
import { SlackConnectModal } from '@/features/tools/components/slack-connect-modal'
import { HubSpotConnectModal } from './components/hubspot-connect-modal'

type Integration = {
  name: string
  app: string
  description: string
  logo: string | React.ReactNode
  Component: React.FC<{
    isOpen: boolean
    onClose: () => void
  }>
}

const ALL_INTEGRATIONS: Integration[] = [
  {
    name: 'HubSpot',
    app: 'HUBSPOT',
    description: 'Allows Swan to read and write to your HubSpot account',
    logo: 'https://logo.clearbit.com/hubspot.com',
    Component: HubSpotConnectModal,
  },
  {
    name: 'Slack',
    app: 'SLACK',
    description: 'Allows Swan to communicate with your team in Slack',
    logo: 'https://logo.clearbit.com/slack.com',
    Component: SlackConnectModal,
  },
]

export function Tools() {
  const [openModal, setOpenModal] = useState('')
  const { data: integrations, loading } = useIntegrationsQuery()

  const apps = integrations?.integrations?.apps || []

  return (
    <Page title='Tools' description="Give Swan access to your team's stack" mainFixed>
      <div className='grid gap-4 pt-6 pb-16 md:grid-cols-2 lg:grid-cols-3'>
        {ALL_INTEGRATIONS.map((integration) => {
          const isConnected = apps.includes(integration.app)

          return (
            <Fragment key={integration.name}>
              <Card
                className='cursor-pointer transition-shadow hover:shadow-lg'
                onClick={() => setOpenModal(integration.name)}
              >
                <CardHeader className='flex items-center justify-between'>
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
                    <CardTitle className='text-lg font-semibold'>{integration.name}</CardTitle>
                  </div>
                  {loading ? (
                    <Skeleton className='h-5 w-20 rounded-md' />
                  ) : (
                    isConnected && (
                      <Badge variant='default' className='bg-green-100 text-green-800'>
                        Connected
                      </Badge>
                    )
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription>{integration.description}</CardDescription>
                </CardContent>
              </Card>
              <integration.Component
                key={integration.name}
                isOpen={openModal === integration.name}
                onClose={() => setOpenModal('')}
              />
            </Fragment>
          )
        })}
      </div>
    </Page>
  )
}
