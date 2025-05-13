import { z } from 'zod'
import type { Database } from '~/types/database.types'

const wishlistSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  order: z.number().nullish(),
  public: z.boolean().optional(),
  user: z.string().nullish(),
})
export type Wishlist = z.infer<typeof wishlistSchema>

const itemSchema = z.object({
  id: z.string(),
  wishlist: z.string().nullish(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  picture: z.array(z.string()).nullish(),
  price: z.number().nullish(),
  currency: z.string().nullish(),
  link: z.string().nullish(),
  brand: z.string().nullish(),
  level: z.number().nullish(),
  order: z.number().nullish(),
  reserve: z.string().nullish(),
  reserve_message: z.string().nullish(),
  completed: z.boolean().nullish(),
  tag: z.array(z.string()).nullish(),
})
export type WishlistItem = z.infer<typeof itemSchema>

const tagSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  order: z.number().nullish(),
})
export type WishlistTag = z.infer<typeof tagSchema>

export const entityTypeSchema = z.enum(['wishlist', 'item', 'tag'])
export type EntityType = z.infer<typeof entityTypeSchema>

export const entityTables: Record<
  EntityType,
  keyof Database['public']['Tables']
> = {
  wishlist: 'wishlist',
  item: 'wishlist_item',
  tag: 'wishlist_tag',
} as const

export const entityPayloadSchema = z.object({
  wishlist: z.array(wishlistSchema),
  item: z.array(itemSchema),
  tag: z.array(tagSchema),
})
