import { Bell, FileText, Mail, MessageSquare, Sparkles, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { MarketingSummary } from '../data/marketing.type'

interface Props {
  summary?: MarketingSummary
}

export function MarketingSummaryCards({ summary }: Props) {
  const cards = [
    { title: 'Abunəçilər', value: summary?.subscribers_count ?? 0, icon: Users, color: 'text-blue-500' },
    { title: 'Göndərilən Bülletenlər', value: summary?.newsletters_sent ?? 0, icon: Mail, color: 'text-green-500' },
    { title: 'Göndərilən SMS', value: summary?.sms_sent ?? 0, icon: MessageSquare, color: 'text-amber-500' },
    { title: 'Aktiv Pop-up', value: summary?.active_popups ?? 0, icon: Sparkles, color: 'text-purple-500' },
    { title: 'Aktiv Bannerlər', value: summary?.active_alerts ?? 0, icon: Bell, color: 'text-rose-500' },
    { title: 'Bloq Yazıları', value: summary?.blogs_count ?? 0, icon: FileText, color: 'text-indigo-500' },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Card key={c.title}>
            <CardContent className='flex items-center justify-between p-4'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>{c.title}</p>
                <p className='mt-1 text-2xl font-bold'>{c.value.toLocaleString()}</p>
              </div>
              <div className='rounded-full bg-muted/60 p-2.5'>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
