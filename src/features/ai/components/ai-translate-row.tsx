import { Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { LanguageProgress } from '../data/ai.type'
import type { TranslateRun } from '../hooks/use-ai-translate-run'

interface Props {
  language: LanguageProgress
  /** The active run, only when it belongs to this language. */
  run: TranslateRun | null
  /** Another language is being translated: starting is blocked. */
  busy: boolean
  canRun: boolean
  onStart: () => void
  onStop: () => void
}

/** One language: coverage bar, run button with live page progress, and the result of the last run. */
export function AiTranslateRow({ language, run, busy, canRun, onStart, onStop }: Props) {
  const { t } = useTranslation('ai')
  const running = run?.state === 'running'
  const percent = Math.round((language.translated_keys / Math.max(1, language.total_keys)) * 100)
  const missing = language.total_keys - language.translated_keys

  return (
    <div className='flex flex-wrap items-center gap-4 rounded-md border p-4'>
      <div className='min-w-40'>
        <p className='font-medium'>{language.name}</p>
        <Badge variant='outline'>{language.code}</Badge>
      </div>
      <div className='min-w-48 flex-1 space-y-1'>
        <Progress value={percent} aria-label={language.name} />
        <p className='text-sm text-muted-foreground'>
          {t('translate.coverage', { done: language.translated_keys, total: language.total_keys, missing })}
        </p>
        {run && (
          <p className='text-sm' role='status'>
            {running
              ? t('translate.progress', { page: run.page, pages: run.totalPages, count: run.translated })
              : t(`translate.result.${run.state}`, { count: run.translated })}
          </p>
        )}
      </div>
      {running ? (
        <Button variant='outline' onClick={onStop}>
          <Square className='size-4' /> {t('translate.stop')}
        </Button>
      ) : (
        <Button disabled={!canRun || busy || missing === 0} onClick={onStart}>
          <Play className='size-4' /> {t('translate.start')}
        </Button>
      )}
    </div>
  )
}
