import { nanoid } from 'nanoid'

export function generateTraceID(): string {
  return nanoid(20)
}
