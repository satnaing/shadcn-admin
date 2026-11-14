import { createContext, useContext } from 'react'

export interface BlockFormState {
  value: unknown
  /** Writes one path of the draft document. */
  set: (path: string, next: unknown) => void
  locale: string
  disabled: boolean
}

export const BlockFormContext = createContext<BlockFormState | null>(null)

export function useBlockForm(): BlockFormState {
  const ctx = useContext(BlockFormContext)
  if (!ctx) throw new Error('useBlockForm must be used inside <FormScope>')
  return ctx
}
