import { useState } from 'react'
import {
  useMobileVersions,
  useUpdateMobileVersion,
} from '@/hooks/queries/use-mobile-app'
import { BrandLoader } from '@/components/ui/brand-loader'
import { type MobileAppVersion } from '../data/mobile-app-schema'
import { EditVersionSheet } from './components/edit-version-sheet'
import { MobileAppTable } from './components/mobile-app-table'

export default function MobileAppPage() {
  const { data: versions, isLoading } = useMobileVersions()
  const { mutate: updateVersion } = useUpdateMobileVersion()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingVersion, setEditingVersion] = useState<MobileAppVersion | null>(
    null
  )

  const handleEdit = (version: MobileAppVersion) => {
    setEditingVersion(version)
    setSheetOpen(true)
  }

  const handleSave = (id: string, updatedData: Partial<MobileAppVersion>) => {
    updateVersion({ id, data: updatedData })
    setSheetOpen(false)
    setEditingVersion(null)
  }

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-8'>
        <BrandLoader />
      </div>
    )
  }

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      setEditingVersion(null)
    }
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between space-y-2 p-4 md:p-8'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Mobile App Versions
          </h2>
          <p className='text-muted-foreground'>
            Manage the latest and minimum supported versions for your mobile
            apps.
          </p>
        </div>
      </div>
      <div className='flex-1 flex-col space-y-8 p-8 pt-4'>
        <MobileAppTable
          data={(versions || []) as MobileAppVersion[]}
          onEdit={handleEdit}
        />
      </div>

      <EditVersionSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        version={editingVersion}
        onSave={handleSave}
      />
    </div>
  )
}
