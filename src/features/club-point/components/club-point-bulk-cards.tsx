import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import {
  type AllProductsFormValues,
  type RangeFormValues,
  allProductsSchema,
  rangeSchema,
} from '../data/club-point.schema'
import { useClubPointMutations } from '../hooks/use-club-point-mutations'
import { ClubPointFormCard } from './club-point-form-card'

const permission = PERMISSIONS.CLUB_POINT.PRODUCTS_MANAGE

/** Same flat point value for every product whose price lies between min and max. */
export function ClubPointRangeCard() {
  const { t } = useTranslation('club_point')
  const { saveRange } = useClubPointMutations()
  const form = useForm<RangeFormValues>({
    resolver: zodResolver(rangeSchema),
    defaultValues: { point: 0, min_price: 0, max_price: 0 },
  })

  return (
    <ClubPointFormCard
      form={form}
      title={t('range.title')}
      description={t('range.description')}
      permission={permission}
      pending={saveRange.isPending}
      onSubmit={(v) => saveRange.mutate(v)}
    >
      <FormInputField
        form={form}
        name='point'
        type='number'
        label={t('range.point')}
      />
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormInputField
          form={form}
          name='min_price'
          type='number'
          label={t('range.min')}
        />
        <FormInputField
          form={form}
          name='max_price'
          type='number'
          label={t('range.max')}
        />
      </div>
    </ClubPointFormCard>
  )
}

/** Every product earns this many points per unit of its price. */
export function ClubPointAllCard() {
  const { t } = useTranslation('club_point')
  const { saveAll } = useClubPointMutations()
  const form = useForm<AllProductsFormValues>({
    resolver: zodResolver(allProductsSchema),
    defaultValues: { point: 1 },
  })

  return (
    <ClubPointFormCard
      form={form}
      title={t('all.title')}
      description={t('all.description')}
      permission={permission}
      pending={saveAll.isPending}
      onSubmit={(v) => saveAll.mutate(v.point)}
    >
      <FormInputField
        form={form}
        name='point'
        type='number'
        label={t('all.point')}
        hint={t('all.pointHint')}
      />
    </ClubPointFormCard>
  )
}
