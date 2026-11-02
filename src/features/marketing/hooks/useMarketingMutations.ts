import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { marketingService } from '../data/marketing.service'
import type { BlogCategory, BlogPost, CustomAlert, DynamicPopup, SaleAlert, VisitorSimulatorSettings } from '../data/marketing.type'

export function useMarketingMutations() {
  const qc = useQueryClient()

  const savePopup = useMutation({
    mutationFn: (d: Partial<DynamicPopup>) => marketingService.savePopup(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-popups'] }); toast.success('Pop-up saxlanıldı') },
  })
  const deletePopup = useMutation({
    mutationFn: (id: number) => marketingService.deletePopup(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-popups'] }); toast.success('Pop-up silindi') },
  })
  const saveAlert = useMutation({
    mutationFn: (d: Partial<CustomAlert>) => marketingService.saveAlert(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-alerts'] }); toast.success('Bildiriş banneri saxlanıldı') },
  })
  const deleteAlert = useMutation({
    mutationFn: (id: number) => marketingService.deleteAlert(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-alerts'] }); toast.success('Bildiriş banneri silindi') },
  })
  const saveSaleAlert = useMutation({
    mutationFn: (d: Partial<SaleAlert>) => marketingService.saveSaleAlert(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-sale-alerts'] }); toast.success('Satış xəbərdarlığı saxlanıldı') },
  })
  const saveBlog = useMutation({
    mutationFn: (d: Partial<BlogPost>) => marketingService.saveBlog(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-blogs'] }); toast.success('Bloq yazısı saxlanıldı') },
  })
  const deleteBlog = useMutation({
    mutationFn: (id: number) => marketingService.deleteBlog(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-blogs'] }); toast.success('Bloq silindi') },
  })
  const saveBlogCategory = useMutation({
    mutationFn: (d: Partial<BlogCategory>) => marketingService.saveBlogCategory(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-blog-categories'] }); toast.success('Bloq kateqoriyası saxlanıldı') },
  })
  const saveVisitorSettings = useMutation({
    mutationFn: (d: Partial<VisitorSimulatorSettings>) => marketingService.saveVisitorSettings(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-visitors'] }); toast.success('Ziyarətçi parametrləri saxlanıldı') },
  })

  return { savePopup, deletePopup, saveAlert, deleteAlert, saveSaleAlert, saveBlog, deleteBlog, saveBlogCategory, saveVisitorSettings }
}
