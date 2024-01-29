import Sidebar from '@/components/sidebar'
import { useState } from 'react'

export default function Dashboard() {
  const defaultCollapsed = false
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <>
      <div className='hidden md:block'>
        <div className='border-t'>
          <div className='bg-background'>
            <div className='flex'>
              <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                className={isCollapsed ? 'w-14' : 'w-64'}
              />
              <div className={`lg:border-1 flex-1 h-svh`}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
