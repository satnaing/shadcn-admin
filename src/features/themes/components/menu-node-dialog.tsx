import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { MenuNode } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { FormScope } from './form-scope'
import { LocaleSwitch } from './locale-switch'
import { LocalizedField } from './localized-field'
import { SelectField } from './select-field'
import { SwitchField } from './switch-field'
import { TextField } from './text-field'

const opts = (values: string[]) => values.map((value) => ({ value, label: value }))
const TYPES = opts(['link', 'dropdown', 'mega-categories', 'mega-bento'])
const TONES = opts(['lime', 'primary-hover', 'accent'])
const VISIBLE = opts(['both', 'desktop', 'mobile'])
const SOURCES = opts(['manual', 'catalog_categories'])

interface MenuNodeDialogProps {
  node: MenuNode | null
  locale: string
  onSave: (node: MenuNode) => void
  onClose: () => void
}

function NodeFields({ draft }: { draft: MenuNode }) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <LocalizedField path='label' />
      <TextField path='href' />
      <TextField path='icon' />
      <LocalizedField path='description' />
      <SelectField path='type' options={TYPES} />
      <SelectField path='visibleIn' options={VISIBLE} />
      <SwitchField path='highlight' />
      <SwitchField path='enabled' />
      {draft.type === 'mega-categories' && <SelectField path='source' options={SOURCES} />}
      {draft.badge && (
        <>
          <LocalizedField path='badge.text' />
          <SelectField path='badge.tone' options={TONES} />
        </>
      )}
      {draft.type === 'mega-bento' && draft.deal && (
        <>
          <LocalizedField path='deal.badge' />
          <LocalizedField path='deal.text' />
        </>
      )}
    </div>
  )
}

export function MenuNodeDialog({ node, locale: initialLocale, onSave, onClose }: MenuNodeDialogProps) {
  const t = useThemeT()
  const [draft, setDraft] = useState<MenuNode | null>(node)
  const [locale, setLocale] = useState(initialLocale)
  const [source, setSource] = useState(node)

  // Re-seed the draft when another node is opened (key-less reset without an effect).
  if (node !== source) {
    setSource(node)
    setDraft(node)
  }

  const toggleBadge = () =>
    draft && setDraft({ ...draft, badge: draft.badge ? null : { text: {}, tone: 'lime' } })
  const toggleDeal = () => draft && setDraft({ ...draft, deal: draft.deal ? null : { badge: {}, text: {} } })

  return (
    <Dialog open={node !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t('menu.editNode')}</DialogTitle>
        </DialogHeader>
        {draft && (
          <FormScope value={draft} onChange={setDraft} locale={locale}>
            <LocaleSwitch value={locale} onChange={setLocale} />
            <NodeFields draft={draft} />
            <div className='flex gap-2'>
              <Button type='button' variant='outline' size='sm' onClick={toggleBadge}>
                {t(draft.badge ? 'menu.removeBadge' : 'menu.addBadge')}
              </Button>
              {draft.type === 'mega-bento' && (
                <Button type='button' variant='outline' size='sm' onClick={toggleDeal}>
                  {t(draft.deal ? 'menu.removeDeal' : 'menu.addDeal')}
                </Button>
              )}
            </div>
          </FormScope>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => draft && onSave(draft)}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
