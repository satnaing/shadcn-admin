import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  options: { value: string; label: string }[]
  /** Store the value as a number (ids). */
  numeric?: boolean
  placeholder?: string
  className?: string
}

export function QrSelectField<T extends FieldValues>({
  form, name, label, options, numeric, placeholder, className,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value ? String(field.value) : ''}
            onValueChange={(v) => field.onChange(numeric ? Number(v) : v)}
          >
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
