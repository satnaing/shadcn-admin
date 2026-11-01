import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/constant'
import { PageGuard } from '@/components/guard/page-guard'
import { PermissionPage } from '@/features/permission'

const permissionSearchSchema = z.object({
  sort: z.string().optional().catch('id'),
  order: z.string().optional().catch('desc'),
  status: z.coerce.string().optional(),
})

export const Route = createFileRoute('/_authenticated/permission/')({
  validateSearch: permissionSearchSchema,
  component: () => (
    <PageGuard permission={PERMISSIONS.PERMISSIONS.INDEX}>
      <PermissionPage />
    </PageGuard>
  ),
})
