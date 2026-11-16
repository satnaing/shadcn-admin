import { preorderApi } from '@/api/modules/preorder.api'
import type { OrderStep, StepPayload } from '../data/preorder.type'
import { usePreorderAction } from './use-preorder-action'

type Id = number | string

/** Workflow and housekeeping actions of the preorders list / detail. */
export function usePreorderOrderMutations() {
  return {
    setStep: usePreorderAction(
      ({
        id,
        step,
        payload,
      }: {
        id: Id
        step: OrderStep
        payload: StepPayload
      }) => preorderApi.setStep(id, step, payload),
      'toast.updated'
    ),
    // The API returns a (signed) file URL; navigating to an attachment downloads it without leaving the page.
    invoice: usePreorderAction(
      (id: Id) => preorderApi.invoice(id),
      null,
      (res) => window.location.assign(res.data.download_url)
    ),
    removeOrder: usePreorderAction(
      (id: Id) => preorderApi.removeOrder(id),
      'toast.deleted'
    ),
    bulkRemoveOrders: usePreorderAction(
      (ids: number[]) => preorderApi.bulkRemoveOrders(ids),
      'toast.deleted'
    ),
    sendReminders: usePreorderAction(
      ({ ids, type }: { ids: number[]; type: 'prepayment' | 'final' }) =>
        preorderApi.sendReminders(ids, type),
      'toast.reminded'
    ),
  }
}
