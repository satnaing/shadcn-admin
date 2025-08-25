import { createFileRoute } from '@tanstack/react-router';
import PlaybooksPage from '@/features/plays';

export const Route = createFileRoute('/plays/')({  component: PlaybooksPage,
});
