import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PermissionGuard } from '@/components/guard'
import type { VerificationEntry } from '../data/affiliate.type'
import { useAffiliateUser } from '../hooks/use-affiliate'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'

const asList = (value: string | string[]) =>
  Array.isArray(value) ? value.join(', ') : value

function EntryValue({ entry }: { entry: VerificationEntry }) {
  const { t } = useTranslation('affiliate')

  return entry.type === 'file' ? (
    <a
      href={String(entry.value)}
      target='_blank'
      rel='noreferrer'
      className='text-primary hover:underline'
    >
      {t('verify.openFile')}
    </a>
  ) : (
    <span>{asList(entry.value)}</span>
  )
}

/** What the applicant submitted through the registration form, with accept / reject. */
export function AffiliateVerificationDialog({
  userId,
  onClose,
}: {
  userId: number | null
  onClose: () => void
}) {
  const { t } = useTranslation('affiliate')
  const { data } = useAffiliateUser(userId ?? undefined)
  const { setApproved, rejectUser } = useAffiliateMutations()
  const user = data?.data
  const rows: Array<[string, string]> = user
    ? [
        [t('columns.name'), user.name],
        [t('columns.email'), user.email],
        [t('columns.phone'), user.phone],
        [t('verify.address'), user.address],
      ]
    : []

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('verify.title')}</DialogTitle>
          <DialogDescription>{t('verify.description')}</DialogDescription>
        </DialogHeader>
        {user && (
          <div className='max-h-[60vh] space-y-5 overflow-y-auto text-sm'>
            <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1'>
              {rows.map(([label, value]) => (
                <div key={label} className='contents'>
                  <dt className='text-muted-foreground'>{label}</dt>
                  <dd className='font-medium'>{value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className='mb-2 font-semibold'>{t('verify.info')}</h3>
              {user.verification.length === 0 ? (
                <p className='text-muted-foreground'>{t('verify.empty')}</p>
              ) : (
                <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1'>
                  {user.verification.map((entry) => (
                    <div key={entry.label} className='contents'>
                      <dt className='text-muted-foreground'>{entry.label}</dt>
                      <dd>
                        <EntryValue entry={entry} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        )}
        <PermissionGuard permission={PERMISSIONS.AFFILIATE.USERS_MANAGE}>
          <DialogFooter>
            <Button
              variant='outline'
              disabled={!user || rejectUser.isPending}
              onClick={() =>
                user && rejectUser.mutate(user.id, { onSuccess: onClose })
              }
            >
              {t('actions.reject')}
            </Button>
            <Button
              disabled={!user || setApproved.isPending}
              onClick={() =>
                user &&
                setApproved.mutate(
                  { id: user.id, approved: true },
                  { onSuccess: onClose }
                )
              }
            >
              {t('actions.accept')}
            </Button>
          </DialogFooter>
        </PermissionGuard>
      </DialogContent>
    </Dialog>
  )
}
