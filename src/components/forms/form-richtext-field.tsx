import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RichTextEditor } from '@/components/shared/rich-text/rich-text-editor'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  hint?: string
  placeholder?: string
  limit?: number
  readOnly?: boolean
  className?: string
}

/** RHF field for {@link RichTextEditor}; the form value is the HTML string. */
export function FormRichTextField<T extends FieldValues>({ form, name, label, hint, className, ...rest }: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RichTextEditor {...rest} value={String(field.value ?? '')} onChange={field.onChange} />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
