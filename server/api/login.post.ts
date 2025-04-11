import { z } from 'zod'
import type { User } from '~/types'

type TokenInfo = {
  sub: string
  email: string
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
}

const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env

const bodySchema = z.object({
  token: z.string(),
  save: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, bodySchema.parse)
  if (token) {
    const payload: TokenInfo = await $fetch(
      'https://oauth2.googleapis.com/tokeninfo',
      {
        method: 'POST',
        body: {
          id_token: token,
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
        },
      },
    )
    if (payload?.email) {
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      }
      await setUserSession(event, { user })
      return {
        ok: true,
        payload: user,
      }
    }
  }
  return {
    ok: false,
    error: 'Invalid token',
  }
})
