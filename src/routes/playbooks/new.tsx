import { createFileRoute } from '@tanstack/react-router';
import PlaybookNewPage from '@/features/playbooks/new';

export const Route = createFileRoute('/playbooks/new')({
  component: PlaybookNewPage,
});