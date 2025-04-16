import { z } from 'zod'

const bodySchema = z.object({
  wishlist: z.string(),
  id: z.string().optional(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  picture: z.array(z.string()).nullish(),
  price: z.number().nullish(),
  currency: z.string().nullish(),
  brand: z.string().nullish(),
  link: z.string().nullish(),
})

export default defineEventHandler(async (event) => {
  const { id, ...item } = await readValidatedBody(event, bodySchema.parse)

  if (Object.keys(item).length) {
    let result
    if (id) {
      result = await event.context.supabase.client
        .from('wishlist_item')
        .update(item)
        .eq('id', id)
    } else {
      result = await event.context.supabase.client
        .from('wishlist_item')
        .insert(item)
    }
    if (result.error) {
      return {
        ok: false,
      }
    }
  }

  return {
    ok: true,
  }
})
