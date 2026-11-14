import { useEffect } from 'react'
import { useBuilderStore } from '../data/builder.store'
import { useSaveDraft } from './usePageMutations'

export const AUTOSAVE_MS = 2000

/** Debounced `PATCH /pages/{id}/draft` whenever the builder has unsaved edits. */
export function useAutosave(pageId: number) {
  const sections = useBuilderStore((s) => s.sections)
  const dirty = useBuilderStore((s) => s.dirty)
  const { mutate, isPending, isError } = useSaveDraft()

  useEffect(() => {
    if (!dirty) return
    const timer = setTimeout(() => {
      mutate({ id: pageId, sections }, { onSuccess: () => useBuilderStore.getState().markSaved() })
    }, AUTOSAVE_MS)
    return () => clearTimeout(timer)
  }, [dirty, sections, pageId, mutate])

  return isPending ? 'saving' : isError ? 'error' : dirty ? 'dirty' : 'saved'
}
