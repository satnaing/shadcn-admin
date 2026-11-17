import type { MediaAccept, MediaKind, MediaRef } from './media.type'

export const kindOf = (mime: string): MediaKind => (mime.startsWith('image/') ? 'image' : 'document')

/** Does a library file match the picker's `accept` mode? */
export const matchesAccept = (file: Pick<MediaRef, 'type'>, accept: MediaAccept) =>
  accept === 'any' || (accept === 'image' ? file.type === 'image' : file.type === 'document')

export const acceptAttr = (accept: MediaAccept) =>
  accept === 'image' ? 'image/*' : accept === 'file' ? '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt' : undefined

/** Selection after clicking a library file: single mode replaces, multi mode toggles (capped by `max`). */
export function toggleFile(selected: MediaRef[], file: MediaRef, multiple: boolean, max = Infinity): MediaRef[] {
  const has = selected.some((s) => s.id === file.id)
  if (!multiple) return has ? [] : [file]
  if (has) return selected.filter((s) => s.id !== file.id)
  return selected.length >= max ? selected : [...selected, file]
}

/** Moves `from` to `to` (drag-sort of the chosen files). */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list
  const next = [...list]
  next.splice(to, 0, next.splice(from, 1)[0])
  return next
}

/** Single-image forms keep a URL string: bridge it to a one-item ref list and back. */
export const urlToRefs = (url?: string | null): MediaRef[] =>
  url ? [{ id: 0, url, name: url.split('/').pop() ?? url, type: 'image', size: 0 }] : []
export const refsToUrl = (refs: MediaRef[]): string => refs[0]?.url ?? ''
