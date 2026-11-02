import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export function BulkSmsPage() {
  const { sendSms } = useMessagingMutations()
  const [recipientType, setRecipientType] = useState('all_customers')
  const [customPhones, setCustomPhones] = useState('')
  const [message, setMessage] = useState('')

  const charCount = message.length
  const smsParts = Math.max(1, Math.ceil(charCount / 160))

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const recipients = recipientType === 'custom'
      ? customPhones.split(',').map((p) => p.trim()).filter(Boolean)
      : [recipientType]

    sendSms.mutate(
      { recipients, message },
      {
        onSuccess: () => {
          setMessage('')
          setCustomPhones('')
        },
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Kütləvi SMS Göndərişi</h1>
          <p className='text-sm text-muted-foreground'>
            Müştərilərə və satıcılara fərdi və ya kütləvi SMS bildirişləri
          </p>
        </div>
        <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <MessageSquare className='h-4 w-4' /> Yeni SMS Kampaniyası
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label>Alıcı Qrupu</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all_customers'>Bütün Müştərilər</SelectItem>
                      <SelectItem value='all_sellers'>Bütün Satıcılar</SelectItem>
                      <SelectItem value='custom'>Fərdi Nömrələr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recipientType === 'custom' && (
                  <div className='space-y-1.5'>
                    <Label>Telefon Nömrələri (vergüllə ayırın)</Label>
                    <Textarea
                      rows={2}
                      value={customPhones}
                      onChange={(e) => setCustomPhones(e.target.value)}
                      placeholder='+994501234567, +994559876543'
                      required
                    />
                  </div>
                )}

                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <Label>SMS Mətni</Label>
                    <span className='text-xs text-muted-foreground'>
                      {charCount} simvol ({smsParts} SMS hissəsi)
                    </span>
                  </div>
                  <Textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Hörmətli müştəri, xüsusi endirimlər başladı...'
                    required
                  />
                </div>

                <Button type='submit' className='w-full' disabled={sendSms.isPending}>
                  <Send className='mr-2 h-4 w-4' />
                  {sendSms.isPending ? 'Göndərilir...' : 'SMS Göndər'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>SMS Şlüz Məlumatı</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Provayder</span>
                <Badge variant='outline'>Twilio / Azercell</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Qalan Kredit</span>
                <span className='font-bold text-emerald-600'>12,450 SMS</span>
              </div>
              <div className='text-xs text-muted-foreground pt-2 border-t space-y-1'>
                <p>• 1 SMS maksimum 160 latın simvoludur.</p>
                <p>• Qeyri-latın (Unicode) simvollarda 1 SMS 70 simvol sayılır.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </Main>
    </>
  )
}
