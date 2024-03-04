import { Router } from 'express'

import { DeviceIdController } from '@app/routes/device-id/device-id.controller.js'

export function deviceIdRouter(): Router {
  const router = Router({ mergeParams: true })
  router.post('/GenerateDeviceId', DeviceIdController.generateDeviceId)
  router.post('/GenerateTempPresentationUrl', DeviceIdController.generateTempPresentationUrl)
  router.get('/hello-world', (req, res)=> {res.send("Hello World!")})
  return router
}
