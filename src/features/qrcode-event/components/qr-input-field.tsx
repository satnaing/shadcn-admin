import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  type?: 'text' | 'number' | 'date' | 'datetime-local'
  hint?: string
  placeholder?: string
  className?: string
}

/** Labelled text/number/date input bound to react-hook-form (numbers are stored as numbers). */
export function QrInputField<T extends FieldValues>({
  form, name, label, type = 'text', hint, placeholder, className,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
            />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
