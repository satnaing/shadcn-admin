import { useParams } from '@tanstack/react-router';
import { useTargetMarketQuery } from '../graphql/operations.generated';
import { Page } from '@/components/page';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ICPForm from './components/icp-form';
import PersonasSection from './components/personas-section';
import { ICPProfileSkeleton } from './components/icp-profile-skeleton';

export default function ICPProfilePage() {
  const { profileId } = useParams({ from: '/knowledge/icp/$profileId' });
  const isNew = profileId === 'new';

  const { data, loading } = useTargetMarketQuery({
    variables: { id: profileId },
    skip: !profileId || isNew,
  });

  if (loading && !isNew) {
    return (
      <Page title="ICP Profile" backPath="/icp">
        <ICPProfileSkeleton />
      </Page>
    );
  }

  return (
    <Page
      title={isNew ? 'New ICP Profile' : data?.targetMarket?.name || 'ICP Profile'}
      description={isNew ? 'Create a new Ideal Customer Profile' : ''}
      backPath="/knowledge/icp"
    >
      <Separator className="mb-6" />
      
      <div className="grid gap-6 max-w-[80%]">
        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ICPForm 
              profile={data?.targetMarket} 
              isNew={isNew}
            />
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
  );
}
