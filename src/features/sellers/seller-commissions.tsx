import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CommissionRuleDialog } from './components/commission-rule-dialog'
import { CommissionRulesTable } from './components/commission-rules-table'
import { type CommissionRuleItem } from './data/sellers.type'
import { useSellerCommissions, useSellerMutations } from './hooks/useSellers'

export function SellerCommissions() {
  const { t } = useTranslation('sellers')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading } = useSellerCommissions()
  const { commissionMutation, deleteCommissionMutation } = useSellerMutations()

  const rules = data?.data ?? []

  const handleAddRule = (payload: Partial<CommissionRuleItem>) => {
    commissionMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('messages.commissionCreated', 'Komissiya qaydası əlavə edildi!'))
        setDialogOpen(false)
      },
    })
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('titles.commissions', 'Komissiya Qaydaları (E31)')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.commissionsSubtitle', 'Çoxölçülü komissiya strukturu: kateqoriya, brend və satıcı prioritetləri')}
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className='gap-2'>
            <Plus className='size-4' />
            {t('commission.addNew', 'Yeni Komissiya Qaydası')}
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {t('commission.baseRate', 'Standart Platforma Komissiyası')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-black text-primary'>10.0%</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Xüsusi qayda təyin edilməyən bütün məhsullara tətbiq olunur
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {t('commission.activeRules', 'Aktiv Xüsusi Qaydalar')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-black'>{rules.length} qayda</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Prioritetə əsasən ən yüksək xallı qayda hesablamada əsas götürülür
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <CommissionRulesTable
            rules={rules}
            isLoading={isLoading}
            onDelete={(id) => deleteCommissionMutation.mutate(id)}
          />
        </div>

        <CommissionRuleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleAddRule}
        />
      </Main>
    </>
  )
}

export default SellerCommissions
