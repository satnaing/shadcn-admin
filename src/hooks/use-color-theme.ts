import { useCallback, useEffect, useState } from 'react'

export interface ColorPreset {
  name: string
  value: string
  class: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Zinc', value: 'zinc', class: 'bg-zinc-500' },
  { name: 'Slate', value: 'slate', class: 'bg-slate-500' },
  { name: 'Stone', value: 'stone', class: 'bg-stone-500' },
  { name: 'Gray', value: 'gray', class: 'bg-gray-500' },
  { name: 'Neutral', value: 'neutral', class: 'bg-neutral-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Rose', value: 'rose', class: 'bg-rose-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
  { name: 'Violet', value: 'violet', class: 'bg-violet-500' },
]

const STORAGE_KEY = 'ui-color'
const DEFAULT_COLOR = 'zinc'

function applyThemeClass(color: string) {
  const root = document.documentElement

  COLOR_PRESETS.forEach((preset) => {
    root.classList.remove(`theme-${preset.value}`)
  })

  root.classList.add(`theme-${color}`)
}

function readStoredColor(): string {
  if (typeof window === 'undefined') return DEFAULT_COLOR
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_COLOR
  return COLOR_PRESETS.some((preset) => preset.value === raw)
    ? raw
    : DEFAULT_COLOR
}

export function useColorTheme() {
  const [activeColor, setActiveColor] = useState<string>(readStoredColor)

  const setColor = useCallback((color: string) => {
    setActiveColor(color)
    localStorage.setItem(STORAGE_KEY, color)
    applyThemeClass(color)
  }, [])

  useEffect(() => {
    applyThemeClass(activeColor)
  }, [activeColor])

  return { activeColor, setColor, presets: COLOR_PRESETS }
}
