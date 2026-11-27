import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ReportsChart } from './reports-chart'

export function Reports() {
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Revenue
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$72,800</div>
            <p className='text-xs text-muted-foreground'>
              +14.2% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Expenses
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M2 17 12 7l10 10' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$41,200</div>
            <p className='text-xs text-muted-foreground'>
              +8.1% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Net Profit</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$31,600</div>
            <p className='text-xs text-muted-foreground'>
              +22.4% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Profit Margin
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='m15 9-6 6' />
              <path d='M9 9h.01' />
              <path d='M15 15h.01' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>43.4%</div>
            <p className='text-xs text-muted-foreground'>
              +3.1% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardDescription>
            Monthly comparison for the current fiscal year.
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <ReportsChart />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Generated reports from the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='text-right'>Size</TableHead>
                <TableHead className='text-right sr-only'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className='font-medium'>
                    {report.name}
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>
                    <Badge variant={report.statusVariant}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell className='text-right'>{report.size}</TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      disabled={report.status !== 'Complete'}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        className='h-4 w-4'
                      >
                        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                        <polyline points='7 10 12 15 17 10' />
                        <line x1='12' x2='12' y1='15' y2='3' />
                      </svg>
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

const reports: {
  id: number
  name: string
  type: string
  status: string
  statusVariant: 'default' | 'secondary' | 'destructive' | 'outline'
  date: string
  size: string
}[] = [
  {
    id: 1,
    name: 'Q4 Revenue Summary',
    type: 'Financial',
    status: 'Complete',
    statusVariant: 'default',
    date: 'Feb 14, 2026',
    size: '2.4 MB',
  },
  {
    id: 2,
    name: 'User Growth Analysis',
    type: 'Analytics',
    status: 'Complete',
    statusVariant: 'default',
    date: 'Feb 12, 2026',
    size: '1.8 MB',
  },
  {
    id: 3,
    name: 'Monthly Expenses Breakdown',
    type: 'Financial',
    status: 'Processing',
    statusVariant: 'secondary',
    date: 'Feb 10, 2026',
    size: '--',
  },
  {
    id: 4,
    name: 'Customer Churn Report',
    type: 'Analytics',
    status: 'Complete',
    statusVariant: 'default',
    date: 'Feb 8, 2026',
    size: '3.1 MB',
  },
  {
    id: 5,
    name: 'Infrastructure Cost Audit',
    type: 'Operations',
    status: 'Failed',
    statusVariant: 'destructive',
    date: 'Feb 5, 2026',
    size: '--',
  },
  {
    id: 6,
    name: 'Annual Performance Review',
    type: 'HR',
    status: 'Complete',
    statusVariant: 'default',
    date: 'Feb 1, 2026',
    size: '5.6 MB',
  },
  {
    id: 7,
    name: 'Product Feature Usage',
    type: 'Analytics',
    status: 'Complete',
    statusVariant: 'default',
    date: 'Jan 28, 2026',
    size: '1.2 MB',
  },
  {
    id: 8,
    name: 'Sales Pipeline Forecast',
    type: 'Financial',
    status: 'Complete',
    statusVariant: 'default',
    date: 'Jan 25, 2026',
    size: '4.3 MB',
  },
]
