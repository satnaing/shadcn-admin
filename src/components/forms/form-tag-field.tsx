import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { joinTags, splitTags } from '@/components/shared/tag-input.logic'
import { TagInput } from '@/components/shared/tag-input'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  hint?: string
  placeholder?: string
  className?: string
  maxLength?: number
  maxTags?: number
}

/** RHF field for {@link TagInput}; the form value stays the comma-separated string existing schemas use. */
export function FormTagField<T extends FieldValues>({ form, name, label, hint, className, ...rest }: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TagInput {...rest} value={splitTags(String(field.value ?? ''))} onChange={(tags) => field.onChange(joinTags(tags))} />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
