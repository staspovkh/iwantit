import { z } from 'zod'

const bodySchema = z.object({
  wishlist: z.string(),
  name: z.string(),
  id: z.string().optional(),
  description: z.string().optional(),
  picture: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
  brand: z.string().optional(),
  link: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { id, ...itemData } = await readValidatedBody(event, bodySchema.parse)
  const item = {
    ...itemData,
    picture: [itemData.picture],
    price: itemData.price ? Number(itemData.price) : undefined,
  }
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
      error: result.error,
    }
  }

  return {
    ok: true,
    payload: result.data,
  }
})
