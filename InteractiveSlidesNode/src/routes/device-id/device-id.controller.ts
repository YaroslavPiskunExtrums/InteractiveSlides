import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

async function generateDeviceId (req: Request, res: Response) {
  res.status(200).json({ deviceId: uuidv4() })
}

async function generateTempPresentationUrl (req: Request, res: Response) {
  res.status(200).json({ tempUrl: uuidv4() })
}

export const DeviceIdController = {
  generateDeviceId,
  generateTempPresentationUrl,
}
