import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Sale {
  invoiceCode: string
  createdAt: string
  grandTotal: number
}

export function RecentSales({ data = [] }: { data?: Sale[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (data.length === 0) {
    return (
      <div className='flex h-[200px] items-center justify-center text-sm text-muted-foreground'>
        No recent sales today
      </div>
    )
  }
  return (
    <div className='space-y-8'>
      {data.map((sale) => (
        <div key={sale.invoiceCode} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>
              {sale.invoiceCode.slice(-2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {sale.invoiceCode}
              </p>
              <p className='text-sm text-muted-foreground'>
                {new Date(sale.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className='font-medium'>
              +{formatCurrency(sale.grandTotal)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
