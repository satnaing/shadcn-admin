import { useTranslation } from 'react-i18next'
import { PermissionGuard } from '@/components/guard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/shared/permissions'
import type { PosSettings } from '../data/pos.type'
import { usePosMutations } from '../hooks/use-pos-mutations'

/** Admin-only switch: may sellers use their own POS terminal? Saves immediately, like AEC `updateSettings`. */
export function PosActivationCard({ settings }: { settings: PosSettings }) {
  const { t } = useTranslation('pos')
  const { saveSettings } = usePosMutations()

  return (
    <PermissionGuard permission={PERMISSIONS.POS.ACTIVATION_MANAGE}>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>{t('config.activationTitle')}</CardTitle>
          <CardDescription>{t('config.activationDescription')}</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center gap-3'>
          <Switch
            id='pos-seller-activation'
            checked={settings.seller_activation}
            disabled={saveSettings.isPending}
            onCheckedChange={(checked) => saveSettings.mutate({ seller_activation: checked })}
          />
          <Label htmlFor='pos-seller-activation'>{t('config.activationLabel')}</Label>
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}
