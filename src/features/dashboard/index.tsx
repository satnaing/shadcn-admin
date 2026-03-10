import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  DollarSign,
  Loader2,
  Receipt,
  Tag,
  Wallet,
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/hooks/use-app-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
// import { ConfigDrawer } from '@/components/config-drawer'
// import { Header } from '@/components/layout/header'
// import { Main } from '@/components/layout/main'
// import { TopNav } from '@/components/layout/top-nav'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
// import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
// import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

interface DailyReportData {
  date: string
  totals: {
    totalOrders: number
    grossSales: number
    totalDiscounts: number
    netRevenue: number
  }
  recentSales: {
    invoiceCode: string
    createdAt: string
    grandTotal: number
    status: string
  }[]
  lowStockItems: {
    id: string
    name: string | Record<string, string>
    sku: string
    quantity: number
  }[]
}

export function Dashboard() {
  const { activeShopId } = useAppStore()
  const [data, setData] = useState<DailyReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!activeShopId) return

      try {
        setIsLoading(true)
        const response = await apiClient.get('/admin/shop/reports/daily', {
          headers: {
            'x-shop-id': activeShopId,
          },
        })
        setData(response.data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching daily report:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeShopId])

  const handleDownload = async () => {
    const localDateString = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
    try {
      setIsDownloading(true)
      const response = await apiClient.get('/admin/shop/reports/export', {
        params: { date: localDateString },
        headers: {
          'x-shop-id': activeShopId,
        },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `daily-report-${localDateString}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error downloading report:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      {/* <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header> */}

      {/* ===== Main ===== */}
      <div className='flex flex-col gap-6 p-6'>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Shop Daily Report
          </h1>
          <div className='flex items-center space-x-2'>
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Downloading...
                </>
              ) : (
                'Download'
              )}
            </Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card className='py-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Gross Sales
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className='h-8 w-[100px]' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {formatCurrency(data?.totals.grossSales || 0)}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Total sales before discounts
                  </p>
                </CardContent>
              </Card>
              <Card className='py-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Orders
                  </CardTitle>
                  <Receipt className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className='h-8 w-[100px]' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {data?.totals.totalOrders || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Number of completed orders
                  </p>
                </CardContent>
              </Card>
              <Card className='py-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Discounts Given
                  </CardTitle>
                  <Tag className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className='h-8 w-[100px]' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {formatCurrency(data?.totals.totalDiscounts || 0)}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Total value of all discounts
                  </p>
                </CardContent>
              </Card>
              <Card className='py-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Net Revenue
                  </CardTitle>
                  <Wallet className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className='h-8 w-[100px]' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {formatCurrency(data?.totals.netRevenue || 0)}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Gross sales minus discounts
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 py-2 lg:col-span-4'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <AlertTriangle className='h-4 w-4 text-rose-500' />
                </CardHeader>
                <CardContent>
                  {data?.lowStockItems && data.lowStockItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className='text-right'>Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.lowStockItems.map((item) => {
                          let displayName = ''
                          try {
                            if (typeof item.name === 'string') {
                              if (item.name.startsWith('{')) {
                                const parsed = JSON.parse(item.name)
                                displayName =
                                  parsed.en ||
                                  parsed.km ||
                                  Object.values(parsed)[0] ||
                                  'Unknown'
                              } else {
                                displayName = item.name
                              }
                            } else if (
                              typeof item.name === 'object' &&
                              item.name !== null
                            ) {
                              const nameObj = item.name as Record<
                                string,
                                string
                              >
                              displayName =
                                nameObj.en ||
                                nameObj.km ||
                                Object.values(nameObj)[0] ||
                                'Unknown'
                            }
                          } catch (_e) {
                            displayName = String(item.name)
                          }

                          return (
                            <TableRow key={item.id}>
                              <TableCell className='py-3'>
                                <div className='font-medium'>{displayName}</div>
                                <div className='text-xs text-muted-foreground'>
                                  SKU: {item.sku}
                                </div>
                              </TableCell>
                              <TableCell className='py-3 text-right'>
                                <Badge
                                  variant={
                                    item.quantity <= 5
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className={
                                    item.quantity > 5 && item.quantity <= 15
                                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
                                      : ''
                                  }
                                >
                                  {item.quantity}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className='flex h-[150px] items-center justify-center text-sm text-muted-foreground'>
                      All stock levels are healthy.
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 py-2 lg:col-span-3'>
                <CardHeader className='mb-2 px-4'>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Latest transactions from today.
                  </CardDescription>
                </CardHeader>
                <CardContent className='px-4 pt-2'>
                  <RecentSales data={data?.recentSales} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: 'Customers',
//     href: 'dashboard/customers',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Products',
//     href: 'dashboard/products',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//     disabled: true,
//   },
// ]
