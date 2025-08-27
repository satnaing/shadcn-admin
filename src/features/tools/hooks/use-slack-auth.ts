import { useCallback } from 'react'
import { getAuthUrlHandler } from '../utils/auth-helpers'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000'
const IS_PROD = import.meta.env.VITE_ENV === 'production'

const SCOPES = [
  'groups:write',
  'groups:history',
  'im:read',
  'im:write',
  'im:history',
  'links:read',
  'channels:read',
  'channels:manage',
  'chat:write',
  'incoming-webhook',
  'reactions:write',
  'users:read',
  'users:read.email',
  'channels:join',
  'files:write',
  'chat:write.customize',
  'groups:read',
  'channels:history',
  'reactions:read',
].join(',')

const SLACK_CLIENT_ID = IS_PROD ? '5645524295351.5706654905891' : '5645524295351.8400448345413'

const generateAuthUrl = () => {
  const state = crypto.getRandomValues(new Uint32Array(4)).join('-')
  localStorage.setItem('swan.slack_oauth_state', state)

  return (
    `https://slack.com/oauth/v2/authorize` +
    `?client_id=${SLACK_CLIENT_ID}` +
    `&scope=${SCOPES}` +
    `&state=${state}` +
    `&redirect_uri=${APP_URL}/oauth/callback/slack`
  )
}

type UseSlackAuthOptions = {
  onAuthComplete?: () => void
}

export const useSlackAuth = ({ onAuthComplete }: UseSlackAuthOptions = {}) => {
  const openSlackAuth = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      const authUrl = generateAuthUrl()
      const handler = getAuthUrlHandler(authUrl, 'Slack Login', onAuthComplete)
      // Create a mock anchor element event for the handler
      const mockEvent = {
        ...e,
        preventDefault: () => e.preventDefault(),
      } as React.MouseEvent<HTMLAnchorElement>
      handler(mockEvent)
    },
    [onAuthComplete]
  )

  return {
    openSlackAuth,
    generateAuthUrl,
  }
}
