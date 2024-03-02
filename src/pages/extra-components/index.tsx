import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { PinInput, PinInputField } from '@/components/custom/pin-input'
import { PinInputOg } from '@/components/custom/pin-input-original'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { IconChevronRight } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export default function ExtraComponents() {
  const items = [
    { title: 'Extra Components', href: '/extra-components' },
    { title: 'Breadcrumb' },
  ].map(({ href, title }) => (
    <BreadcrumbItem key={title}>
      {href ? (
        <Link
          className='text-muted-foreground underline decoration-muted-foreground decoration-dashed underline-offset-4 hover:text-foreground hover:decoration-solid'
          to={href}
        >
          {title}
        </Link>
      ) : (
        <span className='text-muted-foreground'>{title}</span>
      )}
    </BreadcrumbItem>
  ))

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Extra Components
          </h1>
        </div>
        <Breadcrumb separator={<IconChevronRight size={18} />}>
          {items}
        </Breadcrumb>
        <Breadcrumb>{items}</Breadcrumb>
        {/* <Input value={pinVal} onChange={(e) => setPinVal(e.target.value)} /> */}
        <h1>Fucking pin</h1>
        <PinInputOg
          autoFocus
          defaultValue='5679'
          type='numeric'
          length={4}
          ariaLabel='Pin Input'
        />
        {/* <PinInput defaultValue='584930' /> */}
        <PinInput
          className='flex h-10 space-x-4'
          defaultValue='56'
          onComplete={(str) => console.log('completed', str)}
          autoFocus
        >
          <PinInputField />
          <PinInputField />
          <Separator orientation='vertical' />
          <PinInputField />
          <PinInputField />
        </PinInput>
        <div className='flex h-5 items-center space-x-4 text-sm'>
          <div>Blog</div>
          <Separator orientation='vertical' />
          <div>Docs</div>
          <Separator orientation='vertical' />
          <div>Source</div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
