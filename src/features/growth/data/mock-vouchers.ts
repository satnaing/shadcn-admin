import { type Voucher } from '@/types/growth'

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'v_1',
    uniqueCode: 'WEL-5550101',
    promotionName: 'Welcome Offer',
    userPhone: '+15550101',
    status: 'USED',
    isRedeemed: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'v_2',
    uniqueCode: 'WEL-5550102',
    promotionName: 'Welcome Offer',
    userPhone: '+15550102',
    status: 'ISSUED',
    isRedeemed: false,
    createdAt: '2025-01-12',
  },
  {
    id: 'v_3',
    uniqueCode: 'COF-5550101',
    promotionName: 'Morning Coffee',
    userPhone: '+15550101',
    status: 'USED',
    isRedeemed: true,
    createdAt: '2025-02-05',
  },
  {
    id: 'v_4',
    uniqueCode: 'COF-5550105',
    promotionName: 'Morning Coffee',
    userPhone: '+15550105',
    status: 'ISSUED',
    isRedeemed: false,
    createdAt: '2025-02-06',
  },
]
