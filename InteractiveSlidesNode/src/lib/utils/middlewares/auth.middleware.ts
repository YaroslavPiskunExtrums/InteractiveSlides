import { ReqAuth } from '@app/lib/interfaces/reqAuth.js'
import { HttpError } from '@lib/utils/middlewares/http-error.js'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authorizationHeaderCheck, tokenCheck } from '../checks.js'
import { RoleEnum as ROLE, RoleValues } from '@app/lib/constants/Roles.js'

type MiddlewareRes = (req: Request & ReqAuth, _: Response, next: NextFunction) => void

const verify = (req: Request & ReqAuth, next: NextFunction, callback?: () => void) => {
  const authHeader = authorizationHeaderCheck(req)
  const token = tokenCheck(authHeader)
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err || typeof decode === 'string') throw new HttpError(401, 'Invalid token')
    req.auth = decode
    if (callback) callback()
    next()
  })
}

const createAuthMiddleware = (): MiddlewareRes => (req, _, next) => verify(req, next)

const roleMiddleware = (roles: RoleValues[]): MiddlewareRes => {
  return (req, _, next) => {
    verify(req, next, () => {
      const payload = req.auth
      let isAllowed = false
      roles.forEach((role) => {
        if (role === ROLE.ADMIN && payload?.is_super_user) isAllowed = true
        else if (role === ROLE.TRIAL_USER && payload?.is_trial_user) isAllowed = true
        else if (role === ROLE.COMPANY_OWNER && payload?.companyOwner) isAllowed = true
        else if (role === ROLE.COMMON_USER && payload) isAllowed = true
      })

      if (!isAllowed) throw new HttpError(403, 'Permissions denied')

    })
  }
}

export { createAuthMiddleware, roleMiddleware }

