import * as React from 'react'

export function useIdle(ms = 1000 * 60) {
  const [idle, setIdle] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: number

    const handleTimeout = () => {
      setIdle(true)
    }

    const handleEvent = throttle(() => {
      setIdle(false)

      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(handleTimeout, ms)
    }, 500)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent()
      }
    }

    timeoutId = window.setTimeout(handleTimeout, ms)

    window.addEventListener('mousemove', handleEvent)
    window.addEventListener('mousedown', handleEvent)
    window.addEventListener('resize', handleEvent)
    window.addEventListener('keydown', handleEvent)
    window.addEventListener('touchstart', handleEvent)
    window.addEventListener('wheel', handleEvent)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('mousemove', handleEvent)
      window.removeEventListener('mousedown', handleEvent)
      window.removeEventListener('resize', handleEvent)
      window.removeEventListener('keydown', handleEvent)
      window.removeEventListener('touchstart', handleEvent)
      window.removeEventListener('wheel', handleEvent)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.clearTimeout(timeoutId)
    }
  }, [ms])

  return idle
}

function throttle(cb: () => void, ms: number) {
  let lastTime = 0
  return () => {
    const now = Date.now()
    if (now - lastTime >= ms) {
      cb()
      lastTime = now
    }
  }
}
