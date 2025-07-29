import {ColumnDef} from '@tanstack/react-table';
import type {WealthData} from './wealth-table';
import {DataTableColumnHeader} from './data-table-column-header';
import StatusModal from './status-modal';
import axios from 'axios';

const getToken = () =>{
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null;
}

export const wealthColumns: ColumnDef<WealthData>[] = [
   {
    accessorKey: 'status',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row })=>{
      const data = row.original

      if(data.status==='pending'){
        return (<StatusModal 
        name={data.name}
        onSubmit={async(newStatus)=>{
          try{
            const token = getToken();
            await axios.post(
              `${import.meta.env.VITE_BACKEND_BASE_URL}/v1/wealth/ifa/update-user`,
              {
                customerId: data.customerId,
                status: newStatus,
              },
              {
                headers: {
                  Authorization : `Bearer ${token}`,
                },
              }
            )
            alert(`Status updated to ${newStatus}`)
            window.location.reload()
          } catch(error){
            alert(`failed to update status: ${error}`)
          }
        }}
        >
          <span className="cursor-pointer underline text-blue-500">
            {data.status}
          </span>
        </StatusModal>
        )
      }
      return <span className='capitalize' >{data.status}</span>
    }
    },
  {
    accessorKey: 'customerId',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Customer ID' />
    ),
  },
  {
    accessorKey: 'name',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'mobile',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Mobile' />
    ),
  },
  {
    accessorKey: 'product',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
  },
  {
    accessorKey: 'pan',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='PAN' />
    ),
  },
  {
    accessorKey: 'accountNumber',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Account Number' />
    ),
  },
  {
    accessorKey: 'bankName',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Bank Name' />
    ),
  },
  {
    accessorKey: 'ifsc',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='IFSC' />
    ),
  },
  {
    accessorKey: 'email',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
  },
  {
    accessorKey: 'aadhar',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Aadhar' />
    ),
  },
  {
    accessorKey: 'panImgUrl',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='PAN Image URL' />
    ),
  },
  {
    accessorKey: 'aadharImgUrl',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Aadhar Image URL' />
    ),
    },
    {
    accessorKey: 'cancelledChequeImgUrl',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Cancelled Cheque Image URL' />
    ),
    },
   
    {
      accessorKey: 'arn',
      header:({column})=>(
        <DataTableColumnHeader column = {column} title='ARN'/>
      )
    },
    {
      accessorKey: 'companyName',
      header: ({column})=>(
       < DataTableColumnHeader column={column} title='Company Name'/>
      )
    }
]