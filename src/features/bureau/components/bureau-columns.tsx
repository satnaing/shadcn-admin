
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

export interface BureauRow {
  score: string;
  reportId: string;
  bureauType: string;
}

export const columns: ColumnDef<BureauRow>[] = [
  {
    accessorKey: 'score',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('score')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'reportId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Report ID" />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('reportId')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'bureauType',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bureau Type" />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('bureauType')}</div>,
    enableHiding: false,
  },
];
