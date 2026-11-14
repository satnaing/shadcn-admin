import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { TogglePlan } from '../data/module-deps'

export type PendingAction =
  | { kind: 'toggle'; id: string; enable: boolean; plan: TogglePlan }
  | { kind: 'delete'; id: string; dependants: string[] }

interface Props {
  pending: PendingAction | null
  names: (ids: string[]) => string[]
  onClose: () => void
  onToggle: (id: string, enable: boolean, plan: TogglePlan) => void
  onDelete: (id: string) => void
}

/** One dialog for the three cases: blocked toggle, dependency auto-switch, delete. */
export function ModuleConfirms({ pending, names, onClose, onToggle, onDelete }: Props) {
  const { t } = useTranslation('modules')
  const close = (open: boolean) => !open && onClose()

  if (!pending) return null

  if (pending.kind === 'delete') {
    const list = pending.dependants.join(', ')
    return (
      <ConfirmDialog
        open
        onOpenChange={close}
        title={t('confirm.deleteTitle', { name: names([pending.id])[0] })}
        desc={t(list ? 'confirm.deleteDependants' : 'confirm.deleteDesc', { list })}
        confirmText={t('card.delete')}
        destructive
        handleConfirm={() => {
          onDelete(pending.id)
          onClose()
        }}
      />
    )
  }

  const { plan, id, enable } = pending
  if (!plan.ok) {
    return (
      <ConfirmDialog
        open
        onOpenChange={close}
        title={t('confirm.blockedTitle')}
        desc={t(enable ? 'confirm.blockedEnable' : 'confirm.blockedDisable', { list: names(plan.blockedBy).join(', ') })}
        confirmText={t('confirm.ok')}
        handleConfirm={onClose}
      />
    )
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={close}
      title={t(enable ? 'confirm.enableTitle' : 'confirm.disableTitle', { name: names([id])[0] })}
      desc={t(enable ? 'confirm.enableDesc' : 'confirm.disableDesc', { list: names(plan.also).join(', ') })}
      confirmText={t('confirm.continue')}
      destructive={!enable}
      handleConfirm={() => {
        onToggle(id, enable, plan)
        onClose()
      }}
    />
  )
}
