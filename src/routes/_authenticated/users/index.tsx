import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/constant'
import { PageGuard } from '@/components/guard/page-guard'
import { Users } from '@/features/users'

const usersSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  sort: z.string().optional().catch('id'),
  order: z.string().optional().catch('desc'),
  filter: z.string().optional(),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.string())
    .optional()
    .catch([]),
  // Per-column text filter (example for username)
  username: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: () => (
    <PageGuard permission={PERMISSIONS.USERS.INDEX}>
      <Users />
    </PageGuard>
  ),
})
