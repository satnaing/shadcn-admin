import type { CreateUserFormValues, UpdateUserFormValues } from './schema'
import type { UserInterface } from './users.type'

export const USER_FORM_DEFAULTS: CreateUserFormValues & UpdateUserFormValues = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role_ids: [],
}

export interface UseUserFormOptions {
  mode: 'create' | 'edit'
  open: boolean
  currentRow?: UserInterface
  onSuccess: () => void
}
