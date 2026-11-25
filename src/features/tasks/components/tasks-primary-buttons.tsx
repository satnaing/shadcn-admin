import { Download, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useTasks } from './tasks-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useTasks()
  const { t } = useTranslation()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>{t('tasks.import')}</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('tasks.create')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
