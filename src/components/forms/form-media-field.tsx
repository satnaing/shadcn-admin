import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MediaPicker, type MediaPickerProps } from '@/components/shared/media/media-picker'
import type { MediaRef } from '@/components/shared/media/media.type'

interface Props<T extends FieldValues> extends Pick<MediaPickerProps, 'multiple' | 'accept' | 'max'> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  hint?: string
  className?: string
}

/** RHF field for {@link MediaPicker}; the form value is a `MediaRef[]` (gallery, PDF specs). */
export function FormMediaField<T extends FieldValues>({ form, name, label, hint, className, ...rest }: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MediaPicker {...rest} value={(field.value ?? []) as MediaRef[]} onChange={field.onChange} />
          </FormControl>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
