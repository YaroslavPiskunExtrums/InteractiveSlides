import { Router } from 'express'
import { TaskPanelAddInController } from '@app/routes/taskpanel-add-in/taskpanel-add-in-controller.js'

export function taskpanelAddInController(): Router {
  const router = Router({ mergeParams: true })

  router.post('/SaveBlob', TaskPanelAddInController.SavePresentation)
  router.post('/SendEmbeddedObjInfo', TaskPanelAddInController.SendEmbeddedObjInfo)
  router.post('/finish-presentation', TaskPanelAddInController.FinishPresentation)
  router.post('/rename-presentation', TaskPanelAddInController.RenamePresentation)
  router.post('/clean-presentation', TaskPanelAddInController.CleanPresentation)



  return router
}
