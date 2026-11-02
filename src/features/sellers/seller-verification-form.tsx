import { useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { type VerificationFieldItem } from './data/sellers.type'
import { useSellerMutations, useVerificationFields } from './hooks/useSellers'

export function SellerVerificationForm() {
  const { t } = useTranslation('sellers')
  const { data } = useVerificationFields()
  const { verificationMutation } = useSellerMutations()

  const [fields, setFields] = useState<VerificationFieldItem[]>(
    data?.data ?? [
      { id: 1, label: 'VÖEN / Vergi Nömrəsi', type: 'text', is_required: true },
      { id: 2, label: 'Şəxsiyyət Vəsiqəsi (Ön/Arxa)', type: 'file', is_required: true },
      { id: 3, label: 'Mağaza Qeydiyyat Şəhadətnaməsi', type: 'file', is_required: false },
    ]
  )

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { id: Date.now(), label: 'Yeni Sahə', type: 'text', is_required: false },
    ])
  }

  const handleRemoveField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  const handleUpdate = (id: number, key: keyof VerificationFieldItem, val: unknown) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: val } : f))
    )
  }

  const handleSaveAll = () => {
    verificationMutation.mutate(fields, {
      onSuccess: () => {
        toast.success(t('messages.verificationSaved', 'Verifikasiya forması konfiqurasiyası yadda saxlanıldı!'))
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
              {t('titles.verificationForm', 'Satıcı Verifikasiya Forması')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.verificationFormSubtitle', 'Satıcıların təsdiqi üçün tələb olunan sənəd və məlumat sahələri')}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleAddField} className='gap-2'>
              <Plus className='size-4' />
              {t('verification.addField', 'Sahə Əlavə Et')}
            </Button>
            <Button onClick={handleSaveAll} className='gap-2'>
              <Save className='size-4' />
              {t('dialog.save', 'Yadda saxla')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>{t('verification.formFields', 'Tələb Olunan Sənəd və Sahələr')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {fields.map((f) => (
              <div key={f.id} className='flex items-center gap-3 rounded-lg border p-3'>
                <Input
                  value={f.label}
                  onChange={(e) => handleUpdate(f.id, 'label', e.target.value)}
                  className='max-w-xs'
                  placeholder='Sahənin adı'
                />
                <Select
                  value={f.type}
                  onValueChange={(val) => handleUpdate(f.id, 'type', val)}
                >
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='text'>Mətn / Say</SelectItem>
                    <SelectItem value='file'>Fayl / Sənəd</SelectItem>
                    <SelectItem value='select'>Seçim (Select)</SelectItem>
                    <SelectItem value='checkbox'>Təsdiq (Checkbox)</SelectItem>
                  </SelectContent>
                </Select>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-muted-foreground'>Mütləqdir:</span>
                  <Switch
                    checked={f.is_required}
                    onCheckedChange={(checked) => handleUpdate(f.id, 'is_required', checked)}
                  />
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='ms-auto text-destructive hover:bg-destructive/10'
                  onClick={() => handleRemoveField(f.id)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

export default SellerVerificationForm
