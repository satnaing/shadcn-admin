import {
  IconDeviceLaptop,
  IconPrinter,
  IconServer,
  IconPhone,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconRouter,
} from '@tabler/icons-react'
import { DeviceStatus } from './schema'
import type { ComponentType } from 'react'

export const deviceStatusStyles = new Map<DeviceStatus, string>([
  ['in_use', 'bg-green-100/50 text-green-900 dark:text-green-200 border-green-200'],
  ['in_store', 'bg-blue-100/40 text-blue-900 dark:text-blue-100 border-blue-200'],
  ['allocated', 'bg-purple-100/40 text-purple-900 dark:text-purple-200 border-purple-200'],
  ['assigned', 'bg-yellow-100/40 text-yellow-900 dark:text-yellow-100 border-yellow-200'],
  ['disposed', 'bg-neutral-300/40 text-neutral-700 border-neutral-300 line-through'],
  ['fault', 'bg-red-100/40 text-red-900 dark:text-red-200 border-red-200'],
])

export type DeviceTypeOption = {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
}

// Device types for device categorization and dropdowns
export const deviceTypesList: DeviceTypeOption[] = [
  { label: 'Laptop', value: 'laptop', icon: IconDeviceLaptop },
  { label: 'Desktop', value: 'desktop', icon: IconDeviceDesktop },
  { label: 'Tablet', value: 'tablet', icon: IconDeviceTablet },
  { label: 'Mobile', value: 'mobile', icon: IconPhone },
  { label: 'Server', value: 'server', icon: IconServer },
  { label: 'Printer', value: 'printer', icon: IconPrinter },
  { label: 'Network Device', value: 'network_device', icon: IconRouter },
]
