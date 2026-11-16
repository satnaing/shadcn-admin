import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guard'

interface Props {
  permission: string
  onEdit?: () => void
  onDelete?: () => void
}

export function PreorderRowButtons({ permission, onEdit, onDelete }: Props) {
  const { t } = useTranslation('preorder')

  return (
    <PermissionGuard permission={permission}>
      <div className='flex justify-end gap-1'>
        {onEdit && (
          <Button
            variant='ghost'
            size='icon'
            aria-label={t('actions.edit')}
            onClick={onEdit}
          >
            <Pencil className='size-4' />
          </Button>
        )}
        {onDelete && (
          <Button
            variant='ghost'
            size='icon'
            aria-label={t('actions.delete')}
            onClick={onDelete}
          >
            <Trash2 className='size-4' />
          </Button>
        )}
      </div>
    </PermissionGuard>
  )
}
