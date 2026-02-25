import { type UserLoyaltyBalance } from './loyalty-schema'

export const MOCK_LOYALTY_SETTINGS: any = {
  minimumSpendPerStamp: 10,
  stampsRequiredForReward: 10,
  stampCardDurationDays: 60,
  includeProducts: [],
  includeCategories: [],
  isActive: false,
}

export const MOCK_USER_LOYALTY_BALANCES: UserLoyaltyBalance[] = [
  {
    userId: 'u1',
    userName: 'Alice Johnson',
    email: 'alice@example.com',
    currentPoints: 4,
    lifetimePoints: 120,
  },
  {
    userId: 'u2',
    userName: 'Bob Smith',
    email: 'bob@example.com',
    currentPoints: 2,
    lifetimePoints: 34,
  },
  {
    userId: 'u3',
    userName: 'Charlie Davis',
    email: 'charlie@example.com',
    currentPoints: 0,
    lifetimePoints: 5,
  },
  {
    userId: 'u4',
    userName: 'Diana Prince',
    email: 'diana@example.com',
    currentPoints: 8,
    lifetimePoints: 50,
  },
]
