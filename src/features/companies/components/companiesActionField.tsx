import React from 'react'
import { Control } from 'react-hook-form'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CompanyForm, CompanyFormFieldType } from '../data/schema'

export interface CompanyFormFieldProps {
  name: CompanyFormFieldType
  label: string
  placeholder: string
  control: Control<CompanyForm>
}

export const CompanyFormField = React.memo(
  ({ name, label, placeholder, control }: CompanyFormFieldProps) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1'>
          <FormLabel className='col-span-2 text-right'>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              className='col-span-4'
              {...field}
            />
          </FormControl>
          <FormMessage className='col-span-4 col-start-3' />
        </FormItem>
      )}
    />
  )
)
