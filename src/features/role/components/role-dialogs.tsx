import { RoleForm } from './role-form'
import { useRoleContext } from './role-provider'

export function RoleDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoleContext()
  return (
    <>
      <RoleForm
        mode='create'
        key='role-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <RoleForm
          mode='edit'
          key={`role-edit-${currentRow.id}`}
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
