import { z } from 'zod'
import type { Tables } from '~/types/database.types'

const bodySchema = z.object({
  list: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
})

export default defineEventHandler(async (event) => {
  const { list } = await readValidatedBody(event, bodySchema.parse)

  const { data, error } = await event.context.supabase.client
    .from('wishlist_item')
    .upsert(list)
    .select()

  if (error) {
    return {
      ok: false,
      payload: null,
    }
  }

  return {
    ok: true,
    payload: data as Tables<'wishlist_item'>[],
  }
})
