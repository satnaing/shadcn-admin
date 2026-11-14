export interface Role {
  id: number
  name: string
  description: string
  /** System roles (e.g. admin) cannot be edited or deleted. */
  system: boolean
  users_count: number
  /** Permission names from the single tree (`shared/permissions.ts`). */
  permissions: string[]
  created_at: string
  updated_at: string
}
