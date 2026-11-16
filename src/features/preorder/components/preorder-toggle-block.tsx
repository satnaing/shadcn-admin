import type { ReactNode } from 'react'
import { type Path, useWatch, type UseFormReturn } from 'react-hook-form'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import type { ProductFormValues } from '../data/preorder.schema'

interface Props {
  form: UseFormReturn<ProductFormValues>
  /** Boolean field (e.g. prepayment.enabled) that reveals the children. */
  name: Path<ProductFormValues>
  label: string
  hint?: string
  children: ReactNode
}

/** A feature switch with its settings revealed only while it is on (AEC product form toggles). */
export function PreorderToggleBlock({
  form,
  name,
  label,
  hint,
  children,
}: Props) {
  const on = useWatch({ control: form.control, name })

  return (
    <div className='space-y-3'>
      <FormSwitchField form={form} name={name} label={label} hint={hint} />
      {on ? (
        <div className='grid gap-4 ps-3 md:grid-cols-2'>{children}</div>
      ) : null}
    </div>
  )
}
