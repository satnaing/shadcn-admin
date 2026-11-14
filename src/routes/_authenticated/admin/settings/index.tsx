import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PageGuard } from '@/components/guard'
import { SettingsPage } from '@/features/settings'
import { SETTINGS_TAB_IDS } from '@/features/settings/settings-tabs'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/settings/')({
  validateSearch: z.object({ tab: z.enum(SETTINGS_TAB_IDS).optional().catch(undefined) }),
  component: () => (
    <PageGuard permission={PERMISSIONS.SETTINGS.INDEX}>
      <SettingsPage />
    </PageGuard>
  ),
})
