import { NextFunction, Request, Response } from 'express'

import { getLogger } from '@lib/logger.js'
import { generateTraceID } from '@lib/utils/errors.js'
import { extractErrorDetails } from '@lib/utils/exceptions.js'

export const errorMiddleware = (
  err: Error,
  req: any,
  res: Response,
  next: NextFunction
): Response<unknown> => {
  const { handled, stack, additionalInfo, httpStatus, safeMessage, originalMessage } =
    extractErrorDetails(err)

  const request = {

  }

  const traceID = generateTraceID()
  getLogger().error(originalMessage, {
    stack: handled ? undefined : stack,
    traceID,
    http: {
      url: req.url,
      method: req.method,
    },
    info: {
      ...additionalInfo,
    },
    auth: {
      sub: req?.auth?.sub,
      azp: req?.auth?.azp,
    },
  })

  // Sentry.captureException(err, {
  //   user: {
  //     id: req.auth?.sub?.toString(),
  //   },
  //   extra: {
  //     traceID,
  //     azp: req.auth?.azp,
  //   },
  // })

  return res.status(httpStatus).send({
    errors: [{ safeMessage, traceID }],
  })
}
