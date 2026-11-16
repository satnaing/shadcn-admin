import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { useAiSettings } from '../hooks/use-ai'
import { AiContentCard } from './ai-content-card'
import { AiTranslateCard } from './ai-translate-card'

/**
 * Both AEC configuration screens on one page: "Google AI (Gemini) Settings" and the addon's
 * "AI Translation Settings". Cards are keyed by their stored values so a refetch never wipes edits.
 */
export function AiSettingsPage() {
  const { t } = useTranslation('ai')
  const settings = useAiSettings().data?.data

  return (
    <AdminPageShell title={t('settings.title')} description={t('settings.description')}>
      {settings ? (
        <div className='grid gap-6 lg:grid-cols-2'>
          <AiContentCard key={`c-${JSON.stringify(settings.content)}`} settings={settings.content} />
          <AiTranslateCard key={`t-${JSON.stringify(settings.translate)}`} settings={settings.translate} />
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
