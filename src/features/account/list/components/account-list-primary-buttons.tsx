import { PlusCircle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAccountListContext } from '../context/account-list-context'

// 账号列表主操作按钮组件实现
export function AccountListPrimaryButtons() {
  const { setOpen } = useAccountListContext()

  return (
    <div className='flex items-center gap-2'>
      <Button 
        variant='default' 
        size='sm'
        onClick={() => setOpen('import')}
        className='h-8'
      >
        <Upload className='mr-2 h-4 w-4' />
        批量导入账号
      </Button>
    </div>
  )
} 