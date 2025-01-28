import { z } from 'zod'

export const perPageItems = ['10', '20', '30', '40', '50'] as const
export const defaultPerPage = perPageItems[0]
export const perPageItemsSchema = z.enum(perPageItems)
