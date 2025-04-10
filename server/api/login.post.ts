import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'

const bodySchema = z.object({
  token: z.string()
})

export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, bodySchema.parse)

  try {
    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({ idToken: token })
    const payload = ticket.getPayload()

    await setUserSession(event, { user: payload})

    return { ok: true, payload }
  } catch (error) {
    return { ok: false, error }
  }

})
