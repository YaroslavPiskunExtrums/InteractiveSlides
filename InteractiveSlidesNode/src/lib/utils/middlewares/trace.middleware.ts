import { generateTraceID } from '@lib/utils/errors.js'

export function injectTraceID() {
  return (req, res, next) => {
    req.traceID = generateTraceID()
    next()
  }
}
