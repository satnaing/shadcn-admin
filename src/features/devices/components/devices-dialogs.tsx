import { useDevices } from '../context/devices-context.tsx'
import { DeviceActionDialog } from './devices-action-dialog.tsx'
import { DeviceDeleteDialog } from './devices-delete-dialog.tsx'
import { DeviceImportDialog } from '@/features/devices/components/device-import-dialog.tsx'
export function DevicesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDevices()

  return (
    <>
      <DeviceActionDialog
        key='device-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <DeviceImportDialog
        key='device-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <DeviceActionDialog
            key={`device-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <DeviceDeleteDialog
            key={`device-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
