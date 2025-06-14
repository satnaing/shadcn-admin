import { useCompanies } from '../context/companies-context'
import { CompaniesActionDialog } from './companies-action-dialog'
import { CompaniesDeleteDialog } from './companies-delete-dialog'

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCompanies()
  
  return (
    <>
      <CompaniesActionDialog
        key='company-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <CompaniesActionDialog
            key={`user-edit-${currentRow.company_id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CompaniesDeleteDialog
            key={`user-delete-${currentRow.company_id}`}
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
