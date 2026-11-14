import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BannerGroupSettings } from '../data/themes.type'
import { useGroupSettings, useSaveGroupSettings } from '../hooks/useBanners'
import { useThemeT } from '../hooks/useThemeT'
import { FormScope } from './form-scope'
import { SwitchField } from './switch-field'
import { TextField } from './text-field'

/** Slider behaviour per banner group (autoplay / interval / loop / pause on hover). */
export function GroupSettingsCard({ group }: { group: string }) {
  const t = useThemeT()
  const query = useGroupSettings(group)
  const save = useSaveGroupSettings()
  const [draft, setDraft] = useState<BannerGroupSettings | null>(null)
  const value = draft?.group === group ? draft : query.data?.data

  if (!value) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t('banners.sliderSettings', { group })}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormScope value={value} onChange={setDraft} locale='az'>
          <div className='grid gap-3 sm:grid-cols-4'>
            <SwitchField path='autoplay' />
            <TextField path='interval' type='number' />
            <SwitchField path='loop' />
            <SwitchField path='pauseOnHover' />
          </div>
        </FormScope>
        <Button className='mt-3' size='sm' disabled={!draft || save.isPending} onClick={() => draft && save.mutate(draft, { onSuccess: () => setDraft(null) })}>
          {t('common.save')}
        </Button>
      </CardContent>
    </Card>
  )
}
