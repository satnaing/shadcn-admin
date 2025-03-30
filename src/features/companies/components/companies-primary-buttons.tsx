import { IconBuildingPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useCompanies } from '../context/companies-context'

export function UsersPrimaryButtons() {
  const { setOpen } = useCompanies()
  return (
    <div className='flex gap-2'>
      {/* <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>xlsx로 등록</span>
      </Button> */}
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>회사 추가</span> <IconBuildingPlus size={18} />
      </Button>
    </div>
  )
}
