import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Role } from '@/features/role/data/role.type'
import { humanize, PERMISSION_GROUPS } from '@/shared/permission-tree'

/** Read-only view: which role holds which permission of the single tree. */
export function PermissionMatrix({ roles }: { roles: Role[] }) {
  const { t } = useTranslation('roles')
  const [search, setSearch] = useState('')
  const sets = useMemo(() => roles.map((r) => new Set(r.permissions)), [roles])

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase()
    return PERMISSION_GROUPS.map((g) => ({
      ...g,
      keys: q ? g.keys.filter((k) => k.name.includes(q)) : g.keys,
    })).filter((g) => g.keys.length > 0)
  }, [search])

  return (
    <div className='space-y-3'>
      <div className='relative max-w-sm'>
        <Search className='absolute top-2.5 left-2.5 size-4 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('picker.search')}
          className='pl-8'
        />
      </div>

      {groups.length === 0 ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>{t('picker.empty')}</p>
      ) : (
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('matrix.permission')}</TableHead>
                {roles.map((r) => (
                  <TableHead key={r.id} className='text-center'>
                    {r.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <GroupRows key={group.id} group={group} sets={sets} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function GroupRows({
  group,
  sets,
}: {
  group: (typeof PERMISSION_GROUPS)[number]
  sets: Set<string>[]
}) {
  const { t } = useTranslation('roles')

  return (
    <>
      <TableRow className='bg-muted/40'>
        <TableCell colSpan={sets.length + 1} className='font-medium'>
          {t(`groups.${group.id}`, { defaultValue: humanize(group.id) })}
        </TableCell>
      </TableRow>
      {group.keys.map(({ name, action }) => (
        <TableRow key={name}>
          <TableCell className='pl-6' title={name}>
            {t(`actions.${action}`, { defaultValue: humanize(action) })}
          </TableCell>
          {sets.map((set, i) => (
            <TableCell key={i} className='text-center'>
              {set.has(name) && <Check className='mx-auto size-4 text-emerald-600' aria-label={t('matrix.granted')} />}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
