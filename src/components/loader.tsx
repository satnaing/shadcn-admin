import { IconLoader } from '@tabler/icons-react'

export default function Loader() {
  return (
    <div className='w-full h-svh flex justify-center items-center'>
      <IconLoader className='animate-spin' size={32} />
      <span className='sr-only'>loading</span>
    </div>
  )
}
