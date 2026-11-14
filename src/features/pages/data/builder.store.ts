import { create } from 'zustand'
import type { PageSection } from './pages.type'

export const HISTORY_LIMIT = 20
export type Device = 'desktop' | 'tablet' | 'mobile'

interface BuilderState {
  sections: PageSection[]
  selectedId: string | null
  lang: string
  device: Device
  dirty: boolean
  past: PageSection[][]
  future: PageSection[][]
  lastKey: string | null
  load: (sections: PageSection[]) => void
  select: (id: string | null) => void
  setLang: (lang: string) => void
  setDevice: (device: Device) => void
  add: (section: Omit<PageSection, 'id'>, index?: number) => void
  move: (from: number, to: number) => void
  duplicate: (id: string) => void
  toggleHidden: (id: string) => void
  remove: (id: string) => void
  /** Same `key` in a row (typing in one field) is one undo step. */
  patchPayload: (id: string, patch: Record<string, unknown>, key: string) => void
  setPayload: (id: string, payload: Record<string, unknown>) => void
  undo: () => void
  redo: () => void
  markSaved: () => void
}

let counter = 0
const newId = () => `s${Date.now().toString(36)}${(counter += 1)}`

const commit = (state: BuilderState, sections: PageSection[], key: string | null = null) => ({
  sections,
  dirty: true,
  past: [...state.past, state.sections].slice(-HISTORY_LIMIT),
  future: [],
  lastKey: key,
})

export const useBuilderStore = create<BuilderState>((set) => ({
  sections: [],
  selectedId: null,
  lang: 'az',
  device: 'desktop',
  dirty: false,
  past: [],
  future: [],
  lastKey: null,
  load: (sections) =>
    set({ sections, selectedId: null, dirty: false, past: [], future: [], lastKey: null }),
  select: (selectedId) => set({ selectedId }),
  setLang: (lang) => set({ lang }),
  setDevice: (device) => set({ device }),
  add: (section, index) =>
    set((s) => {
      const created = { ...section, id: newId() }
      const at = index ?? s.sections.length
      const next = [...s.sections.slice(0, at), created, ...s.sections.slice(at)]
      return { ...commit(s, next), selectedId: created.id }
    }),
  move: (from, to) =>
    set((s) => {
      if (from === to || from < 0 || to < 0 || from >= s.sections.length || to >= s.sections.length) return s
      const next = [...s.sections]
      next.splice(to, 0, ...next.splice(from, 1))
      return commit(s, next)
    }),
  duplicate: (id) =>
    set((s) => {
      const at = s.sections.findIndex((x) => x.id === id)
      if (at < 0) return s
      const copy = { ...s.sections[at], id: newId(), payload: structuredClone(s.sections[at].payload) }
      return { ...commit(s, [...s.sections.slice(0, at + 1), copy, ...s.sections.slice(at + 1)]), selectedId: copy.id }
    }),
  toggleHidden: (id) =>
    set((s) => commit(s, s.sections.map((x) => (x.id === id ? { ...x, hidden: !x.hidden } : x)))),
  remove: (id) =>
    set((s) => ({
      ...commit(s, s.sections.filter((x) => x.id !== id)),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  patchPayload: (id, patch, key) =>
    set((s) => {
      const next = s.sections.map((x) => (x.id === id ? { ...x, payload: { ...x.payload, ...patch } } : x))
      if (s.lastKey === key && s.past.length > 0) return { sections: next, dirty: true, future: [] }
      return commit(s, next, key)
    }),
  setPayload: (id, payload) =>
    set((s) => commit(s, s.sections.map((x) => (x.id === id ? { ...x, payload } : x)))),
  undo: () =>
    set((s) => {
      const previous = s.past[s.past.length - 1]
      if (!previous) return s
      return {
        sections: previous,
        past: s.past.slice(0, -1),
        future: [s.sections, ...s.future],
        dirty: true,
        lastKey: null,
      }
    }),
  redo: () =>
    set((s) => {
      const [next, ...rest] = s.future
      if (!next) return s
      return { sections: next, past: [...s.past, s.sections], future: rest, dirty: true, lastKey: null }
    }),
  markSaved: () => set({ dirty: false }),
}))
