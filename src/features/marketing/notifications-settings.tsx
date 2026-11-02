import { useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { NotificationSettings } from './data/marketing.type'
import { useNotificationSettings } from './hooks/useMarketing'
import { useMessagingMutations } from './hooks/useMessagingMutations'

function SettingsForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: NotificationSettings
  onSave: (d: Partial<NotificationSettings>) => void
  isPending: boolean
}) {
  const [firebaseEnabled, setFirebaseEnabled] = useState(initialData?.firebase_enabled ?? false)
  const [firebaseKey, setFirebaseKey] = useState(initialData?.firebase_server_key ?? '')
  const [firebaseSenderId, setFirebaseSenderId] = useState(initialData?.firebase_sender_id ?? '')

  const [onesignalEnabled, setOnesignalEnabled] = useState(initialData?.onesignal_enabled ?? false)
  const [onesignalAppId, setOnesignalAppId] = useState(initialData?.onesignal_app_id ?? '')
  const [onesignalApiKey, setOnesignalApiKey] = useState(initialData?.onesignal_api_key ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      firebase_enabled: firebaseEnabled,
      firebase_server_key: firebaseKey,
      firebase_sender_id: firebaseSenderId,
      onesignal_enabled: onesignalEnabled,
      onesignal_app_id: onesignalAppId,
      onesignal_api_key: onesignalApiKey,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-6 md:grid-cols-2'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Firebase Cloud Messaging (FCM)</CardTitle>
          <Switch checked={firebaseEnabled} onCheckedChange={setFirebaseEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>FCM Server Key</Label>
            <Input
              type='password'
              value={firebaseKey}
              onChange={(e) => setFirebaseKey(e.target.value)}
              placeholder='AAAA...'
            />
          </div>
          <div className='space-y-1.5'>
            <Label>FCM Sender ID</Label>
            <Input
              value={firebaseSenderId}
              onChange={(e) => setFirebaseSenderId(e.target.value)}
              placeholder='123456789'
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>OneSignal Push Notification</CardTitle>
          <Switch checked={onesignalEnabled} onCheckedChange={setOnesignalEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>OneSignal App ID</Label>
            <Input
              value={onesignalAppId}
              onChange={(e) => setOnesignalAppId(e.target.value)}
              placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
            />
          </div>
          <div className='space-y-1.5'>
            <Label>REST API Key</Label>
            <Input
              type='password'
              value={onesignalApiKey}
              onChange={(e) => setOnesignalApiKey(e.target.value)}
              placeholder='Basic ...'
            />
          </div>
        </CardContent>
      </Card>

      <div className='md:col-span-2 flex justify-end'>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Yadda saxlanılır...' : 'Parametrləri Saxla'}
        </Button>
      </div>
    </form>
  )
}

export function NotificationSettingsPage() {
  const { data: settings, isLoading } = useNotificationSettings()
  const { saveNotificationSettings } = useMessagingMutations()

  return (
    <>
      <AdminHeader />
      <Main className='p-6 space-y-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Bildiriş Parametrləri</h1>
          <p className='text-sm text-muted-foreground'>
            Firebase Cloud Messaging və OneSignal inteqrasiya açarları
          </p>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <SettingsForm
            key={settings ? 'loaded' : 'loading'}
            initialData={settings}
            onSave={(d) => saveNotificationSettings.mutate(d)}
            isPending={saveNotificationSettings.isPending}
          />
        )}
      </Main>
    </>
  )
}
