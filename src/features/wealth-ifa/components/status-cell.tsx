// components/StatusCell.tsx
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import StatusModal from './status-modal'
import { getToken } from '@/lib/utils' // adjust if needed

interface StatusCellProps {
  data: {
    name: string;
    status: string;
    customerId: string;
  }
  searchParams: {
    customerId: string;
    mobile: string;
    pan: string;
    email: string;
} | null;
  pageIndex: number;
}

export function StatusCell({ data, searchParams, pageIndex }: StatusCellProps) {
  const queryClient = useQueryClient()

  if (data.status !== 'pending') {
    return <span className='capitalize'>{data.status}</span>
  }

  const handleSubmit = async (newStatus: 'approved' | 'rejected') => {
    try {
      const token = getToken()
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/v1/wealth/ifa/update-user`,
        {
          customerId: data.customerId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert(`Status updated to ${newStatus}`)
      queryClient.invalidateQueries({
        queryKey: ['wealth-ifa', searchParams, pageIndex],
      })
    } catch (error) {
      alert(`Failed to update status: ${error}`)
    }
  }

  return (
    <StatusModal name={data.name} onSubmit={handleSubmit}>
      <span className='cursor-pointer underline text-blue-500'>
        {data.status}
      </span>
    </StatusModal>
  )
}
