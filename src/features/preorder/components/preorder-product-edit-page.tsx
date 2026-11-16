import { useProduct } from '../hooks/use-preorder'
import { PreorderProductForm } from './preorder-product-form'

export function PreorderProductEditPage({ id }: { id: string }) {
  const { data } = useProduct(id)
  if (!data) return <div className='p-6' aria-busy='true' />

  return <PreorderProductForm key={data.data.id} product={data.data} />
}
