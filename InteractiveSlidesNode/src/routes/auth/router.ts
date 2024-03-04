import { Router } from 'express'
import { AuthController } from '@app/routes/auth/auth.controller.js'
import { roleMiddleware } from '@app/lib/utils/middlewares/auth.middleware.js'
import { RoleEnum } from '@app/lib/constants/Roles.js'

export function authRouter(): Router {
  const router = Router({ mergeParams: true })
  router.post('/sign-up', roleMiddleware([RoleEnum.COMPANY_OWNER]), AuthController.signUp)
  router.post('/sign-up-trial', AuthController.signUpTrial)
  router.post('/sign-in', AuthController.signIn)
  router.post('/sign-out', AuthController.signOut)
  router.post('/regenerate-token', AuthController.regenerateAccessToken)
  return router
}
