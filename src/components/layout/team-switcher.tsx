import { useState } from 'react'
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'

// Mock store list for team-switcher (E30, CUSTOM-TASKS #18)
const mockLayoutStores = [
  { id: 1, name: 'Allixwork', domain: 'allixwork.test', is_default: true },
  { id: 2, name: 'Allixwork Outlet', domain: 'outlet.allixwork.test', is_default: false },
  { id: 3, name: 'Allixwork Global', domain: 'global.allixwork.test', is_default: false },
]

export function TeamSwitcher() {
  const { t } = useTranslation('common')
  const [stores] = useState(mockLayoutStores)
  const [activeStoreId, setActiveStoreId] = useState<number>(1)

  // E30 / CUSTOM-TASKS #18: Mağaza seçicisi yalnız mağaza sayı > 1 olduqda görünür
  const storeCount = stores.length
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0]

  if (stores.length <= 1) {
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
            {activeStore.name}
          </span>
          <span className='truncate text-xs text-muted-foreground'>
            {t('teamSwitcher.subtitle')}
          </span>
        </div>
      </SidebarMenuButton>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <GalleryVerticalEnd className='size-4' />
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold text-foreground'>
              {activeStore.name}
            </span>
            <span className='truncate text-xs text-muted-foreground'>
              {storeCount > 1 ? `${activeStore.domain} (${storeCount} mağaza)` : t('teamSwitcher.subtitle')}
            </span>
          </div>
          <ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
        align='start'
        side='bottom'
        sideOffset={4}
      >
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Aktiv Mağazalar ({storeCount})
        </DropdownMenuLabel>
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setActiveStoreId(store.id)}
            className='gap-2 p-2 cursor-pointer'
          >
            <div className='flex size-6 items-center justify-center rounded-sm border'>
              <Store className='size-3.5 shrink-0' />
            </div>
            <div className='flex-1 truncate'>
              <div className='text-xs font-medium'>{store.name}</div>
              <div className='text-[10px] text-muted-foreground'>{store.domain}</div>
            </div>
            {store.id === activeStoreId && <Check className='size-4 text-primary ml-auto' />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className='gap-2 p-2 text-xs font-medium cursor-pointer text-primary'
        >
          <a href='/admin/settings'>
            <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
              <Plus className='size-3.5' />
            </div>
            <span>Bütün Mağazaları İdarə Et</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
