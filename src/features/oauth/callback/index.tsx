import { useEffect, useState } from 'react'
import { useParams, useSearch } from '@tanstack/react-router'
import { capitalize } from 'lodash'
import { Check, X, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useOauthLoginMutation } from '@/graphql/operations/operations.generated'

const APP_NAME = 'Swan'

interface OauthCallbackState {
  status: 'loading' | 'success' | 'error'
  message?: string
}

interface SuccessMessageProps {
  appName: string
}

function SuccessMessage({ appName }: SuccessMessageProps) {
  return (
    <div className="flex items-center gap-3">
      <Check className="h-5 w-5 text-green-500" />
      <p className="text-base">
        {capitalize(appName)} has been successfully connected! You may close this tab and head back to {APP_NAME}...
      </p>
    </div>
  )
}

interface ErrorMessageProps {
  message?: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  const defaultMessage = (
    <>
      Authentication failed, please restart the integration from the{' '}
      <a href="/" className="font-semibold underline">
        {APP_NAME} app.
      </a>
    </>
  )

  const errorMessages: Record<string, React.ReactNode> = {
    'No authorization code provided': (
      <>
        Missing authorization code. Please restart the integration from the{' '}
        <a href="/integrations" className="font-semibold underline">
          {APP_NAME} app.
        </a>
      </>
    ),
    'Invalid OAuth state': 'Invalid OAuth state. Please restart the integration process.',
  }

  return (
    <div className="flex items-center gap-3">
      <X className="h-5 w-5 text-red-500" />
      <p className="text-base">
        {message && errorMessages[message] ? errorMessages[message] : message || defaultMessage}
      </p>
    </div>
  )
}

function SlackWarning() {
  return (
    <Alert className="max-w-[600px]">
      <AlertDescription className="space-y-3">
        <p>
          If you tried to connect to a <strong>DM</strong> - please close this tab and try again by
          inviting Swan to a private / public channel.
        </p>
        <p>
          If you connected Swan to a <strong>Private Channel</strong> - please invite Swan to the
          channel to complete the integration. This page will automatically update once the integration
          is complete.
        </p>
        <p>
          <a
            href="https://www.loom.com/share/cdc6c60eb8da43abb480e76ba015ffcf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            See how
          </a>{' '}
          or send us a message at hello@getswan.com if you need help.
        </p>
      </AlertDescription>
    </Alert>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center gap-3">
      <Loader2 className="h-5 w-5 animate-spin" />
      <p className="text-base">Connecting app...</p>
    </div>
  )
}

export function OauthCallback() {
  const { app: appName } = useParams({ from: '/oauth/callback/$app' })
  const searchParams = useSearch({ from: '/oauth/callback/$app' })
  const [state, setState] = useState<OauthCallbackState>({ status: 'loading' })
  const [stateError, setStateError] = useState(false)

  const isSlackApp = appName === 'slack'

  const [oauthLogin, { called }] = useOauthLoginMutation({
    onCompleted: () => {
      setState({ status: 'success' })
      
      // Notify opener when complete
      setTimeout(() => {
        if (state.status !== 'error') {
          window.opener?.postMessage('oauth-complete', '*')
        }
      }, 6000)
    },
    onError: (error) => {
      const errorCode = error.graphQLErrors?.[0]?.extensions?.code
      const isSlackLoginError = errorCode === 'SLACK_LOGIN_ERROR'
      
      setState({ 
        status: 'error',
        message: isSlackLoginError ? 'slack_login_error' : undefined
      })
    }
  })

  useEffect(() => {
    // Get OAuth parameters from URL - use 'auth_code' to avoid Supabase interference
    const code = searchParams.auth_code || searchParams.code
    const oauthState = searchParams.state

    // If no code is provided, show error
    if (!code) {
      setState({ status: 'error', message: 'No authorization code provided' })
      return
    }

    if (!appName || called) {
      return
    }

    // Verify state for Slack OAuth
    if (isSlackApp && oauthState) {
      const storedState = localStorage.getItem('swan.slack_oauth_state')
      if (oauthState !== storedState) {
        setStateError(true)
        setState({ status: 'error', message: 'Invalid OAuth state' })
        return
      }
    }

    // Handle OAuth login with timeout to prevent double execution in dev mode
    const timeoutId = setTimeout(() => {
      oauthLogin({
        variables: {
          input: {
            app: appName.toUpperCase(),
            code,
          },
        },
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchParams, appName, isSlackApp, called, oauthLogin])

  const isSlackLoginError = state.message === 'slack_login_error'

  // Render based on state
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        {isSlackLoginError && <SlackWarning />}
        
        <Card className="w-full max-w-md">
          <CardContent>
            {state.status === 'loading' ? (
              <LoadingState />
            ) : state.status === 'success' ? (
              <SuccessMessage appName={appName} />
            ) : state.status === 'error' ? (
              <ErrorMessage message={stateError ? 'Invalid OAuth state' : state.message} />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
