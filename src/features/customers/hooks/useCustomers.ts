import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customersService } from '../data/customers.service'
import {
  type ClassifiedProductItem,
  type CustomerFilterParams,
  type CustomerPackageItem,
} from '../data/customers.type'

export function useCustomers(params?: CustomerFilterParams) {
  return useQuery({
    queryKey: ['admin-customers', params],
    queryFn: () => customersService.getCustomers(params),
  })
}

export function useClassifiedProducts(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-classified-products', params],
    queryFn: () => customersService.getClassifiedProducts(params),
  })
}

export function useCustomerPackages() {
  return useQuery({
    queryKey: ['admin-customer-packages'],
    queryFn: () => customersService.getPackages(),
  })
}

export function useCustomerMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-classified-products'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-customer-packages'] })
  }

  const banMutation = useMutation({
    mutationFn: ({ id, is_banned }: { id: number; is_banned: boolean }) =>
      customersService.toggleBan(id, is_banned),
    onSuccess: invalidate,
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: number) => customersService.deleteCustomer(id),
    onSuccess: invalidate,
  })

  const classifiedStatusMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: number; is_published: boolean }) =>
      customersService.toggleClassifiedProductStatus(id, is_published),
    onSuccess: invalidate,
  })

  const createClassifiedMutation = useMutation({
    mutationFn: (data: Partial<ClassifiedProductItem>) => customersService.addClassifiedProduct(data),
    onSuccess: invalidate,
  })

  const deleteClassifiedMutation = useMutation({
    mutationFn: (id: number) => customersService.deleteClassifiedProduct(id),
    onSuccess: invalidate,
  })

  const packageMutation = useMutation({
    mutationFn: (payload: Partial<CustomerPackageItem>) => customersService.savePackage(payload),
    onSuccess: invalidate,
  })

  return {
    banMutation,
    deleteCustomerMutation,
    classifiedStatusMutation,
    createClassifiedMutation,
    deleteClassifiedMutation,
    packageMutation,
  }
}
