import { useState } from 'react'
import { toast } from 'sonner'
import {
  useLoyaltySettings,
  useUpdateLoyaltySettings,
  useCustomerBalances,
} from '@/hooks/queries/use-loyalty'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import {
  type LoyaltySettings,
  type UserLoyaltyBalance,
} from '../data/loyalty-schema'
import { AdjustBalanceDialog } from './components/adjust-balance-dialog'
import { CustomerBalanceTable } from './components/customer-balance-table'
import { LoyaltySettingsForm } from './components/loyalty-settings-form'

export default function LoyaltyPage() {
  const { data: settings, isLoading: isLoadingSettings } = useLoyaltySettings()
  const { mutateAsync: updateSettings } = useUpdateLoyaltySettings()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: balanceData, isLoading: isLoadingBalances } =
    useCustomerBalances({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    })

  const [adjustUser, setAdjustUser] = useState<UserLoyaltyBalance | null>(null)

  const handleSaveSettings = async (data: LoyaltySettings) => {
    try {
      await updateSettings(data)
      toast.success('Loyalty Program Updated')
    } catch (_error) {
      toast.error('Failed to update loyalty program')
    }
  }

  const handleAdjustBalance = (
    _amount: number,
    _reason: string,
    _managerPin: string
  ) => {
    if (!adjustUser) return
    // TODO: Implement real balance adjustment API call if needed
    toast.info('Balance adjustment needs API implementation')
  }

  if (isLoadingSettings || isLoadingBalances || !settings) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  const balances = balanceData?.data || []
  const pageCount = balanceData?.meta?.totalPages || 1

  return (
    <div className='flex flex-col space-y-6 p-8'>
      <PageTitle
        title='Loyalty & Referrals'
        subtitle='Configure stamp earning rules and manage customer stamp balances.'
      />

      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <LoyaltySettingsForm
            initialData={settings}
            onSave={handleSaveSettings}
          />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Customer Balances</h3>
            <CustomerBalanceTable
              data={balances}
              onAdjust={setAdjustUser}
              pageCount={pageCount}
              pagination={pagination}
              onPaginationChange={setPagination}
            />
          </div>
        </div>

        {/* Helper / Info Column */}
        <div className='space-y-6'>
          <div className='rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100'>
            <h4 className='mb-2 font-semibold'>How it works</h4>
            <ul className='list-inside list-disc space-y-1 text-sm'>
              <li>Customers earn stamps automatically on checkout.</li>
              <li>Stamps can be redeemed for free rewards.</li>
              <li>
                Referral bonuses apply when a new user completes their first
                order.
              </li>
            </ul>
          </div>
          <div className='rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100'>
            <h4 className='mb-2 font-semibold'>Tips</h4>
            <p className='text-sm'>
              The Stamp Card duration ensures stamps are valid for its duration.
              Eligible reward items will be free upon stamp card completion.
            </p>
          </div>
        </div>
      </div>

      <AdjustBalanceDialog
        open={!!adjustUser}
        onOpenChange={(open) => !open && setAdjustUser(null)}
        user={adjustUser}
        onConfirm={handleAdjustBalance}
      />
    </div>
  )
}
