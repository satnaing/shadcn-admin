import { useState } from 'react'
import { type OrderItem, type OrderStatus } from '@/types/api'
import { type KdsOrder } from '@/types/kds'
import { printLabelViaBluetooth } from '@/utils/label-printer'
import { printReceiptViaBluetooth } from '@/utils/printer'
import { useUpdateOrderStatus } from '@/hooks/queries/use-orders'

export function useKdsActions() {
  const { mutateAsync: updateStatus } = useUpdateOrderStatus()
  const [isUpdatingStatusId, setIsUpdatingStatusId] = useState<string | null>(
    null
  )
  const [isPrintingReceiptId, setIsPrintingReceiptId] = useState<string | null>(
    null
  )
  const [isPrintingLabelId, setIsPrintingLabelId] = useState<string | null>(
    null
  )

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setIsUpdatingStatusId(id)
    try {
      await updateStatus({ id, status: newStatus })
    } finally {
      setIsUpdatingStatusId(null)
    }
  }

  const handlePrintReceipt = async (order: KdsOrder) => {
    setIsPrintingReceiptId(order.id)
    try {
      await printReceiptViaBluetooth({
        invoiceCode: order.invoiceCode,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          name: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.subtotal,
          options: item.options.map((opt) => ({
            name: opt.optionName,
            quantity: opt.quantity,
            unitPrice: opt.unitPrice,
          })),
          id: item.id,
          notes: item.instructions,
        })) as OrderItem[],
        fulfillmentCategory: order.fulfillmentCategory,
        queueNumber: order.queueNumber,
        subtotal: order.subtotal,
        total: order.grandTotal,
        paymentMethodName:
          typeof order.paymentMethodName === 'string'
            ? order.paymentMethodName
            : order.paymentMethodName?.en,
      })
    } finally {
      setIsPrintingReceiptId(null)
    }
  }

  const handlePrintLabels = async (order: KdsOrder) => {
    setIsPrintingLabelId(order.id)
    try {
      for (const item of order.items) {
        await printLabelViaBluetooth({
          drinkName: item.productName,
          note: item.instructions ?? undefined,
          orderCode: `YOK-${order.invoiceCode}`,
          quantity: item.quantity,
        })
      }
    } finally {
      setIsPrintingLabelId(null)
    }
  }

  return {
    handleStatusChange,
    handlePrintReceipt,
    handlePrintLabels,
    isUpdatingStatusId,
    isPrintingReceiptId,
    isPrintingLabelId,
  }
}
