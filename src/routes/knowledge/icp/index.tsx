import { createFileRoute } from '@tanstack/react-router';
import ICPPage from '@/features/knowledge/icp';

export const Route = createFileRoute('/knowledge/icp/')({
  component: ICPPage,
});
