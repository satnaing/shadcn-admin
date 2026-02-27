import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import {
  useMembershipProgram,
  useUpdateMembershipProgram,
} from '@/hooks/queries/use-membership'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { PageTitle } from '@/components/page-title'
import {
  type MembershipProgram,
  type MembershipTier,
  membershipProgramSchema,
} from '../data/loyalty-schema'
import { MembershipTierStudio } from './components/membership-tier-studio'

export function MembershipPage() {
  const { data: program, isLoading } = useMembershipProgram()
  const { mutateAsync: updateProgram } = useUpdateMembershipProgram()

  const form = useForm<MembershipProgram>({
    resolver: zodResolver(membershipProgramSchema),
    defaultValues: program || { membershipTiers: [], isActive: false },
  })

  // Sync form when program loads
  useEffect(() => {
    if (program) {
      form.reset(program)
    }
  }, [program, form])

  const onSave = async (data: MembershipProgram) => {
    try {
      await updateProgram(data)
      toast.success('Membership Program Saved')
    } catch (_error) {
      toast.error('Failed to save membership program')
    }
  }

  const handleManualSubmit = (e: React.MouseEvent) => {
    const currentTiers = form.getValues('membershipTiers') || []
    const initialTiers = program?.membershipTiers || []

    const hasDiscountChanged = currentTiers.some(
      (tier: MembershipTier, index: number) => {
        const initialTier = initialTiers[index]
        return (
          !initialTier ||
          tier.discountPercentage !== initialTier.discountPercentage
        )
      }
    )

    if (hasDiscountChanged) {
      e.preventDefault()
      if (
        window.confirm(
          'Warning: This change will trigger a global background price refresh. Please ensure this is performed during operation downtime to avoid system lag'
        )
      ) {
        form.handleSubmit(onSave)()
      }
    } else {
      form.handleSubmit(onSave)()
    }
  }

  if (isLoading || !program) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col space-y-8 p-8'>
      <Form {...form}>
        <div className='flex items-center justify-between'>
          <PageTitle
            title='Membership Program'
            subtitle='Manage customer loyalty tiers, qualification gates and tiered rewards.'
          />

          <div className='flex items-center gap-6'>
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between space-y-0 space-x-2'>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm font-medium'>
                    Program Enabled
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className='flex flex-col items-end gap-1'>
              <div className='flex items-center gap-2 rounded-full border border-yellow-100 bg-yellow-50 px-3 py-1 text-[10px] font-bold tracking-tight text-yellow-700 uppercase dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-500'>
                <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500' />
                Sync Engine Active
              </div>
              {program.lastProductSync && (
                <span className='text-[10px] text-muted-foreground'>
                  Last Sync:{' '}
                  {new Date(program.lastProductSync).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <form className='space-y-8' onSubmit={form.handleSubmit(onSave)}>
          <div className='rounded-2xl border bg-card p-8 text-foreground shadow-sm'>
            <FormField
              control={form.control}
              name='membershipTiers'
              render={({ field }) => (
                <MembershipTierStudio
                  tiers={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className='flex justify-end border-t pt-4 font-bold'>
            <Button
              size='lg'
              className='rounded-full px-8 shadow-lg transition-all hover:scale-105 active:scale-95'
              type='button'
              onClick={handleManualSubmit}
              disabled={!form.formState.isDirty}
            >
              <Save className='mr-2 h-5 w-5' />
              Save Membership Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
