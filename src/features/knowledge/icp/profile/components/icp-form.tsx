import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { type TargetMarketUpsertInput } from '@/graphql/global/types.generated'
import { DollarSign, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import CountrySelector from '@/components/country-selector'
import {
  useTargetMarketUpsertMutation,
  type TargetMarketFieldsFragment,
  TargetMarketsDocument,
} from '../../graphql/operations.generated'
import { formatNumber } from '../../utils'

type FormData = Omit<TargetMarketUpsertInput, 'minRevenue' | 'maxRevenue'> & {
  minRevenue: number
  maxRevenue?: number | null
}

interface ICPFormProps {
  profile?: TargetMarketFieldsFragment | null
  isNew: boolean
}

export default function ICPForm({ profile, isNew }: ICPFormProps) {
  const navigate = useNavigate()
  const [upsertMutation, { loading }] = useTargetMarketUpsertMutation({
    refetchQueries: [{ query: TargetMarketsDocument }],
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>()

  const [minRev, maxRev, minEmp, maxEmp] = watch([
    'minRevenue',
    'maxRevenue',
    'minEmployees',
    'maxEmployees',
  ])

  useEffect(() => {
    if (isNew) {
      reset({
        name: '',
        customerType: 'B2B',
        minRevenue: 0,
        maxRevenue: null,
        minEmployees: 0,
        maxEmployees: null,
        hqLocations: [],
        extraRequirements: '',
        industry: '',
      })
    } else if (profile) {
      reset({
        id: profile.id,
        name: profile.name || '',
        customerType: profile.customerType || 'B2B',
        minRevenue: Number(profile.minRevenue) || 0,
        maxRevenue: profile.maxRevenue ? Number(profile.maxRevenue) : null,
        minEmployees: profile.minEmployees || 0,
        maxEmployees: profile.maxEmployees || null,
        hqLocations: profile.hqLocations || [],
        extraRequirements: profile.extraRequirements || '',
        industry: profile.industry || '',
      })
    }
  }, [profile, isNew, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const result = await upsertMutation({
        variables: {
          input: {
            ...data,
            maxEmployees: data.maxEmployees === Infinity ? null : data.maxEmployees,
            maxRevenue: data.maxRevenue === Infinity ? null : data.maxRevenue?.toString(),
            minRevenue: data.minRevenue.toString(),
          },
        },
      })

      toast.success(isNew ? 'ICP profile created' : 'ICP profile updated', {
        description: isNew
          ? 'Your new ICP profile has been created successfully. You may now add personas to this profile.'
          : 'Your changes have been saved.',
      })

      if (isNew && result.data?.targetMarketUpsert.id) {
        navigate({
          to: '/knowledge/icp/$profileId',
          params: { profileId: result.data.targetMarketUpsert.id },
        })
      }
    } catch (_error) {
      toast.error(`Failed to ${isNew ? 'create' : 'update'} ICP profile`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Name */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Name *</Label>
        <Input
          id='name'
          {...register('name', {
            required: 'Name is required',
            maxLength: { value: 100, message: 'Maximum 100 characters' },
          })}
          placeholder='e.g. Enterprise SaaS Companies'
        />
        {errors.name && <p className='text-destructive text-sm'>{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='extraRequirements'>Description</Label>
        <Textarea
          id='extraRequirements'
          {...register('extraRequirements', {
            maxLength: { value: 1000, message: 'Max 1000 characters' },
          })}
          placeholder='Describe your ideal customer profile in detail'
          rows={4}
        />
        <p className='text-muted-foreground text-sm'>
          Provide a free-form description of your target market
        </p>
        {errors.extraRequirements && (
          <p className='text-destructive text-sm'>{errors.extraRequirements.message}</p>
        )}
      </div>

      {/* Additional Requirements Section */}
      <div className='mt-8 space-y-6'>
        <h3 className='font-semibold'>Additional Requirements</h3>

        {/* Industry */}
        <div className='space-y-2'>
          <Label htmlFor='industry'>Industry</Label>
          <Input
            id='industry'
            {...register('industry')}
            placeholder='e.g. SaaS, FinTech, Healthcare'
          />
          <p className='text-muted-foreground text-sm'>
            Leave empty if not restricted to specific industries
          </p>
        </div>

        {/* Revenue */}
        <div className='space-y-2'>
          <Label>
            Revenue{' '}
            <span className='text-muted-foreground text-sm'>
              (${formatNumber(minRev || 0)} - {maxRev ? `$${formatNumber(maxRev)}` : 'Unlimited'})
            </span>
          </Label>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <Input
                type='number'
                min={0}
                {...register('minRevenue', {
                  valueAsNumber: true,
                  min: 0,
                })}
                placeholder='Min'
                icon={<DollarSign className='h-4 w-4' />}
              />
            </div>
            <span className='text-muted-foreground text-sm'>to</span>
            <div className='flex-[2] space-y-2'>
              <Input
                type='number'
                min={minRev ? minRev + 1 : 1}
                {...register('maxRevenue', {
                  valueAsNumber: true,
                  min: {
                    value: minRev ? minRev + 1 : 1,
                    message: 'Must be greater than minimum',
                  },
                })}
                placeholder='Max'
                icon={<DollarSign className='h-4 w-4' />}
                disabled={maxRev === null}
              />
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='unlimited-revenue'
                  checked={maxRev === null}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('maxRevenue', null)
                    } else {
                      setValue('maxRevenue', minRev + 1_000_000)
                    }
                  }}
                />
                <Label htmlFor='unlimited-revenue' className='text-sm font-normal'>
                  Unlimited
                </Label>
              </div>
              {errors.maxRevenue && (
                <p className='text-destructive text-sm'>{errors.maxRevenue.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Employee Count */}
        <div className='space-y-2'>
          <Label>
            Employee Count{' '}
            <span className='text-muted-foreground text-sm'>
              ({formatNumber(minEmp || 0)} - {maxEmp ? formatNumber(maxEmp) : 'Unlimited'})
            </span>
          </Label>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <Input
                type='number'
                min={0}
                {...register('minEmployees', {
                  valueAsNumber: true,
                  min: 0,
                })}
                placeholder='Min'
                icon={<Users className='h-4 w-4' />}
              />
            </div>
            <span className='text-muted-foreground text-sm'>to</span>
            <div className='flex-[2] space-y-2'>
              <Input
                type='number'
                min={minEmp ? minEmp + 1 : 1}
                {...register('maxEmployees', {
                  valueAsNumber: true,
                  min: {
                    value: minEmp ? minEmp + 1 : 1,
                    message: 'Must be greater than minimum',
                  },
                })}
                placeholder='Max'
                icon={<Users className='h-4 w-4' />}
                disabled={maxEmp === null}
              />
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='unlimited-employees'
                  checked={maxEmp === null}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('maxEmployees', null)
                    } else {
                      setValue('maxEmployees', minEmp ? minEmp + 1000 : 1000)
                    }
                  }}
                />
                <Label htmlFor='unlimited-employees' className='text-sm font-normal'>
                  Unlimited
                </Label>
              </div>
              {errors.maxEmployees && (
                <p className='text-destructive text-sm'>{errors.maxEmployees.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* HQ Locations */}
        <div className='space-y-2'>
          <Label>Headquarter Locations</Label>
          <CountrySelector control={control} name='hqLocations' withRegions />
          <p className='text-muted-foreground text-sm'>Leave empty if not restricted</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button type='submit' loading={loading}>
          {isNew ? 'Create Profile' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
