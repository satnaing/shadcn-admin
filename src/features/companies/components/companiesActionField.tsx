import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CompanyForm, CompanyFormFieldType } from '../data/newSchema';

export interface CompanyFormFieldProps {
  name: CompanyFormFieldType;
  label: string;
  placeholder: string;
  control: Control<CompanyForm>;
}

export const CompanyFormField: React.FC<CompanyFormFieldProps> = React.memo(
  ({ name, label, placeholder, control }) => (
    <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
      <FormLabel className="col-span-2 text-right">{label}</FormLabel>
      <FormControl>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input placeholder={placeholder} className="col-span-4" {...field} />
          )}
        />
      </FormControl>
      <FormMessage className="col-span-4 col-start-3" />
    </FormItem>
  )
);
