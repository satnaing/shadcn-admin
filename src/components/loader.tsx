import { IconLoader2 } from '@tabler/icons-react'

export default function Loader() {
  return (
    <div className='flex h-full w-full animate-spin items-center justify-center'>
      <IconLoader2 size={48} />
    </div>
  )
}
