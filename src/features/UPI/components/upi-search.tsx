import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UPISearchProps {
  onSearch: (params: {
    customer_id?: string
    utr?: string
    txn_status?: string
    isDownload?: boolean
  }) => void
  onReset: () => void
}

export function UPISearch({
  onSearch,
  onReset,
}: UPISearchProps) {
  const [fields, setFields] = useState<{
    customer_id: string
    utr: string
    txn_status: string
    isDownload: boolean
  }>({
    customer_id: '',
    utr: '',
    txn_status: '',
    isDownload: false,
  })

  const [statusOptions, setStatusOptions] = useState<string[]>([])

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
  const getToken = () => {
    const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : ''
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams: any = {}
    if (fields.customer_id) searchParams.customer_id = fields.customer_id
    if (fields.utr) searchParams.utr = fields.utr
    if (fields.txn_status) searchParams.txn_status = fields.txn_status
    if (fields.isDownload) searchParams.isDownload = fields.isDownload
    onSearch(searchParams)
  }

  const handleReset = () => {
    setFields({
      customer_id: '',
      utr: '',
      txn_status: '',
      isDownload: false,
    })
    onReset()
  }

  useEffect(() => {
    const fetchStatusTypes = async () => {
      try {
        const token = getToken()
        const response = await axios.get(
          `${BACKEND_BASE_URL}/v1/upi/getAllStatusTypes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        )

        if (response.data?.status) {
          setStatusOptions(response.data.status)
        }
      } catch (error) {
        console.error('Failed to fetch status types:', error)
      }
    }

    fetchStatusTypes()
  }, [BACKEND_BASE_URL])

  const handleDownload = async () => {
    const token = getToken()
    const params = {
      page: 1,
      limit: 1000, // Large limit for download
      ...(fields.customer_id && { customer_id: fields.customer_id }),
      ...(fields.utr && { utr: fields.utr }),
      ...(fields.txn_status && { txn_status: fields.txn_status }),
      isDownload: true,
    }
    
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/v1/upi/getUpiTxns`,
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
      
      let filename = 'upi-transactions.xlsx'
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
        alert('No transactions found for the selected criteria.')
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
    } catch (error) {
      console.error('Failed to download:', error)
      alert('Failed to download Excel file.')
    }
  }

  return (
    <form onSubmit={handleSearch} className='flex flex-wrap gap-2'>
      {/* Inputs row */}
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
            Customer ID
          </label>
          <Input
            name='customer_id'
            value={fields.customer_id}
            onChange={handleChange}
            placeholder='Enter Customer ID'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
            UTR Number
          </label>
          <Input
            name='utr'
            value={fields.utr}
            onChange={handleChange}
            placeholder='Enter UTR Number'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>
            Transaction Status
          </label>
          <Select
            value={fields.txn_status}
            onValueChange={(value) =>
              setFields({ ...fields, txn_status: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Transaction Status' />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center space-x-2 pt-6'>
          <Checkbox
            id='isDownload'
            checked={fields.isDownload}
            onCheckedChange={(checked) =>
              setFields({ ...fields, isDownload: checked as boolean })
            }
          />
          <label
            htmlFor='isDownload'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Download File
          </label>
        </div>
      </div>
      {/* Buttons row */}
      <div className='mt-2 flex w-full gap-2'>
        <Button
          type='submit'
          className='h-9'
          disabled={Object.values(fields).every(
            (value) =>
              value === '' || value === false
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
              value === '' || value === false
          )}
        >
          <IconDownload className='mr-1' />
          Download Report
        </Button>
      </div>
    </form>
  )
}
