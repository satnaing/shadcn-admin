import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { upiColumns } from './components/columns'
import { BBPSUploadTablePagination } from './components/pagination'
import { BBPSUpload, BBPSUploadTable } from './components/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function Bpps_Fileupload() {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10
  const [file, setFile] = useState<File | null>(null)
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // ---- Upload Handler ----
  const handleUpload = async () => {
    if (!file || !reason) {
      setStatus('Please select a file and provide a reason.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('fileName', file)
      formData.append('reason', reason)

      const token = getToken()
      const response = await axios.post(
        `${BACKEND_BASE_URL}/v1/bbps/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        setStatus('File uploaded successfully!')

        // 🔹 Auto-clear form
        setFile(null)
        setReason('')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // reset file input
        }

        refetch() // refresh history table
      } else {
        setStatus('Upload failed. Please try again.')
      }
    } catch (err: any) {
      setStatus(err.response?.data?.message || 'An error occurred.')
    }
  }

  // ---- Fetch History ----
  const fetchHistory = async (): Promise<BBPSUpload[]> => {
    const token = getToken()
    const response = await axios.get(
      `${BACKEND_BASE_URL}/v1/bbps/fileUploadHistory`,
      {
        params: { page: pageIndex + 1, limit: pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    //console.log(response.data?.data)
    return response.data?.data || []
  }

  const {
    data: history,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bbps-upload-history', pageIndex, pageSize],
    queryFn: fetchHistory,
  })

  // Defensive mapping
  const mappedData: BBPSUpload[] = (history || []).map((item) => ({
    id: Number(item.id ?? 0),
    file_name: String(item.file_name ?? ''),
    original_path: String(item.original_path ?? ''),
    result_path: String(item.result_path ?? ''),
    reason: String(item.reason ?? ''),
    upload_at: String(item.upload_at ?? ''),
    processed_at: String(item.processed_at ?? ''),
    status: String(item.status ?? ''),
  }))

  // Error handler
  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
      if (err.response?.data?.error) return err.response.data.error
      if (err.response?.data?.message) return err.response.data.message
      return err.message
    }
    if (err instanceof Error) return err.message
    return 'An unknown error occurred'
  }

  return (
    <div>
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>

          <ThemeSwitch />
          <ProfileDropdown />

        </div>
      </Header>

      <Main>
        {/* ---- Upload Section ---- */}

        {/* ---- Upload Section ---- */}
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Upload CSV File</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* File Upload */}
            <div className="flex-1 max-w-xs">
              <Label htmlFor="file">CSV File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="mt-2 w-full"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Reason */}
            <div className="flex-1 max-w-sm">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                type="text"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full"
              />
            </div>
          </div>

          {/* Upload Button */}
          <Button className="w-full sm:w-auto mt-4" onClick={handleUpload}>
            Upload
          </Button>

          {status && (
            <p
              className={`text-sm mt-2 ${status.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {status}
            </p>
          )}
        </div>



        <Separator className="shadow-sm mb-4" />

        {/* ---- History Table ---- */}
        <div className="my-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            File Upload History
          </h2>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
          {isLoading ? (
            <div>Loading history...</div>
          ) : isError ? (
            <div className="text-red-500">Error: {getErrorMessage(error)}</div>
          ) : (
            <>
              <BBPSUploadTable data={mappedData} columns={upiColumns} />
              <BBPSUploadTablePagination
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                hasNextPage={mappedData.length === pageSize}
              />
            </>
          )}
        </div>
      </Main>
    </div>
  )
}
