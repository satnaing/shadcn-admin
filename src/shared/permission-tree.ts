import { PERMISSIONS } from './permissions'

export interface PermissionGroup {
  /** lower-case group id, e.g. `delivery_boys` (i18n key) */
  id: string
  keys: { name: string; action: string }[]
}

/** The single permission tree flattened for pickers / matrices. */
export const PERMISSION_GROUPS: PermissionGroup[] = Object.entries(PERMISSIONS).map(
  ([id, group]) => ({
    id: id.toLowerCase(),
    keys: Object.values(group).map((name) => ({ name, action: name.split('.')[1] })),
  })
)

export const humanize = (value: string) =>
  value.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
