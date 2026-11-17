export interface TagLimits {
  /** Max characters per tag (default 50). */
  maxLength?: number
  /** Max number of tags (default unlimited). */
  maxTags?: number
}

/** Comma-separated string ⇄ list (the storage format of existing forms). */
export const splitTags = (value: string): string[] =>
  value.split(',').map((t) => t.trim()).filter(Boolean)

export const joinTags = (tags: string[]): string => tags.join(', ')

export type AddResult = { tags: string[]; rejected?: 'empty' | 'duplicate' | 'tooLong' | 'tooMany' }

/** Adds one tag: trimmed, case-insensitive duplicate check, length and count limits. */
export function addTag(tags: string[], raw: string, { maxLength = 50, maxTags }: TagLimits = {}): AddResult {
  const tag = raw.trim()
  if (!tag) return { tags, rejected: 'empty' }
  if (tag.length > maxLength) return { tags, rejected: 'tooLong' }
  if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return { tags, rejected: 'duplicate' }
  if (maxTags !== undefined && tags.length >= maxTags) return { tags, rejected: 'tooMany' }
  return { tags: [...tags, tag] }
}

/** Splits pasted/typed text on commas and adds each piece, keeping the last rejection reason. */
export function addMany(tags: string[], text: string, limits?: TagLimits): AddResult {
  let result: AddResult = { tags }
  for (const piece of text.split(',')) {
    if (!piece.trim()) continue
    const next = addTag(result.tags, piece, limits)
    result = { tags: next.tags, rejected: next.rejected ?? result.rejected }
  }
  return result
}

export const removeTag = (tags: string[], index: number): string[] => tags.filter((_, i) => i !== index)
