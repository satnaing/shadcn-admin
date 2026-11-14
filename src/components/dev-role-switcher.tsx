import { useNavigate } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getPanelConfig, type Role } from '@/config/panels'
import { useAuthStore } from '@/features/auth/data/auth.store'

const ROLES: Role[] = [
  'admin',
  'staff',
  'seller',
  'seller_staff',
  'courier',
  'supervisor',
]

export function DevRoleSwitcher() {
  const { t } = useTranslation('panel')
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setRole = useAuthStore((s) => s.setRole)

  if (!import.meta.env.DEV) {
    return null
  }

  const currentRole = (user?.role ?? 'admin') as Role

  const handleRoleSelect = (role: Role) => {
    setRole(role)
    const config = getPanelConfig(role)
    if (config?.landing) {
      navigate({ to: config.landing })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 gap-1.5 text-xs'>
          <ShieldAlert className='size-3.5 text-amber-500' />
          <span className='font-medium'>{t(`roles.${currentRole}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          {t('roleSwitcher.title')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((role) => (
          <DropdownMenuItem
            key={role}
            className={currentRole === role ? 'bg-accent font-semibold' : ''}
            onClick={() => handleRoleSelect(role)}
          >
            {t(`roles.${role}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
