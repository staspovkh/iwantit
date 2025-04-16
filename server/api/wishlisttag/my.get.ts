import { z } from 'zod'

const payloadSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
)

export default defineEventHandler(async (event) => {
  if (event.context.supabase?.user) {
    const { data, error } = await event.context.supabase.client
      .from('wishlist_tag')
      .select('id, name')
      .eq('user', event.context.supabase.user.id)

    if (!error && data) {
      const payload = payloadSchema.parse(data)
      return {
        ok: true,
        payload,
      }
    }
  }

  return {
    ok: false,
    payload: null,
  }
})
