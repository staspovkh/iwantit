import { z } from 'zod'

const bodySchema = z.object({
  id: z.any(),
})

const itemSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  picture: z.array(z.string()).nullable(),
  price: z.number().nullable(),
  currency: z.string().nullable(),
  link: z.string().nullable(),
  brand: z.string().nullable(),
  order: z.number().nullable(),
  reserve: z.number().nullable(),
  tag: z.string().nullable(),
})

const payloadSchema = z.object({
  name: z.string(),
  public: z.boolean(),
  user: z.string(),
  wishlist_item: z.array(itemSchema),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, bodySchema.parse)
  const keys = Object.keys(itemSchema.shape).join(', ')
  const { data, error } = await event.context.supabase.client
    .from('wishlist')
    .select(`user, name, public, wishlist_item (${keys})`)
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
