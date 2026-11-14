import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { Banner, BannerDraft } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { BannerFields } from './banner-fields'
import { FormScope } from './form-scope'
import { LocaleSwitch } from './locale-switch'

interface BannerDialogProps {
  /** `null` = closed; an object without `id` = create. */
  banner: (BannerDraft & Partial<Pick<Banner, 'id'>>) | null
  lockedColors: boolean
  pending: boolean
  onSave: (draft: BannerDraft, id?: number) => void
  onClose: () => void
}

export function BannerDialog({ banner, lockedColors, pending, onSave, onClose }: BannerDialogProps) {
  const t = useThemeT()
  const [draft, setDraft] = useState(banner)
  const [source, setSource] = useState(banner)
  const [locale, setLocale] = useState<string>(FALLBACK_FORM_LOCALES[0])

  if (banner !== source) {
    setSource(banner)
    setDraft(banner)
  }

  return (
    <Dialog open={banner !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t(banner?.id ? 'banners.edit' : 'banners.create')}</DialogTitle>
        </DialogHeader>
        {draft && (
          <FormScope value={draft} onChange={setDraft} locale={locale}>
            <LocaleSwitch value={locale} onChange={setLocale} />
            <BannerFields lockedColors={lockedColors} />
          </FormScope>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button disabled={pending} onClick={() => draft && onSave(draft, draft.id)}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
