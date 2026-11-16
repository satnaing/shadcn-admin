import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  hint?: string
  rows?: number
  className?: string
}

export function FormTextareaField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  rows = 4,
  className,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea rows={rows} {...field} value={field.value ?? ''} />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
