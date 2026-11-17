export interface EntityOption {
  id: string | number
  label: string
  /** Second line in the result list (e-mail, phone, code…). */
  hint?: string
}

/** Next selection after clicking `option`: toggles in multi mode, replaces in single mode. */
export function toggleOption(selected: EntityOption[], option: EntityOption, multiple: boolean): EntityOption[] {
  const has = selected.some((s) => s.id === option.id)
  if (!multiple) return has ? [] : [option]
  return has ? selected.filter((s) => s.id !== option.id) : [...selected, option]
}

/** The search runs only for `minChars`+ characters (0 = also lists the first page for an empty box). */
export const shouldSearch = (q: string, minChars: number) => q.trim().length >= minChars
