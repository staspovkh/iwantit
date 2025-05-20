import { serverSupabaseClient } from '#supabase/server'

const allowedRequests = [
  '/api/wishlist',
  '/api/wishlist/public',
  '/api/reservation/add',
  '/api/reservation/remove',
]

export default defineEventHandler(async (event) => {
  if (
    event.path.startsWith('/api/wishlist') ||
    event.path.startsWith('/api/reservation')
  ) {
    const client = await serverSupabaseClient(event)
    const {
      data: { user },
    } = await client.auth.getUser()
    event.context.supabase = { client, user }
    if (!allowedRequests.includes(event.path) && !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Unauthorized',
      })
    }
  }
})
