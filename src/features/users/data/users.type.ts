import type { NamedEntityInterface } from '@/shared/types'

export type CurrentUserApiResponse = {
  data: CurrentUserInterface
}

export interface CurrentUserInterface {
  id: number
  name: string
  email: string
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
