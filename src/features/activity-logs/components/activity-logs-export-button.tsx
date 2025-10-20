import { IconDownload } from '@tabler/icons-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ActivityLog } from '../data/schema'

interface ExportButtonProps {
  data: ActivityLog[]
  filename?: string
}

export function ActivityLogsExportButton({
  data,
  filename = 'activity-logs',
}: ExportButtonProps) {
  const handleExport = () => {
    try {
      // Create CSV headers
      const headers = [
        'Timestamp',
        'User',
        'Action',
        'Resource',
        'Description',
        'Severity',
        'IP Address',
        'User Agent',
      ]

      // Create CSV rows
      const rows = data.map((log) => [
        format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        log.userName,
        log.action,
        log.resource,
        `"${log.description.replace(/"/g, '""')}"`, // Escape quotes in description
        log.severity,
        log.ipAddress || '',
        `"${log.userAgent?.replace(/"/g, '""') || ''}"`, // Escape quotes in userAgent
      ])

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map((row) => row.join(','))
        .join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
      )
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Activity logs exported successfully')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export activity logs')
    }
  }

  return (
    <Button onClick={handleExport} variant='outline' size='sm'>
      <IconDownload className='mr-2 h-4 w-4' />
      Export CSV
    </Button>
  )
}
