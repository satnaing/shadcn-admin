import { useState, type ReactNode } from 'react'
import { Save } from 'lucide-react'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import { useSaveThemeBlock, useThemeBlock } from '../hooks/useThemeBlock'
import { useThemeT } from '../hooks/useThemeT'
import { FormScope } from './form-scope'
import { LocaleSwitch } from './locale-switch'

interface BlockFormPageProps<S> {
  block: string
  titleKey: string
  /** Rendered beside the Save button (e.g. warnings). */
  extra?: (value: S) => ReactNode
  disabled?: (value: S) => boolean
  children: (value: S) => ReactNode
}

/** Load one theme settings document, edit a draft, save the whole document. */
export function BlockFormPage<S>({ block, titleKey, extra, disabled, children }: BlockFormPageProps<S>) {
  const t = useThemeT()
  const query = useThemeBlock<S>(block)
  const save = useSaveThemeBlock<S>(block)
  const [draft, setDraft] = useState<S | null>(null)
  const [locale, setLocale] = useState<string>(FALLBACK_FORM_LOCALES[0])
  const value = draft ?? query.data?.data

  return (
    <AdminPageShell
      title={t(titleKey)}
      description={t(`${titleKey}.description`)}
      actions={
        <div className='flex items-center gap-2'>
          <LocaleSwitch value={locale} onChange={setLocale} />
          <Button disabled={!draft || save.isPending} onClick={() => draft && save.mutate(draft, { onSuccess: () => setDraft(null) })}>
            <Save className='size-4' /> {t('common.save')}
          </Button>
        </div>
      }
    >
      {query.isLoading && <Skeleton className='h-64 w-full' />}
      {query.isError && <p className='text-destructive'>{t('common.loadFailed')}</p>}
      {value && (
        <FormScope value={value} onChange={setDraft} locale={locale} disabled={disabled?.(value) ?? false}>
          {extra?.(value)}
          <div className='space-y-6'>{children(value)}</div>
        </FormScope>
      )}
    </AdminPageShell>
  )
}
