import bellSound from '@/assets/bell.mp3'

export const playNewOrderSound = () => {
  try {
    const audio = new Audio(bellSound)
    audio.play().catch((err) => {
      // eslint-disable-next-line no-console
      console.warn(
        'Browser autoplay policy blocked the notification sound:',
        err
      )
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error playing notification sound:', error)
  }
}
