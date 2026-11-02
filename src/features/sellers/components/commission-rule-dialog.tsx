import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type CommissionRuleItem } from '../data/sellers.type'

interface CommissionRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: Partial<CommissionRuleItem>) => void
}

export function CommissionRuleDialog({ open, onOpenChange, onSave }: CommissionRuleDialogProps) {
  const { t } = useTranslation('sellers')
  const [ruleName, setRuleName] = useState('')
  const [catName, setCatName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [rate, setRate] = useState('10')
  const [priority, setPriority] = useState('1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: ruleName,
      category_name: catName || undefined,
      brand_name: brandName || undefined,
      rate_percentage: Number(rate) || 0,
      priority: Number(priority) || 1,
    })
    setRuleName('')
    setCatName('')
    setBrandName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>{t('commission.addNew', 'Yeni Komissiya Qaydası')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-3 py-2'>
          <div className='grid gap-1.5'>
            <Label htmlFor='com-name'>{t('commission.name', 'Qayda Adı')}</Label>
            <Input id='com-name' required value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label htmlFor='com-cat'>{t('dialog.category', 'Kateqoriya')}</Label>
              <Input id='com-cat' placeholder='Məs: Elektronika' value={catName} onChange={(e) => setCatName(e.target.value)} />
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='com-brand'>Brend</Label>
              <Input id='com-brand' placeholder='Məs: Apple' value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label htmlFor='com-rate'>{t('commission.rate', 'Faiz (%)')}</Label>
              <Input id='com-rate' type='number' step='0.1' required value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='com-prio'>{t('commission.priority', 'Prioritet')}</Label>
              <Input id='com-prio' type='number' required value={priority} onChange={(e) => setPriority(e.target.value)} />
            </div>
          </div>
          <DialogFooter className='pt-2'>
            <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>{t('dialog.cancel', 'Ləğv et')}</Button>
            <Button type='submit'>{t('dialog.save', 'Yadda saxla')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
