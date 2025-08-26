import { useParams, useLocation } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Page } from '@/components/page'
import { useTargetMarketQuery } from '../graphql/operations.generated'
import ICPForm from './components/icp-form'
import { ICPProfileSkeleton } from './components/icp-profile-skeleton'
import PersonasSection from './components/personas-section'

export default function ICPProfilePage() {
  const location = useLocation()
  const isNewRoute = location.pathname === '/knowledge/icp/new'

  // Always call useParams, but only use it if not on new route
  let profileId: string | undefined
  try {
    const params = useParams({ from: '/knowledge/icp/$profileId' })
    profileId = isNewRoute ? undefined : params.profileId
  } catch {
    // If useParams fails (e.g., on /new route), profileId remains undefined
    profileId = undefined
  }

  const isNew = !profileId || profileId === 'new'

  const { data, loading } = useTargetMarketQuery({
    variables: { id: profileId || '' },
    skip: !profileId || isNew,
  })

  if (loading && !isNew) {
    return (
      <Page title='ICP Profile' backPath='/knowledge/icp'>
        <ICPProfileSkeleton />
      </Page>
    )
  }

  return (
    <Page
      title={isNew ? 'New ICP Profile' : data?.targetMarket?.name || 'ICP Profile'}
      description={isNew ? 'Create a new Ideal Customer Profile' : ''}
      backPath='/knowledge/icp'
    >
      <div className='grid gap-6 sm:max-w-[100%] md:max-w-[80%]'>
        <Separator className='mb-0' />
        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ICPForm profile={data?.targetMarket} isNew={isNew} />
          </CardContent>
        </Card>

        {/* Personas Card */}
        {!isNew && data?.targetMarket && (
          <Card>
            <CardHeader>
              <CardTitle>Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonasSection
                targetMarketId={data.targetMarket.id}
                personas={data.targetMarket.personas || []}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Page>
  )
}
