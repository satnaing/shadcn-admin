import { Fragment, useState } from 'react'
import { useIntegrationsQuery } from '@/graphql/operations/operations.generated'
import { Globe, Search, Building2, Linkedin, Mail, GitBranch } from 'lucide-react'
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
    description: 'Allows Swan to communicate, send alerts and ask for approval in Slack',
    logo: 'https://logo.clearbit.com/slack.com',
    Component: SlackConnectModal,
  },
]

type BuiltInTool = {
  name: string
  description: string
  icon: React.ReactNode
}

const BUILT_IN_TOOLS: BuiltInTool[] = [
  {
    name: 'Web Research',
    description: 'Search and analyze web content to gather insights about prospects and markets',
    icon: <Globe className='h-5 w-5 text-blue-600' />,
  },
  {
    name: 'Contact Search & Enrichment',
    description: 'Find and enrich contact information with verified data from multiple sources',
    icon: <Search className='h-5 w-5 text-purple-600' />,
  },
  {
    name: 'Company Enrichment',
    description: 'Enrich company data including technographics and firmographics',
    icon: <Building2 className='h-5 w-5 text-green-600' />,
  },
  {
    name: 'LinkedIn Outreach',
    description: 'Send personalized connection requests and messages on LinkedIn',
    icon: <Linkedin className='h-5 w-5 text-blue-700' />,
  },
  {
    name: 'Email Outreach',
    description: 'Send personalized emails with advanced deliverability and tracking',
    icon: <Mail className='h-5 w-5 text-orange-600' />,
  },
  {
    name: 'Sequencing',
    description: 'Create multi-channel campaigns combining email and LinkedIn touchpoints',
    icon: <GitBranch className='h-5 w-5 text-indigo-600' />,
  },
]

export function Tools() {
  const [openModal, setOpenModal] = useState('')
  const { data: integrations, loading } = useIntegrationsQuery()

  const apps = integrations?.integrations?.apps || []

  return (
    <Page title={'Integrations'} description={'Connect Swan to your existing tools and workflows'}>
      <div className='space-y-8 pb-16'>
        {/* Integrations Section */}
        <div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
        </div>

        {/* Built-in Tools Section */}
        <div>
          <h2 className='mb-2 text-2xl font-bold'>Built In</h2>
          <p className='text-muted-foreground mb-6 text-sm'>
            Core capabilities that come pre-built with Swan
          </p>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {BUILT_IN_TOOLS.map((tool) => (
              <Card key={tool.name} className='relative'>
                <CardHeader className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='rounded-lg bg-gray-100 p-2'>{tool.icon}</div>
                    <CardTitle className='text-lg font-semibold'>{tool.name}</CardTitle>
                  </div>
                  <Badge variant='secondary' className='bg-green-100 text-green-800'>
                    Enabled
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}
