import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'
import type { User } from '~/types'

const clientId =
  '64929895773-qrit0c1f2rljcof7jjogb7ik6vg7gdjh.apps.googleusercontent.com'
const clientSecret = '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'

const bodySchema = z.object({
  token: z.string(),
  save: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const { token, save } = await readValidatedBody(event, bodySchema.parse)

  try {
    const client = new OAuth2Client({ clientId, clientSecret })
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    })
    const payload = ticket.getPayload()

    if (payload?.email) {
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      }
      if (save) {
        await setUserSession(event, { user })
      }
      return {
        ok: true,
        payload: user,
      }
    }

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
