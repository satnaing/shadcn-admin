import { useEffect } from 'react'
import { type Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { asyncRequest } from '@/shared/helper'
import {
  type CreateUserFormValues,
  createUserSchema,
  type UpdateUserFormValues,
  updateUserSchema,
} from '../data/schema'
import { useUser } from './useUser'
import { useUserMutations } from './useUserMutations'

import { USER_FORM_DEFAULTS, type UseUserFormOptions } from '../data/user-form'

export function useUserForm({
  mode,
  open,
  currentRow,
  onSuccess,
}: UseUserFormOptions) {
  const isCreate = mode === 'create'
  const userId = !isCreate && currentRow ? String(currentRow.id) : ''

  const { data: userDetail } = useUser(userId)
  const { createUser, updateUser } = useUserMutations()

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(
      isCreate ? createUserSchema : updateUserSchema
    ) as Resolver<CreateUserFormValues | UpdateUserFormValues>,
    defaultValues: USER_FORM_DEFAULTS,
  })

  useEffect(() => {
    const detail = userDetail?.data
    if (!detail || isCreate) {
      return
    }

    form.reset({
      name: detail.name ?? '',
      email: detail.email ?? '',
      password: '',
      password_confirmation: '',
      role_ids: detail.roles?.map((role) => role.id) ?? [],
    })
  }, [userDetail, form, isCreate])

  useEffect(() => {
    if (isCreate && open) {
      form.reset(USER_FORM_DEFAULTS)
    }
  }, [isCreate, open, form])

  const onSubmit = async (
    values: CreateUserFormValues | UpdateUserFormValues
  ) => {
    await asyncRequest(async () => {
      if (isCreate) {
        await createUser.mutateAsync(values as CreateUserFormValues)
        onSuccess()
        return
      }

      const { password, password_confirmation, ...rest } =
        values as UpdateUserFormValues

      const updateValues: UpdateUserFormValues = { ...rest }

      // Only send password fields when the admin is actually changing them.
      if (password && password.trim() !== '') {
        updateValues.password = password
        updateValues.password_confirmation = password_confirmation ?? ''
      }

      await updateUser.mutateAsync({
        id: String(currentRow?.id),
        values: updateValues,
      })
      onSuccess()
    })
  }

  const isPending = isCreate ? createUser.isPending : updateUser.isPending

  return {
    form,
    isCreate,
    isPending,
    onSubmit,
  }
}
