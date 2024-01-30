import Sidebar from '@/components/sidebar'
import MainPanel from './main-panel'
import useIsCollapsed from '@/hooks/use-is-collapsed'

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  return (
    <div className='bg-background'>
      <div className='flex flex-col md:flex-row'>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`h-svh flex-1`}>
          <MainPanel />
        </div>
      </div>
    </div>
  )
}
