import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { TargetMarketType } from '@/graphql/global/types.generated'
import { Building2, Users, DollarSign, Plus, MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Confirmable from '@/components/confirmable'
import EmptyState from '@/components/empty-state'
import { Page } from '@/components/page'
import AddICPButton from './components/add-icp-button'
import DataDisplay from './components/data-display'
import ICPSkeleton from './components/icp-skeleton'
import { COLOR_MAP } from './constants'
import {
  useTargetMarketsQuery,
  useTargetMarketDeleteMutation,
} from './graphql/operations.generated'
import { formatNumber } from './utils'

export default function ICPPage() {
  const navigate = useNavigate()
  const { data, loading, refetch } = useTargetMarketsQuery()
  const [deleteMarket, { loading: deleteLoading }] = useTargetMarketDeleteMutation()
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<string | false>(false)

  const icpProfiles = (data?.targetMarkets || []).filter(
    (market) => market.type === TargetMarketType.Segment
  )

  const handleCardClick = (profileId: string) => {
    navigate({ to: '/knowledge/icp/$profileId', params: { profileId } })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMarket({ variables: { input: { id } } })
      toast.success('ICP profile deleted', {
        description: 'The ICP profile has been deleted successfully',
      })
      refetch()
    } catch (error: any) {
      toast.error(`Failed to delete ICP profile. ${error.message}`)
    }
    setDeleteConfirmationOpen(false)
  }

  if (loading) {
    return (
      <Page
        title='Ideal Customer Profiles'
        description='Ideal customer profiles help Swan understand what types of companies you are targeting.'
        mainFixed
      >
        <ICPSkeleton />
      </Page>
    )
  }

  if (icpProfiles.length === 0) {
    return (
      <Page
        title='Ideal Customer Profiles'
        description='Ideal customer profiles help Swan understand what types of companies you are targeting.'
      >
        <EmptyState
          Icon={Building2}
          title='No ICP profiles defined'
          description='Get started by defining your first profile'
          ctaText='Create ICP Profile'
          ctaIcon={Plus}
          onCtaClick={() => navigate({ to: '/knowledge/icp/new' })}
        />
      </Page>
    )
  }

  return (
    <Page
      title='Ideal Customer Profiles'
      description='Ideal customer profiles help Swan understand what types of companies you are targeting.'
      actions={<AddICPButton icpProfiles={icpProfiles} />}
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {icpProfiles.map((profile) => (
          <Card
            key={profile.id}
            className='cursor-pointer overflow-hidden transition-shadow hover:shadow-lg'
            onClick={() => handleCardClick(profile.id)}
            style={{
              borderTop: `4px solid ${profile.color ? COLOR_MAP[profile.color] : '#e5e7eb'}`,
            }}
          >
            <CardContent className='flex h-full flex-col'>
              <div className='mb-4 flex items-start justify-between'>
                <h3 className='text-lg font-semibold'>{profile.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <Confirmable
                      onConfirm={() => handleDelete(profile.id)}
                      isOpen={deleteConfirmationOpen === profile.id}
                      onCancel={() => setDeleteConfirmationOpen(false)}
                      titleText='Delete ICP Profile'
                      bodyText='Are you sure you want to delete this ICP profile? This action cannot be undone.'
                      buttonText='Delete'
                      variant='danger'
                      isLoading={deleteLoading}
                    >
                      <DropdownMenuItem
                        className='text-destructive'
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setDeleteConfirmationOpen(profile.id)
                        }}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                    </Confirmable>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className='flex-1 overflow-hidden'>
                <p className='text-muted-foreground line-clamp-4 text-sm'>
                  {profile.extraRequirements || 'No description available'}
                </p>
              </div>

              <div className='mt-auto flex items-center justify-between pt-3'>
                <DataDisplay
                  icon={Users}
                  label={
                    (!profile.minEmployees || profile.minEmployees === 0) && !profile.maxEmployees
                      ? 'Any size'
                      : !profile.maxEmployees
                        ? `${formatNumber(profile.minEmployees || 0)}+`
                        : `${formatNumber(profile.minEmployees || 0)} - ${formatNumber(profile.maxEmployees)}`
                  }
                />
                <DataDisplay
                  icon={DollarSign}
                  label={
                    (!profile.minRevenue || profile.minRevenue === 0) && !profile.maxRevenue
                      ? 'Any revenue'
                      : !profile.maxRevenue
                        ? `$${formatNumber(profile.minRevenue || 0)}+`
                        : `$${formatNumber(profile.minRevenue || 0)} - $${formatNumber(profile.maxRevenue)}`
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  )
}
