import { useState, useEffect } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Team } from '../data/teams'
import { Edit, Archive, Eye } from 'lucide-react'
import { useTeams } from './teams-provider'
import { teams as initialTeams } from '../data/teams'
import { TeamsDialogs } from './teams-dialogs'

const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'name',
    header: 'Team Name',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'membersCount',
    header: 'Members',
    cell: ({ row }) => <div>{row.getValue('membersCount')}</div>,
  },
  {
    accessorKey: 'visibility',
    header: 'Visibility',
    cell: ({ row }) => (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${row.getValue('visibility') === 'public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {row.getValue('visibility')}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const team = row.original

      return (
        <div className='flex space-x-2'>
          <Button variant='outline' size='sm' onClick={() => console.log('View team', team)}>
            <Eye className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleEditTeam(team)}>
            <Edit className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleArchiveTeam(team.id)}>
            <Archive className='h-4 w-4' />
          </Button>
        </div>
      )
    },
  },
]

export function TeamsTable() {
  const { teams, setTeams, archiveTeam } = useTeams()
  const [tableData, setTableData] = useState<Team[]>([])
  const [editingTeam, setEditingTeam] = useState<Team | undefined>()

  useEffect(() => {
    if (teams.length === 0) {
      setTeams(initialTeams)
    } else {
      setTableData(teams)
    }
  }, [teams, setTeams])
  const handleArchiveTeam = (teamId: string) => {
    archiveTeam(teamId)
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
  }

  const handleCloseEdit = () => {
    setEditingTeam(undefined)
  }

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No teams found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TeamsDialogs editingTeam={editingTeam} onCloseEdit={handleCloseEdit} />
    </div>
  )
}
