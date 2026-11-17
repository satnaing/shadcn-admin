export type MediaKind = 'image' | 'document'

/** One library file; pickers store this reference (or just `url` for single-image forms). */
export interface MediaRef {
  id: number
  url: string
  name: string
  type: MediaKind
  size: number
}

/** What a picker accepts: images only, documents only, or both. */
export type MediaAccept = 'image' | 'file' | 'any'
