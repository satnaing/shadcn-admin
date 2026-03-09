// import { useEffect } from 'react'

// const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION

// /**
//  * Polls the /version.json file every 60 seconds.
//  * If the server's version timestamp is different than the running app's
//  * build timestamp, it forces a hard reload of the browser to fetch the new code.
//  */
// export const useAppVersion = () => {
//   useEffect(() => {
//     const checkVersion = async () => {
//       try {
//         // Cache bust the fetch request to ensure we aren't reading a stale version.json from the browser cache
//         const res = await fetch(`/version.json?t=${Date.now()}`, {
//           cache: 'no-store',
//         })
//         if (!res.ok) return
//         console.log({ res })
//         const data = await res.json()

//         if (
//           data.version &&
//           data.version !== CURRENT_VERSION &&
//           sessionStorage.getItem('last_seen_version') !== data.version
//         ) {
//           // eslint-disable-next-line no-console
//           console.log(
//             `New version detected! Reloading... (${CURRENT_VERSION} -> ${data.version})`
//           )
//           sessionStorage.setItem('last_seen_version', data.version)
//           window.location.reload()
//         }
//       } catch (_err) {
//         // Silently ignore fetch failures (e.g. offline, 404 during deployment swap)
//       }
//     }

//     // Check every 60 seconds
//     const interval = setInterval(checkVersion, 5 * 1000)

//     // Also perform an immediate check on mount
//     checkVersion()

//     return () => clearInterval(interval)
//   }, [])
// }
