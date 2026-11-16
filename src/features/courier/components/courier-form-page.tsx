import { useCourier } from '../hooks/use-courier'
import { CourierForm } from './courier-form'

/** Create (no id) or edit; edit waits for the record, then mounts the form keyed by it. */
export function CourierFormPage({ id }: { id?: string }) {
  const { data } = useCourier(id)
  if (id && !data) return <div className='p-6' aria-busy='true' />

  return <CourierForm key={data?.data.id ?? 'new'} courier={data?.data} />
}
