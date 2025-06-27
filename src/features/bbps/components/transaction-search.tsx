import { useState } from 'react'
import { IconDeviceMobile, IconCalendar } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TransactionSearchProps {
  onSearch: (params: {
    id: string
    bbpsReferenceCode: string
    phone: string
    start_date: string
    end_date: string
    category: string
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
    phone: '',
    start_date: '',
    end_date: '',
    category: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    //console.log(fields)
    onSearch(fields)
  }
  const handleReset = () => {
    setFields({
      id: '',
      bbpsReferenceCode: '',
      phone: '',
      start_date: '',
      end_date: '',
      category: '',
    })
    onReset()
  }

  return (
    <form onSubmit={handleSearch} className='flex flex-wrap gap-2'>
      {/* Inputs row */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <div>
          <label className='mb-1 block text-xs font-semibold'>Transaction ID</label>
          <Input
            name='id'
            value={fields.id}
            onChange={handleChange}
            placeholder='Enter Transaction ID'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>BBPS Reference Code</label>
          <Input
            name='bbpsReferenceCode'
            value={fields.bbpsReferenceCode}
            onChange={handleChange}
            placeholder='Enter BBPS Reference Code'
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-semibold'>Phone</label>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400'>
              <IconDeviceMobile size={18} />
            </span>
            <Input
              name='phone'
              value={fields.phone}
              onChange={handleChange}
              placeholder='Enter Phone Number'
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
              placeholder='Pick a start date'
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
              placeholder='Pick a end date'
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
      </div>
      {/* Buttons row */}
      <div className='flex gap-2 w-full mt-2'>
        <Button type='submit' className='h-9'>
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
      </div>
    </form>
  )
}
