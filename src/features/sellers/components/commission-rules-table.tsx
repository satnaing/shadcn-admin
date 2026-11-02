import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type CommissionRuleItem } from '../data/sellers.type'

interface CommissionRulesTableProps {
  rules: CommissionRuleItem[]
  isLoading?: boolean
  onDelete: (id: number) => void
}

export function CommissionRulesTable({
  rules,
  isLoading,
  onDelete,
}: CommissionRulesTableProps) {
  const { t } = useTranslation('sellers')
  const items = Array.isArray(rules) ? rules : []

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('table.loading', 'Yüklənir...')}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('commission.empty', 'Heç bir fərdi komissiya qaydası təyin edilməyib')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('commission.name', 'Qayda Adı')}</TableHead>
            <TableHead>{t('commission.scope', 'Tətbiq Sahəsi')}</TableHead>
            <TableHead>{t('commission.rate', 'Komissiya Faizi')}</TableHead>
            <TableHead>{t('commission.priority', 'Prioritet')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyat')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((r, index) => (
            <TableRow key={r.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell className='font-semibold'>{r.name}</TableCell>
              <TableCell>
                <div className='flex flex-wrap gap-1'>
                  {r.category_name && (
                    <Badge variant='outline' className='text-xs'>
                      Kateqoriya: {r.category_name}
                    </Badge>
                  )}
                  {r.brand_name && (
                    <Badge variant='secondary' className='text-xs'>
                      Brend: {r.brand_name}
                    </Badge>
                  )}
                  {!r.category_name && !r.brand_name && (
                    <span className='text-xs text-muted-foreground'>Bütün Kataloq</span>
                  )}
                </div>
              </TableCell>
              <TableCell className='font-bold text-primary'>
                {r.rate_percentage}%
              </TableCell>
              <TableCell>
                <Badge variant='outline'>{r.priority}</Badge>
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10'
                  onClick={() => onDelete(r.id)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
