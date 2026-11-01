import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/constant'
import { PageGuard } from '@/components/guard/page-guard'
import { RolePage } from '@/features/role'

const roleSearchSchema = z.object({
  sort: z.string().optional().catch('id'),
  order: z.string().optional().catch('desc'),
  status: z.coerce.string().optional(),
})

export const Route = createFileRoute('/_authenticated/role/')({
  validateSearch: roleSearchSchema,
  component: () => (
    <PageGuard permission={PERMISSIONS.ROLES.INDEX}>
      <RolePage />
    </PageGuard>
  ),
})
