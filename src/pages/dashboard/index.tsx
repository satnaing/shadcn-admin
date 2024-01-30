import Sidebar from '@/components/sidebar'
import MainPanel from './main-panel'
import useLocalStorage from '@/hooks/use-local-storage'

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage({
    key: 'collapsed-sidebar',
    defaultValue: false,
  })

  return (
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
  )
}
