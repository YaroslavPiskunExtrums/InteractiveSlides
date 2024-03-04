import { Router } from 'express'
import { SuperUserController } from '@app/routes/super-user/super-user-controller.js'


export function superUserRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/users-list', SuperUserController.getUsersList)
  router.post('/register-company-owner', SuperUserController.registerCompanyOwner)
  router.delete('/delete-user/:id', SuperUserController.deleteUser)
  router.post('/visit-as-user', SuperUserController.visitAsUser)
  router.get('/resolve-one-time-hash', SuperUserController.resolveOneTimeHash)
  router.post('/login-hash-user', SuperUserController.loginHashUser)

  return router
}
