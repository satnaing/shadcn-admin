import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { PinInput2, PinInputField } from '@/components/custom/pin-input-2'
import { PinInput } from '@/components/custom/pin-input'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { IconChevronRight } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'

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
        <PinInput
          autoFocus
          defaultValue='5679'
          // value={pinVal}
          // onChange={setPinVal}
          type='numeric'
          length={4}
          // onComplete={(f) => console.log('complted', f)}
          ariaLabel='Pin Input'
        />
        {/* <PinInput defaultValue='584930' /> */}
        <PinInput2
          className='flex h-10 space-x-4'
          defaultValue='56'
          // value={pinVal}
          // onChange={setPinVal}
          onComplete={(str) => console.log('completed', str)}
          inputComponent={Input}
          autoFocus
        >
          <PinInputField />
          <PinInputField />
          <Separator orientation='vertical' />
          <PinInputField />
          <PinInputField />
          {/* <PinInputField
            component={Input}
            className='bg-yellow-50 dark:bg-yellow-950'
          /> */}
          {/* <Separator orientation='vertical' />
          <PinInputField className='bg-orange-50 dark:bg-orange-950' />
          <Separator orientation='vertical' />
          <h1>HEllo</h1>
          <PinInputField className='bg-lime-50 dark:bg-lime-950' />
          <Separator orientation='vertical' />
          <PinInputField className='bg-cyan-50 dark:bg-cyan-950' /> */}
        </PinInput2>
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
