import { z } from 'zod'

// Simplified types based on usage in the UI
export const cartItemOptionSchema = z.object({
  name: z.string(),
  value: z.string(), // Choice name
  price: z.number().optional(),
  badgeId: z.string().nullable().optional(),
})

export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  options: z.array(cartItemOptionSchema).optional(), // Parsed JSON options
  instructions: z.string().optional(),
  badgeIds: z.array(z.string()).optional(),
})

export const cartUserSchema = z.object({
  id: z.string(),
  fullName: z.string().optional(),
  phone: z.string(),
})

export const cartSchema = z.object({
  id: z.string(),
  user: cartUserSchema,
  items: z.array(cartItemSchema),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export type CartItemOption = z.infer<typeof cartItemOptionSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type CartUser = z.infer<typeof cartUserSchema>
export type Cart = z.infer<typeof cartSchema>
