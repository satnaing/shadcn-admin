import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge/icp/new')({
  beforeLoad: () => {
    // Redirect to the profile page with 'new' as the profileId
    throw redirect({
      to: '/knowledge/icp/$profileId',
      params: { profileId: 'new' },
    });
  },
});