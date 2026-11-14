import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import i18next from 'i18next'
import { instance } from '@/config/interceptor'

interface UseExcelOperationsOptions {
  exportUrl: string
  importUrl?: string
  fileName: string
}

export function useExcelOperations({ exportUrl, importUrl, fileName }: UseExcelOperationsOptions) {
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await instance.get(exportUrl, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onSuccess: () => toast.success(i18next.t('common:excel.exportSuccess')),
    onError: () => toast.error(i18next.t('common:excel.exportError')),
  })

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await instance.post(importUrl ?? '', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => toast.success(i18next.t('common:excel.importSuccess')),
    onError: () => toast.error(i18next.t('common:excel.importError')),
  })

  return { exportMutation, importMutation }
}
