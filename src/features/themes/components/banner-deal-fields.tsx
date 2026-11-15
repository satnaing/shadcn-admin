import { ListEditor } from './list-editor'
import { LocalizedField } from './localized-field'
import { TextField } from './text-field'

/** xshop `deal` + senseihost `heroDeal` / `features` / `perks` (front-analysis §4.5). */
export function BannerDealFields() {
  return (
    <>
      <TextField path='percent' type='number' />
      <LocalizedField path='deal.eyebrow' />
      <TextField path='deal.vendor' />
      <TextField path='deal.product_id' />
      <TextField path='deal.stockLeft' type='number' />
      <TextField path='deal.stockTotal' type='number' />
      <TextField path='heroDeal.icon' />
      <TextField path='heroDeal.percent' type='number' />
      <TextField path='heroDeal.priceUsd' type='number' />
      <TextField path='heroDeal.oldPriceUsd' type='number' />
      <TextField path='heroDeal.endsAt' type='datetime-local' />
      <div className='sm:col-span-2'>
        <ListEditor path='features' makeItem={() => ({ icon: '', text: {} })}>
          {(p) => (
            <>
              <TextField path={`${p}.icon`} />
              <LocalizedField path={`${p}.text`} />
            </>
          )}
        </ListEditor>
      </div>
      <div className='sm:col-span-2'>
        <ListEditor path='perks' makeItem={() => ({})}>
          {(p) => <LocalizedField path={p} />}
        </ListEditor>
      </div>
    </>
  )
}
