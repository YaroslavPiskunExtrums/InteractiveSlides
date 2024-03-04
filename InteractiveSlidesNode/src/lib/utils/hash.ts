import crypto from 'crypto'

export function md5(input: string | Buffer): string {
  return crypto.createHash('md5').update(input).digest('hex')
}

export function toBase64(input: string): string {
  if (!input) return null

  return Buffer.from(input).toString('base64')
}

export function fromBase64(input: string): string {
  if (!input) return null
  return Buffer.from(input, 'base64').toString()
}
