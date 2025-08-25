import { createFileRoute } from '@tanstack/react-router';
import PlaybookDetailPage from '@/features/plays/pages/play';

export const Route = createFileRoute('/plays/$playbookId')({
  component: PlaybookDetailPage,
});