import { Check, Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Props {
  title: string
  description: string
  feedUrl: string
  format: string
  lastSyncedAt?: string
  totalProducts: number
  onRegenerate: () => void
  isRegenerating: boolean
}

export function FeedCopyCard({
  title,
  description,
  feedUrl,
  format,
  lastSyncedAt,
  totalProducts,
  onRegenerate,
  isRegenerating,
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(feedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-base'>{title}</CardTitle>
            <p className='text-xs text-muted-foreground mt-1'>{description}</p>
          </div>
          <Badge variant='outline' className='uppercase'>{format}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Input value={feedUrl} readOnly className='bg-muted font-mono text-xs' />
          <Button variant='outline' size='icon' onClick={handleCopy} title='Kopyala'>
            {copied ? <Check className='h-4 w-4 text-emerald-500' /> : <Copy className='h-4 w-4' />}
          </Button>
        </div>

        <div className='flex items-center justify-between pt-2 border-t text-xs text-muted-foreground'>
          <div>
            <span>Sinxronlaşdırılan məhsul: </span>
            <span className='font-semibold text-foreground'>{totalProducts}</span>
          </div>
          <div>
            <span>Son yenilənmə: </span>
            <span className='font-semibold text-foreground'>{lastSyncedAt ?? 'Hələ yoxdur'}</span>
          </div>
          <Button size='sm' variant='secondary' onClick={onRegenerate} disabled={isRegenerating}>
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Yenidən Yarat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
