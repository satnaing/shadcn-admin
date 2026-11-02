import { GalleryVerticalEnd } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SidebarMenuButton } from '@/components/ui/sidebar'

export function TeamSwitcher() {
  const { t } = useTranslation('common')
  return (
    <SidebarMenuButton
      size='lg'
      className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
    >
      <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
        <GalleryVerticalEnd className='size-4' />
      </div>
      <div className='grid flex-1 text-start text-sm leading-tight'>
        <span className='truncate font-semibold text-foreground'>
          xShop
        </span>
        <span className='truncate text-xs text-muted-foreground'>
          {t('teamSwitcher.subtitle')}
        </span>
      </div>
    </SidebarMenuButton>
  )
}
