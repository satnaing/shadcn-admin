import { createFileRoute } from '@tanstack/react-router';
import ICPPage from '@/features/icp';

export const Route = createFileRoute('/knowledge/icp/')({
  component: ICPPage,
});
