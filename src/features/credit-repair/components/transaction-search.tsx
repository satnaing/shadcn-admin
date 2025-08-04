import React, { useState } from 'react'
import axios from 'axios'
import {  IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


interface TransactionSearchProps {
  onSearch: (params: {
    id: string
    creditRepairReferenceCode: string
    start_date: string
    end_date: string
    customerId: string
    accountNo: string
    paymentStatus: string
  }) => void
  onReset: () => void
}

export function TransactionSearch({
  onSearch,
  onReset,
}: TransactionSearchProps) {
  const [fields, setFields] = useState<{
    id: string
    creditRepairReferenceCode: string
    start_date: string
    end_date: string
    customerId: string
    accountNo: string
    paymentStatus: string
  }>({
    id: '',
    creditRepairReferenceCode: '',
    start_date: '',
    end_date: '',
    customerId: '',
    accountNo: '',
    paymentStatus: '',
  })

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
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
      creditRepairReferenceCode: '',
      start_date: '',
      end_date: '',
      customerId: '',
      accountNo: '',
      paymentStatus: '',
    })
    onReset()
  }

  const handleDownload = async () => {
    const token = getToken()
    const params = {
      ...(fields.id && { transaction_id: fields.id }),
      ...(fields.creditRepairReferenceCode && {
        bbps_ref_no: fields.creditRepairReferenceCode,
      }),
      ...(fields.customerId && { customer_id: fields.customerId }),
      ...(fields.accountNo && { account_no: fields.accountNo }),
      ...(fields.paymentStatus && { status: fields.paymentStatus }),
      ...(fields.start_date && { start_date: fields.start_date }),
      ...(fields.end_date && { end_date: fields.end_date }),
      isDownload: true,
    }
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/v1/bbps/getAllTransactions`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
          withCredentials: true,
        }
      )
      let filename = 'bbps-transactions.xlsx'
      const disposition = response.headers['content-disposition']
      if (disposition) {
        const match = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        )
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '')
        }
      }
      const blob = new Blob([response.data])
      if (blob.size < 2000) {
        alert('No transactions found for the selected range.')
        return
      }
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Failed to download Excel.')
    }
  }

  return (
    <form onSubmit={handleSearch} className='flex flex-wrap gap-2'>
      {/* Inputs row */}
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        
        
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

      </div>
      {/* Buttons row */}
      <div className='mt-2 flex w-full gap-2'>
        <Button
          type='submit'
          className='h-9'
          disabled={Object.values(fields).every(
            (value) =>
              value === '' || (Array.isArray(value) && value.length === 0)
          )}
        >
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
          disabled={Object.values(fields).every(
            (value) =>
              value === '' || (Array.isArray(value) && value.length === 0)
          )}
        >
          <IconDownload className='mr-1' />
          Download Report
        </Button>
      </div>
    </form>
  )
}
