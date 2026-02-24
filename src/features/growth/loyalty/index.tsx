import { useState } from 'react'
import { toast } from 'sonner'
import {
  useLoyaltySettings,
  useUpdateLoyaltySettings,
} from '@/hooks/queries/use-loyalty'
import { PageTitle } from '@/components/page-title'
import {
  type LoyaltySettings,
  type UserLoyaltyBalance,
} from '../data/loyalty-schema'
import { MOCK_USER_LOYALTY_BALANCES } from '../data/mock-loyalty'
import { AdjustBalanceDialog } from './components/adjust-balance-dialog'
import { CustomerBalanceTable } from './components/customer-balance-table'
import { LoyaltySettingsForm } from './components/loyalty-settings-form'

export default function LoyaltyPage() {
  const { data: settings, isLoading } = useLoyaltySettings()
  const { mutateAsync: updateSettings } = useUpdateLoyaltySettings()

  const [balances, setBalances] = useState<UserLoyaltyBalance[]>(
    MOCK_USER_LOYALTY_BALANCES
  )
  const [adjustUser, setAdjustUser] = useState<UserLoyaltyBalance | null>(null)

  const handleSaveSettings = async (data: LoyaltySettings) => {
    try {
      await updateSettings(data)
      toast.success('Loyalty Program Updated')
    } catch (error) {
      toast.error('Failed to update loyalty program')
    }
  }

  const handleAdjustBalance = (
    amount: number,
    _reason: string,
    _managerPin: string
  ) => {
    if (!adjustUser) return

    const updatedBalances = balances.map((u) => {
      if (u.userId === adjustUser.userId) {
        return { ...u, currentPoints: u.currentPoints + amount }
      }
      return u
    })
    setBalances(updatedBalances)
  }

  return (
    <div className='flex flex-col space-y-6 p-8'>
      <PageTitle
        title='Loyalty & Referrals'
        subtitle='Configure stamp earning rules and manage customer stamp balances.'
      />

      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          {isLoading || !settings ? (
            <div className='flex h-64 items-center justify-center rounded-lg border border-dashed'>
              <p className='text-muted-foreground'>Loading settings...</p>
            </div>
          ) : (
            <LoyaltySettingsForm
              initialData={settings}
              onSave={handleSaveSettings}
            />
          )}

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Customer Balances</h3>
            <CustomerBalanceTable data={balances} onAdjust={setAdjustUser} />
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
