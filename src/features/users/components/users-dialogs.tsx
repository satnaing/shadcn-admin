import { useUsers } from '../context/users-context'
import { UsersDeleteDialog } from './users-delete-dialog'
import { StudentDetail } from './StudentDetail'
import EditProvider from '../context/edit-context'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      {currentRow && (
        <>
          {open === 'edit' && (
            <div className="w-full lg:w-[420px] h-[calc(100vh-150px)] sticky top-[80px]">
              <EditProvider>
                <StudentDetail
                  student_id={currentRow.student_id}
                />
              </EditProvider>
            </div>
          )}

          <UsersDeleteDialog
            key={`user-delete-${currentRow.student_id}`}
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
