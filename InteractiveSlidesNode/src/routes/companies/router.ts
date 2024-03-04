import { Router } from 'express'
import { CompaniesController } from '@app/routes/companies/companies.controller.js'
import { createAuthMiddleware } from '@app/lib/utils/middlewares/auth.middleware.js'

export function companiesRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/get-all-sales-info', createAuthMiddleware(), CompaniesController.getAllSales)

  return router
}
