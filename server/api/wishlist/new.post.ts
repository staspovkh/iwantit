import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'

const bodySchema = z.object({
  name: z.string(),
})

export default defineEventHandler(async (event) => {
  const { name } = await readValidatedBody(event, bodySchema.parse)
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('wishlist').insert({ name })

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
