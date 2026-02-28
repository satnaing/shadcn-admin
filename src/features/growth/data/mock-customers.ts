import { type Customer } from '@/types/growth'

const DEFAULT_MOCK_FIELDS = {
  email: null,
  gender: null,
  profileImageUrl: null,
  dob: null,
  referralCode: 'MOCK_CODE',
  referredByUserId: null,
  membershipTierId: null,
  updatedAt: '2025-01-01',
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    fullName: 'Alice Johnson',
    phone: '+15550101',
    status: 'ACTIVE',
    createdAt: '2024-11-15',
    ...DEFAULT_MOCK_FIELDS,
  },
  {
    id: 'cust_2',
    fullName: 'Bob Smith',
    phone: '+15550102',
    status: 'ACTIVE',
    createdAt: '2024-12-01',
    ...DEFAULT_MOCK_FIELDS,
  },
  {
    id: 'cust_3',
    fullName: 'Charlie Davis',
    phone: '+15550103',
    status: 'PENDING',
    createdAt: '2024-12-20',
    ...DEFAULT_MOCK_FIELDS,
  },
  {
    id: 'cust_4',
    fullName: 'Diana Evans',
    phone: '+15550104',
    status: 'BANNED',
    createdAt: '2024-10-05',
    ...DEFAULT_MOCK_FIELDS,
  },
  {
    id: 'cust_5',
    fullName: 'Ethan Harris',
    phone: '+15550105',
    status: 'ACTIVE',
    createdAt: '2025-01-02',
    ...DEFAULT_MOCK_FIELDS,
  },
]
