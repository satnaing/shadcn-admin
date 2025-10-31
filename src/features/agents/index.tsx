import Header from '@/components/layout/header'
import Main from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AgentList } from './components/agent-list'
import { AgentCreateDialog } from './components/agent-create-dialog'
import { AgentsProvider } from './components/agents-provider'
import { useState } from 'react'

const topNav = [
  { title: 'Overview', href: '/agents', isActive: true, disabled: false },
  { title: 'Analytics', href: '/agents/analytics', isActive: false, disabled: true },
  { title: 'Settings', href: '/agents/settings', isActive: false, disabled: true },
]

export function Agents() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <AgentsProvider>
      <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Agents</h1>
          <div className='flex items-center space-x-2'>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Create Agent</Button>
          </div>
        </div>

        <Tabs defaultValue='list' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='list'>Agent List</TabsTrigger>
            <TabsTrigger value='active'>Active Agents</TabsTrigger>
            <TabsTrigger value='archived' disabled>Archived Agents</TabsTrigger>
          </TabsList>
          
          <TabsContent value='list'>
            <AgentList />
          </TabsContent>
          
          <TabsContent value='active'>
            <AgentList activeOnly={true} />
          </TabsContent>
        </Tabs>
      </Main>
      
      <AgentCreateDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      </>
    </AgentsProvider>
  )
}