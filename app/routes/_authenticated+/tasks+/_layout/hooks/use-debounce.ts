import { useCallback, useRef } from 'react'

type Debounce = (fn: () => void) => void

export const useDebounce = (timeout = 500): Debounce => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounce: Debounce = useCallback(
    (fn) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        fn()
      }, timeout)
    },
    [timeout],
  )
  return debounce
}
