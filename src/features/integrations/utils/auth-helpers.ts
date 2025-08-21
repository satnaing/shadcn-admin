export const getAuthUrlHandler = (url: string, target: string, callback?: () => void) => {
  return (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const width = 600
    const height = 800
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const newWindow = window.open(
      url,
      target,
      `width=${width},height=${height},left=${left},top=${top}`,
    )

    window.addEventListener('message', (event) => {
      if (event.data === 'oauth-complete') {
        newWindow?.close()
        callback?.()
      }
    })
  }
}
