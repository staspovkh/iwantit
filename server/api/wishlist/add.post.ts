import { z } from 'zod'

const bodySchema = z.object({
  name: z.string(),
})

export default defineEventHandler(async (event) => {
  const { name } = await readValidatedBody(event, bodySchema.parse)

  const { data, error } = await event.context.supabase.client
    .from('wishlist')
    .insert({ name })

  if (error) {
    return {
      ok: false,
      error,
    }
  }

  return {
    ok: true,
    payload: data,
  }
})
