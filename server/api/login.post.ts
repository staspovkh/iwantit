/* eslint-disable complexity */
import { z } from 'zod'
import type { User } from '~/types'
import { Buffer } from 'node:buffer'
import crypto from 'crypto'
import formatEcdsa from 'ecdsa-sig-formatter'

const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env

const bodySchema = z.object({
  token: z.string(),
  save: z.boolean().optional(),
})

const decodeBase64StringUtf8 = (base64: string) => {
  return Buffer.from(base64, 'base64').toString('utf-8')
}

const verifySignedJwtWithCertsAsync = async (
  jwt: string,
  certs: Record<string, string>,
  requiredAudience: string | string[] | null,
  issuers?: string[],
  maxExpiry?: number,
) => {
  if (!maxExpiry) {
    maxExpiry = 86400
  }
  const segments = jwt.split('.')
  if (segments.length !== 3) {
    throw new Error('Wrong number of segments in token: ' + jwt)
  }
  const signed = segments[0] + '.' + segments[1]
  let signature = segments[2]
  let envelope
  let payload
  try {
    envelope = JSON.parse(decodeBase64StringUtf8(segments[0]))
  } catch (err) {
    if (err instanceof Error) {
      err.message = `Can't parse token envelope: ${segments[0]}': ${err.message}`
    }
    throw err
  }
  if (!envelope) {
    throw new Error(`Can't parse token envelope: ` + segments[0])
  }
  try {
    payload = JSON.parse(decodeBase64StringUtf8(segments[1]))
  } catch (err) {
    if (err instanceof Error) {
      err.message = `Can't parse token payload '${segments[0]}`
    }
    throw err
  }
  if (!payload) {
    throw new Error(`Can't parse token payload: ` + segments[1])
  }
  // if (!Object.hasOwn(certs, envelope.kid)) {
  //   // If this is not present, then there's no reason to attempt verification
  //   throw new Error('No pem found for envelope: ' + JSON.stringify(envelope))
  // }
  // const cert = certs[envelope.kid]
  // if (envelope.alg === 'ES256') {
  //   signature = formatEcdsa.joseToDer(signature, 'ES256').toString('base64')
  // }
  // const verified = await crypto.verify(cert, signed, signature)
  // if (!verified) {
  //   throw new Error('Invalid token signature: ' + jwt)
  // }
  if (!payload.iat) {
    throw new Error('No issue time in token: ' + JSON.stringify(payload))
  }
  if (!payload.exp) {
    throw new Error('No expiration time in token: ' + JSON.stringify(payload))
  }
  const iat = Number(payload.iat)
  if (isNaN(iat)) throw new Error('iat field using invalid format')
  const exp = Number(payload.exp)
  if (isNaN(exp)) throw new Error('exp field using invalid format')
  const now = new Date().getTime() / 1000
  if (exp >= now + maxExpiry) {
    throw new Error(
      'Expiration time too far in future: ' + JSON.stringify(payload),
    )
  }
  const earliest = iat - 300
  const latest = exp + 300
  if (now < earliest) {
    throw new Error(
      'Token used too early, ' +
        now +
        ' < ' +
        earliest +
        ': ' +
        JSON.stringify(payload),
    )
  }
  if (now > latest) {
    throw new Error(
      'Token used too late, ' +
        now +
        ' > ' +
        latest +
        ': ' +
        JSON.stringify(payload),
    )
  }
  if (issuers && issuers.indexOf(payload.iss) < 0) {
    throw new Error(
      'Invalid issuer, expected one of [' +
        issuers +
        '], but got ' +
        payload.iss,
    )
  }
  // Check the audience matches if we have one
  if (typeof requiredAudience !== 'undefined' && requiredAudience !== null) {
    const aud = payload.aud
    let audVerified = false
    // If the requiredAudience is an array, check if it contains token
    // audience
    if (requiredAudience.constructor === Array) {
      audVerified = requiredAudience.indexOf(aud) > -1
    } else {
      audVerified = aud === requiredAudience
    }
    if (!audVerified) {
      throw new Error('Wrong recipient, payload audience != requiredAudience')
    }
  }
  return {
    envelope,
    payload,
  }
}

export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, bodySchema.parse)

  if (token) {
    const payload = await verifySignedJwtWithCertsAsync(
      token,
      {},
      GOOGLE_OAUTH_CLIENT_ID,
    )
    return {
      ok: true,
      payload,
    }
    // const client = new OAuth2Client({
    //   clientId: GOOGLE_OAUTH_CLIENT_ID,
    //   clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    // })
    // const ticket = await client.verifyIdToken({
    //   idToken: token,
    //   audience: GOOGLE_OAUTH_CLIENT_ID,
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
    //   await setUserSession(event, { user })
    //   return {
    //     ok: true,
    //     payload: user,
    //   }
    // }
  }
  return {
    ok: false,
    error: 'Invalid token',
  }
})
