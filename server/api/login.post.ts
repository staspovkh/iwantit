import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'
import type { User } from '~/types'

const { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET } = process.env

const bodySchema = z.object({
  token: z.string(),
  save: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, bodySchema.parse)

  try {
    if (token) {
      const client = new OAuth2Client({
        clientId: GOOGLE_AUTH_CLIENT_ID,
        clientSecret: GOOGLE_AUTH_CLIENT_SECRET,
        redirectUri: 'postmessage',
      })

      return {
        ok: true,
        payload: {
          token,
        },
      }
    }
    // const client = new OAuth2Client()
    // const ticket = await client.verifyIdToken({
    //   idToken: token,
    //   audience: clientId,
    // })
    // const payload = ticket.getPayload()

    // if (payload?.email) {
    //   const user: User = {
    //     id: payload.sub,
    //     email: payload.email,
    //     name: payload.name,
    //     picture: payload.picture,
    //     given_name: payload.given_name,
    //     family_name: payload.family_name,
    //   }

    //   return {
    //     ok: true,
    //     payload: user,
    //   }
    // }

    return {
      ok: false,
      error: 'Invalid token',
    }
  } catch (error) {
    return {
      ok: false,
      error,
    }
  }
})
