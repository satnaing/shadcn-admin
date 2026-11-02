import type { Panel } from '@/config/panels'
import type { NamedEntityInterface } from '@/shared/types'

export type CurrentUserApiResponse = {
  data: CurrentUserInterface
}

export interface CurrentUserInterface {
  id: number
  name: string
  email: string
  avatar?: string | null
  role?: string
  seller_id?: number | null
  panel?: Panel | null
  roles: NamedEntityInterface[]
  permissions: string[]
  status: boolean
  created_at: string
  updated_at: string
}

export interface UserInterface {
  id: number
  name: string
  email: string
  roles: NamedEntityInterface[]
  permissions: string[]
  status: number
  status_label: string
  created_at: string
  updated_at: string
}
