import { HttpError } from '@lib/utils/middlewares/http-error.js'

import { Buffer } from 'buffer'
import { Request } from 'express'

export function extractTokenFromRequest(req: Request): string {
  const authHeader = req.header('authorization')
  if (authHeader) {
    const parts = authHeader.split(' ')
    return parts.length === 2 ? parts[1] : null
  }
  return null
}

export function extractJwtPayload(token: string) {
  if (!token) {
    return null
  }

  const parts = token.split('.')

  if (parts.length === 3) {
    try {
      const decoded = Buffer.from(parts[1], 'base64').toString()
      return JSON.parse(decoded)
    } catch (err) {
      throw new HttpError(401, 'Invalid token format')
    }
  } else {
    throw new HttpError(401, 'Invalid token format')
  }

  return null
}
