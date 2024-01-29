import Sidebar from '@/components/sidebar'
import { useState } from 'react'
import MainPanel from './main-panel'

export default function Dashboard() {
  const defaultCollapsed = false
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <>
      <div className='hidden md:block'>
        <div className='bg-background'>
          <div className='flex'>
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              className={isCollapsed ? 'w-14' : 'w-64'}
            />
            <div className={`flex-1 h-svh`}>
              <MainPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
