import { Router } from 'express'
import { ContentAddInController } from '@app/routes/content-add-in/content-add-in.controller.js'
import { createAuthMiddleware } from '@app/lib/utils/middlewares/auth.middleware.js'

export function contentAddIn(): Router {
  const router = Router({ mergeParams: true })

  router.post('/UpdateAddInStatus', ContentAddInController.updateAddInStatus)
  router.get('/get-figure-config/:item_name', createAuthMiddleware(), ContentAddInController.getFigureConfig)

  return router
}
