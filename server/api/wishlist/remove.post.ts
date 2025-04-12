import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'

const bodySchema = z.object({
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBody(event, bodySchema.parse)
  const client = await serverSupabaseClient(event)

  const { error } = await client
    .from('wishlist')
    .delete()
    .eq('user', event.context.auth.user.id)
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
