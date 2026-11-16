import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  hint?: string
  className?: string
}

/** Boxed label + switch bound to a boolean field. */
export function FormSwitchField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex items-center justify-between gap-3 rounded-md border p-3 ${className ?? ''}`}
        >
          <div>
            <FormLabel>{label}</FormLabel>
            {hint && <FormDescription>{hint}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
