import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WealthSearchProps {
  onSearch: (params: {
    customerId: string
    mobile: string
    pan: string
    email: string
  }) => void
  onReset: () => void
}

export function WealthSearch({ onSearch, onReset }: WealthSearchProps) {
  const [fields, setFields] = useState({
    customerId: '',
    mobile: '',
    pan: '',
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fields)
  }

  const handleReset = () => {
    setFields({
      customerId: '',
      mobile: '',
      pan: '',
      email: '',
    })
    onReset()
  }

  return (
    < form onSubmit={handleSearch} className='mb-4 flex flex-col gap-2'>
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
      <div>
        <label className='mb-1 block text-xs font-semibold'>Mobile</label>
        <Input
          name='mobile'
          value={fields.mobile}
          onChange={handleChange}
          placeholder='Enter Mobile Number'
        />
      </div>
      <div>
        <label className='mb-1 block text-xs font-semibold'>PAN</label>
        <Input
          name='pan'
          value={fields.pan}
          onChange={handleChange}
          placeholder='Enter PAN'
        />
      </div>
      <div>
        <label className='mb-1 block text-xs font-semibold'>Email</label>
        <Input
          name='email'
          value={fields.email}
          onChange={handleChange}
          placeholder='Enter Email'
        />
      </div>
    </div>
    <div className='mt-2 flex gap-2'>
        <Button type='submit'>Search</Button>
        <Button variant='outline' onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  )
}
