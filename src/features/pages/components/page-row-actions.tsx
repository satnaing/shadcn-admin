import { History, LayoutTemplate, MoreHorizontal, Settings2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PageRow } from '../data/pages.type'

export interface PageRowHandlers {
  onBuilder: (page: PageRow) => void
  onSettings: (page: PageRow) => void
  onRevisions: (page: PageRow) => void
  onDelete: (page: PageRow) => void
}

interface PageRowActionsProps {
  page: PageRow
  handlers: PageRowHandlers
}

export function PageRowActions({ page, handlers }: PageRowActionsProps) {
  const { t } = useTranslation('pages')

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={t('actions.menu')}>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => handlers.onBuilder(page)}>
          <LayoutTemplate className='me-2 size-4' />
          {t('actions.builder')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlers.onSettings(page)}>
          <Settings2 className='me-2 size-4' />
          {t('actions.settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlers.onRevisions(page)}>
          <History className='me-2 size-4' />
          {t('actions.revisions')}
        </DropdownMenuItem>
        {page.is_homepage ? null : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={() => handlers.onDelete(page)}>
              <Trash2 className='me-2 size-4' />
              {t('actions.delete')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
