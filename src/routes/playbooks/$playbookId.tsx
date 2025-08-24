import { createFileRoute } from '@tanstack/react-router';
import PlaybookDetailPage from '@/features/playbooks/detail';

export const Route = createFileRoute('/playbooks/$playbookId')({
  component: PlaybookDetailPage,
});