import { preorderApi } from '@/api/modules/preorder.api'
import type { ProductFormValues } from '../data/preorder.schema'
import type { PreorderSettings, ProductFlag } from '../data/preorder.type'
import { usePreorderAction } from './use-preorder-action'
import { usePreorderOrderMutations } from './use-preorder-order-mutations'

type Id = number | string

export function usePreorderMutations() {
  return {
    ...usePreorderOrderMutations(),
    createProduct: usePreorderAction(
      (v: ProductFormValues) => preorderApi.createProduct(v),
      'toast.created'
    ),
    updateProduct: usePreorderAction(
      ({ id, values }: { id: Id; values: ProductFormValues }) =>
        preorderApi.updateProduct(id, values),
      'toast.updated'
    ),
    removeProduct: usePreorderAction(
      (id: Id) => preorderApi.removeProduct(id),
      'toast.deleted'
    ),
    bulkRemoveProducts: usePreorderAction(
      (ids: number[]) => preorderApi.bulkRemoveProducts(ids),
      'toast.deleted'
    ),
    setProductFlag: usePreorderAction(
      ({ id, flag, value }: { id: Id; flag: ProductFlag; value: boolean }) =>
        preorderApi.setProductFlag(id, flag, value),
      'toast.updated'
    ),

    replyConversation: usePreorderAction(
      ({ id, message }: { id: Id; message: string }) =>
        preorderApi.replyConversation(id, message),
      'toast.sent'
    ),
    removeConversation: usePreorderAction(
      (id: Id) => preorderApi.removeConversation(id),
      'toast.deleted'
    ),
    replyQuery: usePreorderAction(
      ({ id, reply }: { id: Id; reply: string }) =>
        preorderApi.replyQuery(id, reply),
      'toast.sent'
    ),
    setReviewPublished: usePreorderAction(
      ({ id, value }: { id: Id; value: boolean }) =>
        preorderApi.setReviewPublished(id, value),
      'toast.updated'
    ),

    createFaq: usePreorderAction(
      (values: unknown) => preorderApi.createFaq(values),
      'toast.created'
    ),
    updateFaq: usePreorderAction(
      ({ id, values }: { id: Id; values: unknown }) =>
        preorderApi.updateFaq(id, values),
      'toast.updated'
    ),
    removeFaq: usePreorderAction(
      (id: Id) => preorderApi.removeFaq(id),
      'toast.deleted'
    ),
    setFaqActive: usePreorderAction(
      ({ id, value }: { id: Id; value: boolean }) =>
        preorderApi.setFaqActive(id, value),
      'toast.updated'
    ),

    updateNotificationType: usePreorderAction(
      ({ id, values }: { id: Id; values: unknown }) =>
        preorderApi.updateNotificationType(id, values),
      'toast.updated'
    ),
    setNotificationActive: usePreorderAction(
      ({ id, value }: { id: Id; value: boolean }) =>
        preorderApi.setNotificationActive(id, value),
      'toast.updated'
    ),
    saveSettings: usePreorderAction(
      (v: PreorderSettings) => preorderApi.updateSettings(v),
      'toast.updated'
    ),
  }
}
