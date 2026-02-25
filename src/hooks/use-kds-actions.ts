import { useState } from 'react'
import { type Order, type OrderStatus } from '@/types/api'
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

  const handlePrintReceipt = async (order: Order) => {
    setIsPrintingReceiptId(order.id)
    try {
      await printReceiptViaBluetooth(order)
    } finally {
      setIsPrintingReceiptId(null)
    }
  }

  const handlePrintLabels = async (order: Order) => {
    setIsPrintingLabelId(order.id)
    try {
      for (const item of order.items) {
        await printLabelViaBluetooth({
          drinkName: item.name as unknown as string,
          note: item.notes ?? undefined,
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
