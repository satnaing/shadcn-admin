import { createContext, useContext, useEffect, useState } from 'react'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'

export type Direction = 'ltr' | 'rtl'

const DEFAULT_DIRECTION = 'ltr'

interface DirectionContextType {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType>({
  defaultDir: DEFAULT_DIRECTION,
  dir: DEFAULT_DIRECTION,
  setDir: () => {},
  resetDir: () => {},
})

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, _setDir] = useState<Direction>(
    () => (localStorage.getItem('dir') as Direction) || DEFAULT_DIRECTION
  )

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('dir', dir)
  }, [dir])

  const setDir = (dir: Direction) => {
    _setDir(dir)
    localStorage.setItem('dir', dir)
  }

  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION)
    localStorage.removeItem('dir')
  }

  return (
    <DirectionContext
      value={{ defaultDir: DEFAULT_DIRECTION, dir, setDir, resetDir }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDirection() {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionContext')
  }
  return context
}
