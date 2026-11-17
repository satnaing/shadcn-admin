import { useWholesaleProduct } from '../hooks/use-wholesale'
import { WholesaleProductForm } from './wholesale-product-form'

export function WholesaleProductEditPage({ id }: { id: string }) {
  const { data } = useWholesaleProduct(id)
  if (!data) return <div className='p-6' aria-busy='true' />

  return <WholesaleProductForm key={data.data.id} product={data.data} />
}
