import { z } from 'zod'

const bodySchema = z.object({
  id: z.any(),
})

const payloadSchema = z.object({
  name: z.string(),
  public: z.boolean(),
  user: z.string(),
  wishlist_item: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullish(),
      picture: z.array(z.string()).nullish(),
      price: z.number().nullish(),
      currency: z.string().nullish(),
      link: z.string().nullish(),
      brand: z.string().nullish(),
      order: z.number().nullish(),
    }),
  ),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, bodySchema.parse)
  const { data, error } = await event.context.supabase.client
    .from('wishlist')
    .select(
      'user, name, public, wishlist_item (id, name, description, picture, price, currency, link, brand, order)',
    )
    .eq('id', id)
    .order('order', { ascending: true, referencedTable: 'wishlist_item' })
    .order('created_at', { ascending: false, referencedTable: 'wishlist_item' })
    .single()

  if (
    !error &&
    (data?.public || data.user == event.context.supabase.user?.id)
  ) {
    const payload = payloadSchema.parse(data)
    return {
      ok: true,
      payload,
    }
  }
  return {
    ok: false,
    payload: null,
  }
})
