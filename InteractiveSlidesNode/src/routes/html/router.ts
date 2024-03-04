import express, { Router } from 'express'

import { HtmlController } from '@app/routes/html/html.controller.js'
import path from 'path'
import { createAuthMiddleware } from '@lib/utils/middlewares/auth.middleware.js'

export function createHtmlRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/view-presentation-origin/:id', HtmlController.viewPresentation)
  router.get('/view-presentation/:id', HtmlController.viewPresentationSession)
  router.get('/view-presentation-preview/:id', HtmlController.viewPreview)

  // router.get('/get-presentation-session-answers/:id', HtmlController.getPresentationSessionAnswers) //
  // router.get('/get-users-presentation-session/:user_id', HtmlController.getUsersPresentationsSessions) //
  // router.get('/get-users-presentations/:user_id', HtmlController.getUserPresentations)//

  router.get('/get-companies-presentations/:saas_company_id', createAuthMiddleware(), HtmlController.getCompaniesPresentations)
  router.get('/get-companies-presentation-session/:saas_company_id', createAuthMiddleware(), HtmlController.getCompanyPresentationsSessions)
  router.get('/get-default-styles', createAuthMiddleware(), HtmlController.getDefaultStyles)
  router.get('/finish-session/:session_id', HtmlController.finishSession)

  router.get('/get-presentation-settings/:id', createAuthMiddleware(), HtmlController.getPresentationSettings)

  router.post('/save-presentation-result', HtmlController.savePresentationResult)
  router.post('/finish-presentation', HtmlController.finishPresentationResult)
  router.post('/autosave-presentation-answer', HtmlController.autosavePresentation)

  router.post('/create-presentation-session', createAuthMiddleware(), HtmlController.createPresentationSession)
  router.post('/save-default-styles', createAuthMiddleware(), HtmlController.saveDefaultStyles)

  router.patch('/patch-presentation-title', createAuthMiddleware(), HtmlController.patchPresentationTitle)
  router.patch('/patch-presentation-transition', createAuthMiddleware(), HtmlController.patchPresentationTransition)

  router.delete('/delete-presentation-session/:id/:user_id', createAuthMiddleware(), HtmlController.deletePresentationSession)
  router.delete('/delete-presentation/:id', createAuthMiddleware(), HtmlController.deletePresentation)

  router.put('/edit-presentation-color', createAuthMiddleware(), HtmlController.editPresentationColor)

  router.post('/create-read-only-session', createAuthMiddleware(), HtmlController.createReadOnlySession)

  router.get('/presentation-session-share/:id', HtmlController.getReadonlyModeSession)


  router.use('/public/reveal-js', express.static('public/reveal-js'))
  return router
}
