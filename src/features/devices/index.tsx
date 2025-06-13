import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { NotificationBell } from '@/components/notification-bell'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/devices-columns.tsx'
import { DevicesDialogs } from './components/devices-dialogs.tsx'
import { DevicesPrimaryButtons } from './components/devices-primary-buttons.tsx'
import { DevicesTable } from './components/devices-table.tsx'
import DevicesProvider from './context/devices-context.tsx'
import { deviceListSchema } from './data/schema'
import { devices } from './data/devices.ts'

export default function Devices() {
  // Parse device list for validation
  const deviceList = deviceListSchema.parse(devices)

  return (
    <DevicesProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Device List</h2>
            <p className='text-muted-foreground'>
              Manage your Devices here.
            </p>
          </div>
          <DevicesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DevicesTable data={deviceList} columns={columns} />
        </div>
      </Main>

      <DevicesDialogs />
    </DevicesProvider>
  )
}
