import { PermissionForm } from './permission-form'
import { usePermissionContext } from './permission-provider'

export function PermissionDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePermissionContext()
  return (
    <>
      <PermissionForm
        mode='create'
        key='permission-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <PermissionForm
          mode='edit'
          key={`permission-edit-${currentRow.id}`}
          open={open === 'edit'}
          onOpenChange={() => {
            setOpen('edit')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
