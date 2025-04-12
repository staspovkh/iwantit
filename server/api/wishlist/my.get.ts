import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  if (event.context.auth.user) {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
      .from('wishlist')
      .select('id, name')
      .eq('user', event.context.auth.user.id)

    if (!error) {
      return {
        ok: true,
        payload: data,
      }
    }
  }

  return {
    ok: true,
    payload: [],
  }
})
