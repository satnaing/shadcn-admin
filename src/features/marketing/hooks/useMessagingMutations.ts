import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { marketingService } from '../data/marketing.service'
import type { EmailTemplate, NotificationSettings, NotificationTypeItem } from '../data/marketing.type'

export function useMessagingMutations() {
  const qc = useQueryClient()

  const saveEmailTemplate = useMutation({
    mutationFn: (d: Partial<EmailTemplate>) => marketingService.saveEmailTemplate(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-email-templates'] }); toast.success('E-poçt şablonu yeniləndi') },
  })
  const sendNewsletter = useMutation({
    mutationFn: (d: { subject: string; content: string }) => marketingService.sendNewsletter(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-newsletters'] }); toast.success('Bülleten göndərildi') },
  })
  const saveNotificationType = useMutation({
    mutationFn: (d: Partial<NotificationTypeItem>) => marketingService.saveNotificationType(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-notification-types'] }); toast.success('Bildiriş kanalı yeniləndi') },
  })
  const sendNotification = useMutation({
    mutationFn: (d: { title: string; message: string; target: string }) => marketingService.sendNotification(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-notification-history'] }); toast.success('Bildiriş göndərildi') },
  })
  const saveNotificationSettings = useMutation({
    mutationFn: (d: Partial<NotificationSettings>) => marketingService.saveNotificationSettings(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-notification-settings'] }); toast.success('Bildiriş ayarları saxlanıldı') },
  })
  const deleteSubscriber = useMutation({
    mutationFn: (id: number) => marketingService.deleteSubscriber(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marketing-subscribers'] }); toast.success('Abunəçi silindi') },
  })
  const sendSms = useMutation({
    mutationFn: (d: { recipients: string[]; message: string }) => marketingService.sendSms(d),
    onSuccess: () => toast.success('SMS göndərildi'),
  })

  return { saveEmailTemplate, sendNewsletter, saveNotificationType, sendNotification, saveNotificationSettings, deleteSubscriber, sendSms }
}
