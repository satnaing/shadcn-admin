import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Globe, 
  Plus, 
  MoreVertical,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import DataDisplay from './components/data-display';
import AddICPButton from './components/add-icp-button';
import ICPSkeleton from './components/icp-skeleton';
import Confirmable from '@/components/confirmable';
import EmptyState from '@/components/empty-state';
import { useTargetMarketsQuery, useTargetMarketDeleteMutation } from './graphql/operations.generated';
import { TargetMarketType } from '@/graphql/global/types.generated';
import { formatNumber } from './utils';
import { toast } from 'sonner';
import { COLOR_MAP } from './constants';
import { Page } from '@/components/page';

export default function ICPPage() {
  const navigate = useNavigate();
  const { data, loading, refetch } = useTargetMarketsQuery();
  const [deleteMarket, { loading: deleteLoading }] = useTargetMarketDeleteMutation();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<string | false>(false);

  const icpProfiles = (data?.targetMarkets || []).filter(
    (market) => market.type === TargetMarketType.Segment
  );

  const handleCardClick = (profileId: string) => {
    navigate({ to: '/knowledge/icp/$profileId', params: { profileId } });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMarket({         variables: { input: { id } } });
      toast.success('ICP profile deleted', {
        description: 'The ICP profile has been deleted successfully',
      });
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete ICP profile. ${error.message}`);
    }
    setDeleteConfirmationOpen(false);
  };

  if (loading) {
    return (
      <Page title="Ideal Customer Profiles" description="Define your ideal customer profile" mainFixed>
        <ICPSkeleton />
      </Page>
    );
  }

  if (icpProfiles.length === 0) {
    return (
      <Page
        title="Ideal Customer Profiles"
        description="Define your ideal customer profile"
      >
        <EmptyState
          Icon={Building2}
          title="No ICP profiles defined"
          description="Get started by defining your first profile"
          ctaText="Create ICP Profile"
          ctaIcon={Plus}
          onCtaClick={() => navigate({ to: '/knowledge/icp/new' })}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Ideal Customer Profiles"
      description="Define your ideal customer profile"
      actions={<AddICPButton icpProfiles={icpProfiles} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {icpProfiles.map((profile) => (
          <Card 
            key={profile.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(profile.id)}
            style={{
              borderTop: `4px solid ${profile.color ? COLOR_MAP[profile.color] : '#e5e7eb'}`
            }}
          >
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.industry || 'All Industries'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Confirmable
                      onConfirm={() => handleDelete(profile.id)}
                      isOpen={deleteConfirmationOpen === profile.id}
                      onCancel={() => setDeleteConfirmationOpen(false)}
                      titleText="Delete ICP Profile"
                      bodyText="Are you sure you want to delete this ICP profile? This action cannot be undone."
                      buttonText="Delete"
                      variant="danger"
                      isLoading={deleteLoading}
                    >
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmationOpen(profile.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </Confirmable>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4 pt-3">
                <div className="flex items-center justify-between">
                  <DataDisplay
                    icon={Users}
                    label={`${profile.minEmployees || '0'} - ${
                      profile.maxEmployees ? formatNumber(profile.maxEmployees) : 'Unlimited'
                    }`}
                  />
                  <DataDisplay
                    icon={DollarSign}
                    label={`${profile.minRevenue ? `$${formatNumber(profile.minRevenue)}` : '$0'} - ${
                      profile.maxRevenue ? `$${formatNumber(profile.maxRevenue)}` : 'Unlimited'
                    }`}
                  />
                  <DataDisplay
                    icon={Users}
                    label={`${profile.personas?.length || '0'} Personas`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {profile.hqLocations?.length ? (
                      <>
                        {profile.hqLocations.slice(0, 4).map((location: string) => (
                          <Badge key={location} variant="secondary" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                        {profile.hqLocations.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{profile.hqLocations.length - 4}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Global</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  );
}
