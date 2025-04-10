import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'

const clientId =
  '64929895773-qrit0c1f2rljcof7jjogb7ik6vg7gdjh.apps.googleusercontent.com'
const clientSecret = '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'

const bodySchema = z.object({
  token: z.string(),
})

export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, bodySchema.parse)

  try {
    const client = new OAuth2Client({ clientId, clientSecret })
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    })
    const payload = ticket.getPayload()

    await setUserSession(event, { user: payload })

    return { ok: true, payload }
  } catch (error) {
    return { ok: false, error }
  }
})
