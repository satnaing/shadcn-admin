import { useState } from 'react'
import { History, Send } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMessagingMutations } from './hooks/useMessagingMutations'

export function NotificationSendPage() {
  const navigate = useNavigate()
  const { sendNotification } = useMessagingMutations()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendNotification.mutate(
      { title, message, target },
      {
        onSuccess: () => navigate({ to: '/admin/marketing/notifications/history' }),
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main className='max-w-2xl p-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Xüsusi Bildiriş Göndər</h1>
            <p className='text-sm text-muted-foreground'>
              İstifadəçilərə fərdi push və ya sistem bildirişi göndərin
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/marketing/notifications/history'>
              <History className='mr-2 h-4 w-4' /> Tarixçə
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Bildiriş Məlumatları</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-1.5'>
                <Label>Hədəf Auditoriya</Label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Bütün İstifadəçilər</SelectItem>
                    <SelectItem value='customers'>Yalnız Müştərilər</SelectItem>
                    <SelectItem value='sellers'>Yalnız Satıcılar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1.5'>
                <Label>Bildiriş Başlığı</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Flaş endirimlər başladı!'
                  required
                />
              </div>

              <div className='space-y-1.5'>
                <Label>Mesaj Mətni</Label>
                <Textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Bildiriş mətni...'
                  required
                />
              </div>

              <Button type='submit' className='w-full' disabled={sendNotification.isPending}>
                <Send className='mr-2 h-4 w-4' />
                {sendNotification.isPending ? 'Göndərilir...' : 'Dərhal Göndər'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
