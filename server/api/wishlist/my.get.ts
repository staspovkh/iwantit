export default defineEventHandler(async (event) => {
  if (event.context.supabase.user) {
    const { data, error } = await event.context.supabase.client
      .from('wishlist')
      .select('id, name')
      .eq('user', event.context.supabase.user.id)

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
