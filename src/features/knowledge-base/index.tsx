import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CreateKnowledgeBaseForm } from './components/create-knowledge-base-form'

export function KnowledgeBase() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>创建知识库</h2>
          <p className='text-muted-foreground'>
            配置名称、数据类型并上传文件，构建你的专属知识库。
          </p>
        </div>

        <CreateKnowledgeBaseForm />
      </Main>
    </>
  )
}
