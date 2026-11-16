import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  useAffiliateOptions,
  useAffiliateSettings,
} from '../hooks/use-affiliate'
import { AffiliateCategoryCard } from './affiliate-category-card'
import { AffiliateFirstPurchaseCard } from './affiliate-first-purchase-card'
import { AffiliateProductSharingCard } from './affiliate-product-sharing-card'
import { AffiliateSettingsCard } from './affiliate-settings-card'

/** Withdraw limit, link validity and the three commission rules. Each card saves on its own. */
export function AffiliateConfigPage() {
  const { t } = useTranslation('affiliate')
  const settings = useAffiliateSettings().data?.data
  const options = useAffiliateOptions().data?.data

  return (
    <AdminPageShell
      title={t('config.title')}
      description={t('config.description')}
    >
      {settings && options ? (
        <div className='grid gap-6 xl:grid-cols-2'>
          <AffiliateSettingsCard
            key={JSON.stringify(settings)}
            defaults={settings}
          />
          <AffiliateFirstPurchaseCard
            key={JSON.stringify(options.user_registration_first_purchase)}
            defaults={options.user_registration_first_purchase}
          />
          <AffiliateProductSharingCard
            key={JSON.stringify(options.product_sharing)}
            defaults={options.product_sharing}
          />
          <AffiliateCategoryCard
            key={JSON.stringify(options.category_wise_affiliate)}
            defaults={options.category_wise_affiliate}
          />
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
