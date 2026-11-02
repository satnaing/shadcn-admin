import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import type { NewsletterCampaign } from './data/marketing.type'
import { useNewsletters } from './hooks/useMarketing'
import { useMessagingMutations } from './hooks/useMessagingMutations'

export function NewslettersPage() {
  const { data: newsletters = [], isLoading } = useNewsletters()
  const { sendNewsletter } = useMessagingMutations()

  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    sendNewsletter.mutate(
      { subject, content },
      {
        onSuccess: () => {
          setSubject('')
          setContent('')
        },
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Xəbər Bülletenləri (Newsletters)</h1>
          <p className='text-sm text-muted-foreground'>
            Bütün abunəçilərə kütləvi e-poçt xəbər və kampaniyaları göndərin
          </p>
        </div>
        <div className='grid gap-6 lg:grid-cols-5'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Mail className='h-4 w-4' /> Yeni Bülleten Göndər
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label>Mövzu</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder='Həftəlik xüsusi təkliflər'
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label>Məzmun (HTML / Mətn)</Label>
                  <Textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Bülleten mətni...'
                    required
                  />
                </div>
                <Button type='submit' className='w-full' disabled={sendNewsletter.isPending}>
                  <Send className='mr-2 h-4 w-4' />
                  {sendNewsletter.isPending ? 'Göndərilir...' : 'Bütün Abunəçilərə Göndər'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-3 space-y-4'>
          <h2 className='text-base font-semibold'>Əvvəlki Göndərişlər</h2>
          <div className='rounded-md border bg-card'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mövzu</TableHead>
                  <TableHead>Alıcı Sayı</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead className='text-right'>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-8 text-center text-sm text-muted-foreground'>
                      Yüklənir...
                    </TableCell>
                  </TableRow>
                ) : (
                  newsletters.map((n: NewsletterCampaign) => (
                    <TableRow key={n.id}>
                      <TableCell className='font-medium'>{n.subject}</TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        {n.recipients_count.toLocaleString()} nəfər
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>{n.sent_at}</TableCell>
                      <TableCell className='text-right'>
                        <Badge variant='outline'>{n.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {newsletters.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className='py-8 text-center text-sm text-muted-foreground'>
                      Bülleten tarixçəsi yoxdur
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      </Main>
    </>
  )
}
