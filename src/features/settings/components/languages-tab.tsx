import { Languages as LanguagesIcon, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLanguages, usePatchLanguage } from '../hooks/useLanguages'

export default function LanguagesTab() {
  const { t } = useTranslation('settings')
  const { data, isLoading, isError } = useLanguages()
  const patch = usePatchLanguage()
  const languages = data?.data ?? []

  if (isLoading) return <Skeleton className='h-48 w-full' />
  if (isError) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>{t('common.loadError')}</AlertDescription>
      </Alert>
    )
  }
  if (languages.length === 0) {
    return <p className='py-8 text-center text-sm text-muted-foreground'>{t('languages.empty')}</p>
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='text-sm text-muted-foreground'>{t('languages.hint')}</p>
        {/* slot: AI translation of missing content (wired by the API/AI module) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Button variant='outline' disabled>
                <LanguagesIcon className='size-4' /> {t('languages.aiTranslate')}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('languages.aiSoon')}</TooltipContent>
        </Tooltip>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('languages.name')}</TableHead>
            <TableHead>{t('languages.code')}</TableHead>
            <TableHead>{t('languages.active')}</TableHead>
            <TableHead className='text-right'>{t('languages.default')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map((lang) => (
            <TableRow key={lang.id}>
              <TableCell>
                <span className='font-medium'>{lang.native_name}</span>
                <span className='ml-2 text-muted-foreground'>{lang.name}</span>
              </TableCell>
              <TableCell className='uppercase'>{lang.code === 'ka' ? 'GE' : lang.code}</TableCell>
              <TableCell>
                <Switch
                  checked={lang.is_active}
                  disabled={lang.is_default || patch.isPending}
                  aria-label={t('languages.active')}
                  onCheckedChange={(is_active) => patch.mutate({ id: lang.id, patch: { is_active } })}
                />
              </TableCell>
              <TableCell className='text-right'>
                {lang.is_default ? (
                  <Badge>
                    <Star className='size-3' /> {t('languages.default')}
                  </Badge>
                ) : (
                  <Button
                    size='sm'
                    variant='ghost'
                    disabled={!lang.is_active || patch.isPending}
                    onClick={() => patch.mutate({ id: lang.id, patch: { is_default: true } })}
                  >
                    {t('languages.makeDefault')}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
