import { createContext, useContext, useEffect, useState } from 'react'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'

type Direction = 'ltr' | 'rtl'

const DirectionContext = createContext<{
  dir: Direction
  setDir: (dir: Direction) => void
}>({
  dir: 'ltr',
  setDir: () => {},
})

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, _setDir] = useState<Direction>(
    () => (localStorage.getItem('dir') as Direction) || 'ltr'
  )

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('dir', dir)
  }, [dir])

  const setDir = (dir: Direction) => {
    _setDir(dir)
    localStorage.setItem('dir', dir)
  }

  return (
    <DirectionContext value={{ dir, setDir }}>
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
