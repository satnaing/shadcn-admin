import { useMemo, type ReactNode } from 'react'
import { setPath } from '../data/set-path'
import { BlockFormContext } from '../hooks/use-block-form'

interface FormScopeProps<S> {
  value: S
  onChange: (next: S) => void
  locale: string
  disabled?: boolean
  children: ReactNode
}

export function FormScope<S>({ value, onChange, locale, disabled = false, children }: FormScopeProps<S>) {
  const state = useMemo(
    () => ({
      value,
      locale,
      disabled,
      set: (path: string, next: unknown) => onChange(setPath(value, path, next)),
    }),
    [value, onChange, locale, disabled]
  )
  return <BlockFormContext.Provider value={state}>{children}</BlockFormContext.Provider>
}
