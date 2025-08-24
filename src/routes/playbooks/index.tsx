import { createFileRoute } from '@tanstack/react-router';
import PlaybooksPage from '@/features/playbooks';

export const Route = createFileRoute('/playbooks/')({  component: PlaybooksPage,
});
