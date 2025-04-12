import { z } from 'zod'

const bodySchema = z.object({
  id: z.any(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, bodySchema.parse)
  const { data, error } = await event.context.supabase.client
    .from('wishlist')
    .select('user, name, public, wishlist_item (id, name, description)')
    .eq('id', id)
    .single()

  if (
    !error &&
    (data?.public || data.user == event.context.supabase.user?.id)
  ) {
    return {
      ok: true,
      payload: data,
    }
  }

  return {
    ok: false,
    payload: {},
  }
})
