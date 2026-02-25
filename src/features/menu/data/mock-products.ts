import { OptionType } from '@/types/api'
import { ProductStatus } from './schema'

export const MOCK_PRODUCTS: any[] = [
  {
    id: 'prod_latte',
    name: { en: 'Latte' },
    sku: 'LATTE-001',
    price: {
      name: { en: 'Size' },
      type: OptionType.VARIANT,
      sku: 'LATTE-VAR',
      minSelect: 1,
      maxSelect: 1,
      choices: [
        { id: 'opt_small', sku: 'LAT-S', name: { en: 'Small' }, price: 3.5 },
        { id: 'opt_large', sku: 'LAT-L', name: { en: 'Large' }, price: 4.5 },
      ],
    },
    priceGroupId: '',
    categoryId: '2', // Hot Coffee
    status: ProductStatus.ACTIVE,
    optionGroupIds: ['grp_milk_alt', 'grp_syrups'],
    recipes: [
      { ingredientId: 'ing_beans', quantity: 18 }, // Base
      { ingredientId: 'ing_milk', quantity: 200, optionId: 'opt_small' },
      { ingredientId: 'ing_milk', quantity: 300, optionId: 'opt_large' },
    ],
  },
  {
    id: 'prod_espresso',
    name: { en: 'Espresso' },
    sku: 'ESP-001',
    price: {
      name: { en: 'Standard' },
      type: OptionType.VARIANT,
      sku: 'ESP-VAR',
      minSelect: 1,
      maxSelect: 1,
      choices: [{ sku: 'ESP-STD', name: { en: 'Standard' }, price: 3.0 }],
    },
    priceGroupId: '',
    categoryId: '2', // Hot Coffee
    status: ProductStatus.ACTIVE,
    optionGroupIds: [],
    recipes: [{ ingredientId: 'ing_beans', quantity: 18 }],
  },
]
