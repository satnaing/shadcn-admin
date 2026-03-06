export const playNewOrderSound = () => {
  try {
    // @ts-expect-error - webkitAudioContext is a non-standard property
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    const ctx = new AudioContext()

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime)

      gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime)
      // Fade in quickly
      gainNode.gain.linearRampToValueAtTime(
        0.5,
        ctx.currentTime + startTime + 0.05
      )
      // Fade out slowly
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + startTime + duration
      )

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start(ctx.currentTime + startTime)
      osc.stop(ctx.currentTime + startTime + duration + 0.1)
    }

    // Function to play the chime once at a specific start time
    const playChime = (startTimeOffset: number) => {
      // C5
      playTone(523.25, startTimeOffset, 0.2)
      // E5
      playTone(659.25, startTimeOffset + 0.2, 0.4)
    }

    // Loop the chime for 3 seconds (every 0.8 seconds)
    const durationSeconds = 3
    const intervalSeconds = 0.8
    const numRepeats = Math.floor(durationSeconds / intervalSeconds)

    for (let i = 0; i < numRepeats; i++) {
      playChime(i * intervalSeconds)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error playing notification sound:', error)
  }
}
