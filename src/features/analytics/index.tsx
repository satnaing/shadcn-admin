import { Activity, BarChart2, FileCode, Globe, Layers, Search, Share2, ShoppingBag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsStatusCards } from './components/analytics-status-cards'
import { useAnalyticsOverview } from './hooks/useAnalytics'

export function AnalyticsDashboard() {
  const { data: overview } = useAnalyticsOverview()

  const tools = [
    { name: 'Google Analytics 4', desc: 'G-XXXXXXXXXX ölçmə ID və e-ticarət hadisələri', icon: BarChart2, url: '/admin/analytics/google' },
    { name: 'GA4 Canlı Hesabat', desc: 'Real vaxt hadisə axını və test nəticələri', icon: Activity, url: '/admin/analytics/google-reports' },
    { name: 'Google Tag Manager', desc: 'GTM konteyneri və xarici teqlərin idarəsi', icon: Layers, url: '/admin/analytics/gtm' },
    { name: 'Meta Pixel', desc: 'Facebook/Instagram reklam pikselləri', icon: Share2, url: '/admin/analytics/pixel' },
    { name: 'Meta Conversion API', desc: 'Server-tərəfli etibarlı dönüşüm izləməsi', icon: Globe, url: '/admin/analytics/conversions-api' },
    { name: 'Google Merchant Center', desc: 'Məhsul kataloqu və XML feed generatoru', icon: ShoppingBag, url: '/admin/analytics/gmc' },
    { name: 'Facebook Kataloq', desc: 'Sosial ticarət və dinamik reklam kataloqu', icon: Share2, url: '/admin/analytics/facebook-catalogue' },
    { name: 'Fərdi Skriptlər', desc: 'Xüsusi JavaScript və ya HTML kod blokları', icon: FileCode, url: '/admin/analytics/custom-scripts' },
    { name: 'Sayt Xəritəsi (Sitemap)', desc: 'sitemap.xml avtomatik generasiyası', icon: Globe, url: '/admin/analytics/sitemap' },
    { name: 'Qlobal SEO', desc: 'Meta başlıq, təsvir və OpenGraph ayarları', icon: Search, url: '/admin/analytics/seo' },
  ]

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Marketinq Analitikası</h1>
          <p className='text-sm text-muted-foreground'>
            Qlobal izləmə, piksellər, axtarış sistemləri və məhsul kataloq inteqrasiyaları
          </p>
        </div>

        <AnalyticsStatusCards overview={overview} />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {tools.map((t) => {
            const Icon = t.icon
            return (
              <Card key={t.name} className='flex flex-col justify-between transition-all hover:border-primary/50'>
                <CardHeader className='pb-2'>
                  <Icon className='h-5 w-5 text-primary mb-2' />
                  <CardTitle className='text-sm font-semibold'>{t.name}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 pt-0'>
                  <p className='text-xs text-muted-foreground line-clamp-2'>{t.desc}</p>
                  <Button variant='outline' size='sm' className='w-full' asChild>
                    <Link to={t.url}>Tənzimlə</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Main>
    </>
  )
}
