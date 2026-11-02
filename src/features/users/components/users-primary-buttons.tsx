import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { t } = useTranslation('users')
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('primaryButtons.addUser')}</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
