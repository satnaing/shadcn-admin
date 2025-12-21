import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { UserViewModal } from './user-view-modal'
import { UserEditModal } from './user-edit-modal'
import { createColumns } from './columns'
import type { IUserResponse } from '@/contracts/Response/IUser'

interface DataTableProps {
  data: IUserResponse[]
  onRefresh: () => void
}

export function DataTable({ data, onRefresh }: DataTableProps) {
  const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleViewUser = (user: IUserResponse) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditUser = (user: IUserResponse) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const columns = createColumns({ onViewUser: handleViewUser, onEditUser: handleEditUser })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <UserViewModal 
        user={selectedUser}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />
      <UserEditModal 
        user={selectedUser}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUserUpdated={onRefresh}
      />
    </div>
  )
}