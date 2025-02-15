import { useCallback, useEffect, useState } from 'react'

/* ────────────────────────────────────────────────────────────── */
/* 1. Define a typed const enum for fullscreen events              */
/* ────────────────────────────────────────────────────────────── */
export const enum FullscreenEvent {
  FullscreenChange = 'fullscreenchange',
  WebkitFullscreenChange = 'webkitfullscreenchange',
  MozFullscreenChange = 'mozfullscreenchange',
  MsFullscreenChange = 'msfullscreenchange',
}

const FULLSCREEN_EVENTS: FullscreenEvent[] = [
  FullscreenEvent.FullscreenChange,
  FullscreenEvent.WebkitFullscreenChange,
  FullscreenEvent.MozFullscreenChange,
  FullscreenEvent.MsFullscreenChange,
]

/* ────────────────────────────────────────────────────────────── */
/* 2. Extend DOM interfaces for vendor-prefixed fullscreen support  */
/* ────────────────────────────────────────────────────────────── */
declare global {
  interface Document {
    webkitFullscreenEnabled?: boolean
    webkitFullscreenElement?: Element
    webkitExitFullscreen?: () => Promise<void>
    mozFullscreenEnabled?: boolean
    mozFullscreenElement?: Element
    mozCancelFullScreen?: () => Promise<void>
    msFullscreenEnabled?: boolean
    msFullscreenElement?: Element
    msExitFullscreen?: () => Promise<void>
  }
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>
    mozRequestFullScreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
  }
}

/* ────────────────────────────────────────────────────────────── */
/* 3. Helper functions for fullscreen API                         */
/* ────────────────────────────────────────────────────────────── */
const requestFullscreen = (element: HTMLElement): void => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

const exitFullscreen = (): void => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

const getFullscreenElement = (): Element | null => {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement ||
    document.msFullscreenElement ||
    null
  )
}

/* ────────────────────────────────────────────────────────────── */
/* 4. The useFullScreen hook                                       */
/* ────────────────────────────────────────────────────────────── */
export function useFullScreen() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Update the state when fullscreen changes.
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!getFullscreenElement())
  }, [])

  useEffect(() => {
    FULLSCREEN_EVENTS.forEach((event) =>
      document.addEventListener(event, handleFullscreenChange)
    )
    return () => {
      FULLSCREEN_EVENTS.forEach((event) =>
        document.removeEventListener(event, handleFullscreenChange)
      )
    }
  }, [handleFullscreenChange])

  const toggleFullscreen = useCallback(() => {
    const isEnabled =
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullscreenEnabled ||
      document.msFullscreenEnabled
    if (!isEnabled) {
      alert('Fullscreen API is not supported in this browser.')
      return
    }
    if (!isFullscreen) {
      requestFullscreen(document.documentElement)
    } else {
      exitFullscreen()
    }
  }, [isFullscreen])

  return { isFullscreen, toggleFullscreen }
}
