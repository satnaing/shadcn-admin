import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { PERMISSIONS } from '@/shared/permissions'
import type { TranslateEngine } from '../data/ai.type'
import { useAiLanguages } from '../hooks/use-ai'
import { useAiTranslateRun } from '../hooks/use-ai-translate-run'
import { AiEngineSelect } from './ai-engine-select'
import { AiTranslateRow } from './ai-translate-row'

/**
 * Fills the empty translation strings of a language, 50 keys per request (AEC "Translate By AI /
 * Translate By Google / Translate All" buttons of the language screen). Existing text is never overwritten.
 */
export function AiTranslatePage() {
  const { t } = useTranslation('ai')
  const [engine, setEngine] = useState<TranslateEngine>('ai')
  const languages = useAiLanguages().data?.data ?? []
  const { run, start, stop } = useAiTranslateRun()
  const canRun = usePermissionStore((s) => s.hasPermission)(PERMISSIONS.AI.TRANSLATE)
  const busy = run?.state === 'running'

  return (
    <AdminPageShell title={t('translate.title')} description={t('translate.description')}>
      <AiEngineSelect value={engine} onChange={setEngine} disabled={busy} />
      <div className='grid max-w-4xl gap-3'>
        {languages.map((language) => (
          <AiTranslateRow
            key={language.id}
            language={language}
            run={run?.languageId === language.id ? run : null}
            busy={busy}
            canRun={canRun}
            onStart={() => start(language.id, engine)}
            onStop={stop}
          />
        ))}
      </div>
    </AdminPageShell>
  )
}
