import { IconFidgetSpinner } from '@tabler/icons-react'
import CommentifyLogo from '@/assets/images/logo.svg'

function MainLoader() {
  return (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center gap-10`}
    >
      <img src={CommentifyLogo} alt='Logo' className='min-w-[200px]' />
      <div className='max-w-8'>
        <IconFidgetSpinner className='animate-spin' size='md' />
      </div>
    </div>
  )
}

export default MainLoader
