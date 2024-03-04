import { Request, Response } from 'express'
import {
  finishPresentationValidation,
  renamePresentationValidation,
  savePresentationValidation,
  sendObjectValidation,
} from '@app/routes/taskpanel-add-in/taskpanel-add-in-validation.js'
import { PresentationRepository } from '@lib/repositories/presentation.repository.js'
import { Buffer } from 'buffer'
import { BlobStorageService } from '@lib/services/blobStorage.service.js'
import { BlobContainers } from '@lib/constants/blob-containers.js'
import { HttpError } from '@lib/utils/middlewares/http-error.js'
import { EmbededObjectModel } from '@models/embeded-objects.model.js'
import { PresentationModel } from '@models/presentation.model.js'
import { ulid } from 'ulid'
import { PresentationService } from '@lib/services/presentation.service.js'
import { blobDateFormat, mysqlDateFormat } from '@lib/utils/data.js'
import * as console from 'console'
import { UserModel } from '@models/user.model.js'


async function SavePresentation(req: Request, res: Response) {
  const payload = await savePresentationValidation.validate(req.body)

  const auth: { id: string, iat: string, exp: string } = (req as any).auth

  const presentation = await PresentationRepository.resolvePresentationById(payload.uniqueID, payload.dateTime, false, auth.id)

  const dataBuffer = Buffer.from(payload.base64BlobData, 'base64')


  const decodedData = decodeURIComponent(dataBuffer.toString())
  const bytes = decodedData.split(',').map((x) => Number(x))

  const rawData = Buffer.from(bytes)


  const presentationPath = `${presentation.device_id}/${presentation.id}/${blobDateFormat(presentation.date_time_stamp)}/chunks`
  const blobName = `${payload.idx.toString().padStart(4, '0')}.bin`


  try {
    await BlobStorageService.uploadBlobToStorage(
      presentationPath,
      blobName,
      BlobContainers.PRESENTATIONS,
      rawData,
    )
    return res.send('Blob successfully saved')
  } catch (e) {
    throw new HttpError(500, 'Can not upload to the blob storage')
  }
}

async function SendEmbeddedObjInfo(req: Request, res: Response) {

  console.log('SendEmbeddedObjInfo', req.body.embeddedObjInfo)

  const payload = await sendObjectValidation.validate(req.body)

  const presentation = await PresentationRepository.resolvePresentationById(payload.uniqueID, payload.dateTime, true)

  const names = []

  for (let i = 1; i <= payload.embeddedObjInfo.length; i++) {
    const embeddedObjects = payload.embeddedObjInfo[i - 1]


    for (const object of embeddedObjects) {

      names.push(object.name)

      let embeddedSlideObject = await EmbededObjectModel.query()
        .where('presentation_id', presentation.id)
        .where('name', object.name)
        .first()

      const updatedEObject = {
        presentation_id: presentation.id,
        name: object.name,
        size: JSON.stringify({ height: object.height, width: object.width }),
        bounds: JSON.stringify({ left: object.left, top: object.top }),
        content_config: JSON.stringify(object.config),
        slide: i,
      }

      if (!embeddedSlideObject) {
        embeddedSlideObject = await EmbededObjectModel.query().insert(
          {
            id: ulid().toString(),
            ...updatedEObject,
          },
        )
      } else {
        await EmbededObjectModel.query().patchAndFetchById(embeddedSlideObject.id, updatedEObject)
      }
    }
  }
  await EmbededObjectModel.query().where('presentation_id', presentation.id).whereNotIn('name', names).delete()
  return res.send('Embedded Objects Info successfully saved')
}

async function FinishPresentation(req: Request, res: Response) {

  const payload = await finishPresentationValidation.validate(req.body)

  const presentation = await PresentationRepository.resolvePresentationById(payload.uniqueID, '', true)

  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }

  const presentationDate = blobDateFormat(presentation.date_time_stamp)

  console.log('PRESENTATION', presentation)

  await PresentationService.convertToImages(presentation, `${presentation.device_id}/${presentation.id}/${presentationDate}/chunks`, `${presentation.device_id}/${presentation.id}/${presentationDate}`)

  res.json({ success: true, link: `/api/HTML/view-presentation-origin/${presentation.id}` })
}

async function RenamePresentation(req: Request, res: Response) {
  const payload = await renamePresentationValidation.validate(req.body)

  const auth: { id: string, iat: string, exp: string } = (req as any).auth

  let existedPresentation = await PresentationModel.query().where('unique_id', payload.uniqueID).first()

  const user = await UserModel.query().where('id', auth.id).first();

  const userPresentationsCount = await PresentationModel.query().where('user_id', auth.id).count('id as count').first() as unknown as { count: number };
  if(user.is_trial_user && userPresentationsCount?.count >= 20) {
    throw new HttpError(400, 'You have reached the limit of presentations for trial user')
  }

  if (existedPresentation && existedPresentation.user_id !== auth.id) {
    await PresentationModel.query().update({ name: payload.name, user_id: auth.id }).where('id', existedPresentation.id)
  } else {
    const presentation = await PresentationRepository.resolvePresentationById(payload.uniqueID, blobDateFormat(new Date()), false, auth.id)

    await PresentationModel.query().update({ name: payload.name }).where('id', presentation.id)
  }


  res.json({ success: true })
}

async function CleanPresentation(req: Request, res: Response) {
  const payload = await finishPresentationValidation.validate(req.body)

  const presentation = await PresentationRepository.resolvePresentationById(payload.uniqueID, '', true)

  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }

  const presentationDate = blobDateFormat(presentation.date_time_stamp)

  await BlobStorageService.cleanFilesByFolder(`${presentation.device_id}/${presentation.id}/${presentationDate}/chunks`, BlobContainers.PRESENTATIONS)

  res.json({ success: true })
}


export const TaskPanelAddInController = {
  RenamePresentation,
  FinishPresentation,
  SavePresentation,
  SendEmbeddedObjInfo,
  CleanPresentation,
}
