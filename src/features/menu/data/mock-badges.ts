import { type Badge } from './badge-schema'

export const MOCK_BADGES: Badge[] = [
  {
    id: '1',
    label: { en: 'Best Seller' },
    code: 'BEST_SELLER',
    bgColor: '#FF5733',
    textColor: '#FFFFFF',
    isActive: true,
  },
  {
    id: '2',
    label: { en: 'New' },
    code: 'NEW_ITEM',
    bgColor: '#33FF57',
    textColor: '#000000',
    isActive: true,
  },
  {
    id: '3',
    label: { en: 'Spicy' },
    code: 'SPICY',
    bgColor: '#FF0000',
    textColor: '#FFFFFF',
    isActive: true,
  },
  {
    id: '4',
    label: { en: 'Vegan' },
    code: 'VEGAN',
    bgColor: '#33C4FF',
    textColor: '#000000',
    isActive: false,
  },
]
