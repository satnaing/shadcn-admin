import { Link } from '@tanstack/react-router'
import { ArrowLeft, Eye, Laptop, Redo2, Smartphone, Tablet, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { pagesApi } from '@/api/cms/pages.api'
import { cn } from '@/lib/utils'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import { type Device, useBuilderStore } from '../../data/builder.store'
import { usePageMutations } from '../../hooks/usePageMutations'

const DEVICES: Array<{ id: Device; icon: typeof Laptop }> = [
  { id: 'desktop', icon: Laptop },
  { id: 'tablet', icon: Tablet },
  { id: 'mobile', icon: Smartphone },
]

interface BuilderTopbarProps {
  pageId: number
  title: string
  saveState: 'saving' | 'error' | 'dirty' | 'saved'
}

export function BuilderTopbar({ pageId, title, saveState }: BuilderTopbarProps) {
  const { t } = useTranslation('pages')
  const { lang, device, setLang, setDevice, undo, redo } = useBuilderStore()
  const canUndo = useBuilderStore((s) => s.past.length > 0)
  const canRedo = useBuilderStore((s) => s.future.length > 0)
  const { publish, previewToken } = usePageMutations()

  const publishNow = async () => {
    const state = useBuilderStore.getState()
    if (state.dirty) {
      await pagesApi.saveDraft(pageId, state.sections)
      state.markSaved()
    }
    publish.mutate(pageId)
  }

  const preview = async () => {
    const state = useBuilderStore.getState()
    if (state.dirty) {
      await pagesApi.saveDraft(pageId, state.sections)
      state.markSaved()
    }
    previewToken.mutate(pageId, {
      onSuccess: ({ data }) => window.open(`${data.url}?lang=${state.lang}`, '_blank', 'noopener'),
    })
  }

  return (
    <header className='flex flex-wrap items-center gap-3 border-b bg-background px-3 py-2'>
      <Button asChild variant='ghost' size='icon' aria-label={t('actions.back')}>
        <Link to='/admin/pages'><ArrowLeft className='size-4' /></Link>
      </Button>
      <h1 className='max-w-56 truncate text-sm font-semibold'>{title}</h1>
      <div className='flex rounded-md border p-0.5' role='group' aria-label={t('topbar.language')}>
        {FALLBACK_FORM_LOCALES.map((code) => (
          <Button key={code} size='sm' variant={lang === code ? 'default' : 'ghost'} className='h-7 uppercase' aria-pressed={lang === code} onClick={() => setLang(code)}>
            {code}
          </Button>
        ))}
      </div>
      <div className='flex rounded-md border p-0.5' role='group' aria-label={t('topbar.device')}>
        {DEVICES.map(({ id, icon: Icon }) => (
          <Button key={id} size='icon' variant={device === id ? 'default' : 'ghost'} className={cn('size-7')} aria-label={t(`topbar.${id}`)} aria-pressed={device === id} onClick={() => setDevice(id)}>
            <Icon className='size-4' />
          </Button>
        ))}
      </div>
      <Button size='icon' variant='ghost' disabled={!canUndo} aria-label={t('topbar.undo')} onClick={undo}><Undo2 className='size-4' /></Button>
      <Button size='icon' variant='ghost' disabled={!canRedo} aria-label={t('topbar.redo')} onClick={redo}><Redo2 className='size-4' /></Button>
      <span className='ms-auto text-xs text-muted-foreground' role='status'>{t(`topbar.save.${saveState}`)}</span>
      <Button variant='outline' size='sm' disabled={previewToken.isPending} onClick={() => void preview()}>
        <Eye className='me-1 size-4' />{t('topbar.preview')}
      </Button>
      <Button size='sm' disabled={publish.isPending || saveState === 'saving'} onClick={() => void publishNow()}>
        {t('topbar.publish')}
      </Button>
    </header>
  )
}
