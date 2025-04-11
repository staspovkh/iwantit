import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data } = await client.from('wishlists').select('*')

  return {
    ok: true,
    payload: data,
  }
})
