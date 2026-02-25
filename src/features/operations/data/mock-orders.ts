import { subMinutes } from 'date-fns'
import { type Order } from '@/types/api'

const now = new Date()

export const MOCK_ORDERS = [
  {
    id: 'ord_45',
    shopId: 'shop_01',
    invoiceCode: 'INV-0045',
    queueNumber: '#45',
    type: 'TAKEAWAY',
    status: 'PENDING',
    customerName: 'Guest',
    createdAt: subMinutes(now, 3).toISOString(), // 3 mins ago
    updatedAt: subMinutes(now, 3).toISOString(),

    // Financials
    subTotal: 12.5,
    discountTotal: 0,
    surchargeTotal: 0,
    grandTotal: 12.5,
    paymentMethodName: 'Cash',
    paymentStatus: 'PENDING',

    items: [
      {
        id: 'item_1',
        name: 'Cappuccino',
        quantity: 2,
        price: 4.5,
        variant: 'Large',
        options: [],
      },
      {
        id: 'item_2',
        name: 'Croissant',
        quantity: 1,
        price: 3.5,
        options: [],
      },
    ],
  },
  {
    id: 'ord_44',
    shopId: 'shop_01',
    invoiceCode: 'INV-0044',
    queueNumber: '#44',
    type: 'DINE_IN',
    status: 'PREPARING',
    customerName: 'Sarah',
    createdAt: subMinutes(now, 8).toISOString(), // 8 mins ago
    updatedAt: subMinutes(now, 5).toISOString(),

    subTotal: 5.0,
    discountTotal: 0,
    surchargeTotal: 0,
    grandTotal: 5.0,
    paymentMethodName: 'Visa **** 4242',
    paymentStatus: 'SUCCESS',

    items: [
      {
        id: 'item_3',
        name: 'Iced Americano',
        quantity: 1,
        price: 4.0,
        options: [
          { name: 'Shots', choice: 'Extra Shot' }, // +$1.00
        ],
      },
    ],
  },
  {
    id: 'ord_43',
    shopId: 'shop_01',
    invoiceCode: 'INV-0043',
    queueNumber: '#43',
    type: 'TAKEAWAY',
    status: 'READY',
    customerName: 'Mike',
    createdAt: subMinutes(now, 12).toISOString(), // 12 mins ago
    updatedAt: subMinutes(now, 2).toISOString(),

    subTotal: 5.5,
    discountTotal: 0,
    surchargeTotal: 0,
    grandTotal: 5.5,
    paymentMethodName: 'Mastercard **** 8888',
    paymentStatus: 'SUCCESS',

    items: [
      {
        id: 'item_4',
        name: 'Flat White',
        quantity: 1,
        price: 4.5,
        options: [
          { name: 'Milk', choice: 'Oat Milk' }, // +$0.50
          { name: 'Topping', choice: 'Sugar Free' }, // +$0.50
        ],
      },
    ],
  },
] as unknown as Order[]
