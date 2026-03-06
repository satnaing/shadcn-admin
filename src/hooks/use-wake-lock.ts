import { useEffect } from 'react'
import NoSleep from 'nosleep.js'

export function useWakeLock() {
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null
    let noSleepVideo: NoSleep | null = null

    console.log({ haveNativeWakeLock: 'wakeLock' in navigator })

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
          console.log('[WakeLock] Native screen wake lock is active')

          wakeLock.addEventListener('release', () => {
            console.log('[WakeLock] Native screen wake lock was released')
          })
        } else {
          // Fallback for browsers that don't support the native API yet
          if (!noSleepVideo) {
            noSleepVideo = new NoSleep()
          }
          noSleepVideo.enable()
          console.log('[WakeLock] Fallback NoSleep.js video lock is active')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.warn(`[WakeLock] Failed to request wake lock: ${err.message}`)
      }
    }

    const releaseWakeLock = () => {
      if (wakeLock !== null) {
        wakeLock.release()
        wakeLock = null
      }
      if (noSleepVideo !== null) {
        noSleepVideo.disable()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock()
      } else {
        releaseWakeLock()
      }
    }

    // Request initial wake lock on click (NoSleep requires user interaction)
    // We attach it to the document body so the first click anywhere enables it.
    const enableOnInteraction = () => {
      requestWakeLock()
      document.removeEventListener('click', enableOnInteraction)
      document.removeEventListener('touchstart', enableOnInteraction)
    }

    document.addEventListener('click', enableOnInteraction)
    document.addEventListener('touchstart', enableOnInteraction)

    // Re-request wake lock when page becomes visible again
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      releaseWakeLock()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('click', enableOnInteraction)
      document.removeEventListener('touchstart', enableOnInteraction)
    }
  }, [])
}
