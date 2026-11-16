import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormField, FormItem } from '@/components/ui/form'
import { ImagePicker } from '@/components/image-picker'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
}

export function FormImageField<T extends FieldValues>({
  form,
  name,
  label,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <ImagePicker
            id={`image-${name}`}
            label={label}
            value={field.value}
            onChange={field.onChange}
          />
        </FormItem>
      )}
    />
  )
}
