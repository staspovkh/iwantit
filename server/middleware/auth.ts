import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = (await client.auth.getUser()).data.user
  event.context.auth = { user }
  if (event.method !== 'GET' && !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Unauthorized',
    })
  }
})
