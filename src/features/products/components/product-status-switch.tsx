import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface StatusSwitchProps {
  id: number
  field: 'published' | 'featured' | 'todays_deal' | 'approved'
  checked: boolean
  onToggle: (id: number, field: 'published' | 'featured' | 'todays_deal' | 'approved', value: boolean) => Promise<unknown>
}

export function ProductStatusSwitch({
  id,
  field,
  checked: initialChecked,
  onToggle,
}: StatusSwitchProps) {
  const [checked, setChecked] = useState(initialChecked)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (val: boolean) => {
    setLoading(true)
    setChecked(val)
    try {
      await onToggle(id, field, val)
    } catch {
      setChecked(!val)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Switch
      checked={checked}
      disabled={loading}
      onCheckedChange={handleToggle}
      className='data-[state=checked]:bg-primary'
    />
  )
}
