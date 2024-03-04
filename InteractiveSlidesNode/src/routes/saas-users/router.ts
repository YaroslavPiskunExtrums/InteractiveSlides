import { Router } from 'express'
import { SaasUserController } from '@app/routes/saas-users/saas-users.controller.js'
import { createAuthMiddleware, roleMiddleware } from '@app/lib/utils/middlewares/auth.middleware.js'
import { RoleEnum } from '@app/lib/constants/Roles.js'

export function createSaasUsersRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/get-company-users/:saas_company_id', roleMiddleware([RoleEnum.COMPANY_OWNER]), SaasUserController.getUsersBySaasCompany)
  router.delete('/delete-user/:user_id', roleMiddleware([RoleEnum.COMPANY_OWNER]), SaasUserController.deleteUser)
  return router
}
