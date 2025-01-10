import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TopNavBreadcrumb } from '@/components/layout/top-nav-breadcrumb'

export default function Skeleton() {
  return (
      <>
        {/* ===== Top Heading ===== */}
        <Header>
          {/*<TopNav links={topNav} />*/}
          <TopNavBreadcrumb></TopNavBreadcrumb>
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        {/* ===== Main ===== */}
        <Main>
          <div className='mb-2 flex items-center justify-between space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <div className='flex items-center space-x-2'>
              <Button>Download</Button>
            </div>
          </div>
          <Tabs
              orientation='vertical'
              defaultValue='overview'
              className='space-y-4'
          >
            <div className='w-full overflow-x-auto pb-2'>
              <TabsList>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='analytics' disabled>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value='reports' disabled>
                  Reports
                </TabsTrigger>
                <TabsTrigger value='notifications' disabled>
                  Notifications
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='overview' className='space-y-4'>

            </TabsContent>
          </Tabs>
        </Main>
      </>
  )
}

