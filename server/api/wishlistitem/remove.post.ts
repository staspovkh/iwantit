import { z } from 'zod'

const bodySchema = z.object({
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, bodySchema.parse)

  const { error } = await event.context.supabase.client
    .from('wishlist_item')
    .delete()
    .eq('user', event.context.supabase.user.id)
    .eq('id', id)

  if (error) {
    return {
      ok: false,
    }
  }

  return {
    ok: true,
  }
})
