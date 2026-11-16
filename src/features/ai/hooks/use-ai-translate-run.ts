import { useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { aiApi } from '@/api/modules/ai.api'
import type { TranslateEngine, TranslateResult } from '../data/ai.type'
import { aiKeys } from './use-ai'

export interface TranslateRun {
  languageId: number
  page: number
  totalPages: number
  translated: number
  /** `done` = every page answered; `stopped` = the admin pressed stop; the rest are AEC's `result:false` reasons. */
  state: 'running' | 'done' | 'stopped' | 'failed' | TranslateResult['state']
}

/**
 * "Translate all": AEC looped over the pages in the browser (50 keys per request, a pause between
 * pages). The loop stays client-side so the admin can stop it; each page is one idempotent request
 * (only empty strings are filled).
 */
export function useAiTranslateRun() {
  const qc = useQueryClient()
  const [run, setRun] = useState<TranslateRun | null>(null)
  const stop = useRef(false)

  const start = useCallback(
    async (languageId: number, engine: TranslateEngine) => {
      stop.current = false
      let page = 1
      let totalPages = 1
      let translated = 0
      setRun({ languageId, page, totalPages, translated, state: 'running' })

      try {
        while (page <= totalPages) {
          const { data } = await aiApi.translatePage(languageId, engine, page)
          if (data.state !== 'ok') return setRun({ languageId, page, totalPages, translated, state: data.state })
          totalPages = data.total_pages
          translated += data.translated_count
          if (stop.current) return setRun({ languageId, page, totalPages, translated, state: 'stopped' })
          setRun({ languageId, page, totalPages, translated, state: 'running' })
          page += 1
        }
        setRun({ languageId, page: totalPages, totalPages, translated, state: 'done' })
      } catch {
        setRun({ languageId, page, totalPages, translated, state: 'failed' })
      } finally {
        qc.invalidateQueries({ queryKey: aiKeys.languages() })
      }
    },
    [qc]
  )

  return { run, start, stop: () => (stop.current = true) }
}
