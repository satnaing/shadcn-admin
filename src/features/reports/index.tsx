import {
  ArrowDownUp,
  Boxes,
  FileSpreadsheet,
  Heart,
  Package,
  Search,
  Store,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportStatCards } from './components/report-stat-cards'
import { useReportsOverview } from './hooks/useReports'

export function ReportsDashboard() {
  const { data: res } = useReportsOverview()
  const overview = res?.data

  const reportModules = [
    {
      title: 'Qazanc Hesabatı',
      desc: 'Admin və satıcı xalis gəlirləri, vergi və toplam dövriyyə statistikası',
      icon: TrendingUp,
      url: '/admin/reports/earnings',
      color: 'text-emerald-500',
    },
    {
      title: 'Daxili Məhsul Satışları',
      desc: 'xShop tərəfindən birbaşa satılan in-house məhsulların satış analitikası',
      icon: Package,
      url: '/admin/reports/in-house-sales',
      color: 'text-blue-500',
    },
    {
      title: 'Satıcı Məhsul Satışları',
      desc: 'Bütün fəal mağaza və satıcıların məhsul satış həcmləri və sıralaması',
      icon: Store,
      url: '/admin/reports/seller-sales',
      color: 'text-amber-500',
    },
    {
      title: 'Anbar və Stok Hesabatı',
      desc: 'Mövcud stok qalıqları, kritik azalan və tükənən məhsul bildirişləri',
      icon: Boxes,
      url: '/admin/reports/stock',
      color: 'text-red-500',
    },
    {
      title: 'İstək Siyahısı Hesabatı',
      desc: 'Müştərilərin sevimlilərə əlavə etdiyi ən populyar və arzu olunan məhsullar',
      icon: Heart,
      url: '/admin/reports/wishlist',
      color: 'text-pink-500',
    },
    {
      title: 'İstifadəçi Axtarışları',
      desc: 'Saytda ən çox axtarılan açar sözlər və tapılmayan məhsul sorğuları',
      icon: Search,
      url: '/admin/reports/user-searches',
      color: 'text-purple-500',
    },
    {
      title: 'Komissiya Tarixçəsi',
      desc: 'Hər sifariş üzrə tutulan admin komissiyaları və satıcı paylarının jurnalı',
      icon: ArrowDownUp,
      url: '/admin/reports/commission-log',
      color: 'text-indigo-500',
    },
    {
      title: 'Pul Kisəsi Balans Jurnalı',
      desc: 'Müştəri və satıcıların balans artırma tarixçəsi və ödəniş kanalları',
      icon: Wallet,
      url: '/admin/reports/wallet-history',
      color: 'text-teal-500',
    },
  ]

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-6'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Hesabat Mərkəzi</h1>
            <p className='text-sm text-muted-foreground'>
              xShop biznes, satış, anbar və maliyyə hesabatlarının mərkəzləşdirilmiş idarəetməsi
            </p>
          </div>
        </div>

        <ReportStatCards overview={overview} />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {reportModules.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className='flex flex-col justify-between transition-all hover:border-primary/50'>
                <CardHeader className='pb-2'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Icon className={`size-5 ${item.color}`} />
                    <CardTitle className='text-base font-semibold'>{item.title}</CardTitle>
                  </div>
                  <p className='text-xs text-muted-foreground line-clamp-2'>{item.desc}</p>
                </CardHeader>
                <CardContent className='pt-2'>
                  <Button variant='outline' size='sm' className='w-full gap-1.5' asChild>
                    <Link to={item.url}>
                      <FileSpreadsheet className='size-3.5' />
                      Hesabata Bax
                    </Link>
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

export default ReportsDashboard
