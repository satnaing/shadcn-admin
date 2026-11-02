import { ArrowRight, Bell, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MarketingSummaryCards } from './components/marketing-summary-cards'
import { PopupsTable } from './components/popups-table'
import { useMarketingSummary, usePopups } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function MarketingDashboard() {
  const { t } = useTranslation('marketing')
  const { data: summary } = useMarketingSummary()
  const { data: popups = [] } = usePopups()
  const { savePopup, deletePopup } = useMarketingMutations()

  const quickLinks = [
    { title: 'Dinamik Pop-uplar', desc: 'Səhifə daxili xüsusi pəncərələr', icon: Sparkles, url: '/admin/marketing/popups' },
    { title: 'Bildiriş Bannerləri', desc: 'Üst və alt zolaq xəbərdarlıqları', icon: Bell, url: '/admin/marketing/alerts' },
    { title: 'Bülleten Göndər', desc: 'Abunəçilərə kütləvi e-poçt', icon: Mail, url: '/admin/marketing/newsletters' },
    { title: 'Kütləvi SMS', desc: 'Müştərilərə SMS kampaniyaları', icon: MessageSquare, url: '/admin/marketing/sms' },
  ]

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('dashboard.title', 'Marketinq İdarə Paneli')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            Kampaniyalar, bildirişlər və istifadəçi cəlbetmə alətləri
          </p>
        </div>

        <MarketingSummaryCards summary={summary} />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {quickLinks.map((q) => {
            const Icon = q.icon
            return (
              <Card key={q.title} className='transition-all hover:border-primary/50'>
                <CardHeader className='pb-2'>
                  <div className='flex items-center justify-between'>
                    <Icon className='h-5 w-5 text-primary' />
                    <Button variant='ghost' size='sm' asChild className='h-7 w-7 p-0'>
                      <Link to={q.url}>
                        <ArrowRight className='h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className='text-base font-semibold'>{q.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-xs text-muted-foreground'>{q.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Aktiv Pop-uplar</h2>
            <Button variant='outline' size='sm' asChild>
              <Link to='/admin/marketing/popups'>Hamısına Bax</Link>
            </Button>
          </div>
          <PopupsTable
            popups={popups.slice(0, 3)}
            onEdit={() => {}}
            onToggle={(p) => savePopup.mutate({ id: p.id, status: !p.status })}
            onDelete={(id) => deletePopup.mutate(id)}
          />
        </div>
      </Main>
    </>
  )
}
