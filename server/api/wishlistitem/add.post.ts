import { z } from 'zod'

const bodySchema = z.object({
  wishlist: z.string(),
  name: z.string(),
  description: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { wishlist, name, description } = await readValidatedBody(
    event,
    bodySchema.parse,
  )
  const { data, error } = await event.context.supabase.client
    .from('wishlist_item')
    .insert({ wishlist, name, description })

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
