import { IconUpload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useDevices } from '../context/devices-context.tsx'

export function DevicesPrimaryButtons() {
  const { setOpen } = useDevices()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import Devices</span> <IconUpload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <IconPlus size={18} /><span>Add Device</span>
      </Button>
    </div>
  )
}
