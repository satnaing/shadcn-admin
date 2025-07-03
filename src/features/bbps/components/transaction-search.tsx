import { useState } from 'react'
import { IconDeviceMobile, IconCalendar, IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import axios from 'axios'

interface TransactionSearchProps {
  onSearch: (params: {
    id: string
    bbpsReferenceCode: string
    mobileNumber: string
    start_date: string
    end_date: string
    category: string
    customerId: string
    paymentStatus: string
  }) => void
  onReset: () => void
}

export function TransactionSearch({
  onSearch,
  onReset,
}: TransactionSearchProps) {
  const [fields, setFields] = useState({
    id: '',
    bbpsReferenceCode: '',
    mobileNumber: '',
    start_date: '',
    end_date: '',
    category: '',
    customerId: '',
    paymentStatus: '',
  })

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const getToken = () => {
    const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : ''
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(fields)
  }
  const handleReset = () => {
    setFields({
      id: '',
      bbpsReferenceCode: '',
      mobileNumber: '',
      start_date: '',
      end_date: '',
      category: '',
      customerId: '',
      paymentStatus: '',
    })
    onReset()
  }

  const handleDownload = async () => {
    const token = getToken();
    const params = {
      ...(fields.id && { transaction_id: fields.id }),
      ...(fields.bbpsReferenceCode && { bbps_ref_no: fields.bbpsReferenceCode }),
      ...(fields.customerId && { customer_id: fields.customerId }),
      ...(fields.paymentStatus && { status: fields.paymentStatus }),
      ...(fields.mobileNumber && { mobile: fields.mobileNumber }),
      ...(fields.category && { category: fields.category }),
      ...(fields.start_date && { start_date: fields.start_date }),
      ...(fields.end_date && { end_date: fields.end_date }),
      isDownload: true,
    };
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/v1/bbps/getAllTransactions`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
          withCredentials: true,
        }
      );
      let filename = 'bbps-transactions.xlsx';
      const disposition = response.headers['content-disposition'];
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
      const blob = new Blob([response.data]);
      if (blob.size < 2000) {
        alert('No transactions found for the selected range.');
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download Excel.');
    }
  }

  return (
    <form onSubmit={handleSearch} className='flex flex-wrap gap-2'>
      {/* Inputs row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
           PG Transaction ID
          </label>
          <Input
            name='id'
            value={fields.id}
            onChange={handleChange}
            placeholder='Enter PG Transaction ID'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
            BBPS Reference Code
          </label>
          <Input
            name='bbpsReferenceCode'
            value={fields.bbpsReferenceCode}
            onChange={handleChange}
            placeholder='Enter BBPS Reference Code'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
            Customer ID
          </label>
          <Input
            name='customerId'
            value={fields.customerId}
            onChange={handleChange}
            placeholder='Enter Customer ID'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>Mobile </label>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400'>
              <IconDeviceMobile size={18} />
            </span>
            <Input
              name='mobileNumber'
              value={fields.mobileNumber}
              onChange={handleChange}
              placeholder='Enter Mobile Number' 
              className='pl-8'
            />
          </div>
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>Start Date</label>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400'>
              <IconCalendar size={18} />
            </span>
            <Input
              name='start_date'
              value={fields.start_date}
              onChange={handleChange}
              placeholder='YYYY-MM-DD'
              className='pl-8'
            />
          </div>
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>End Date</label>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400'>
              <IconCalendar size={18} />
            </span>
            <Input
              name='end_date'
              value={fields.end_date}
              onChange={handleChange}
              placeholder='YYYY-MM-DD'
              className='pl-8'
            />
          </div>
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>Category</label>
          <Select
            value={fields.category}
            onValueChange={(value) => setFields({ ...fields, category: value })}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Prepaid'>Prepaid</SelectItem>
              <SelectItem value='Postpaid'>Postpaid</SelectItem>
              <SelectItem value='Gas'>Gas</SelectItem>
              <SelectItem value='Electricity'>Electricity</SelectItem>
              <SelectItem value='DTH'>DTH</SelectItem>
              <SelectItem value='Credit Card'>Credit Card</SelectItem>
              <SelectItem value='Fastag'>Fastag</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
            Payment Status
          </label>
          <Select
            value={fields.paymentStatus}
            onValueChange={(value) =>
              setFields({ ...fields, paymentStatus: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Payment Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='initiated'>Initiated</SelectItem>
              <SelectItem value='success'>Success</SelectItem>
              <SelectItem value='payment_processing_error'>
                Payment Processing Error
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Buttons row */}
      <div className='flex gap-2 w-full mt-2'>
        <Button type='submit' className='h-9' disabled={Object.values(fields).every((value) => value === '')}>
          Search
        </Button>
        <Button
          type='button'
          variant='outline'
          className='h-9'
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          type='button'
          variant='outline'
          className='h-9'
          onClick={handleDownload}
          disabled={Object.values(fields).every((value) => value === '')}
        >
          <IconDownload className='mr-1' />
          Download Report
        </Button>
      </div>
    </form>
  )
}
