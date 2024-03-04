import { Request, Response } from 'express'
import { getFigureConfigValidation, updateAddInStatusValidation } from '@app/routes/content-add-in/content-add-in.validation.js'
import * as console from 'console'
import { PresentationModel } from '@models/presentation.model.js'
import { blobDateFormat } from '@lib/utils/data.js'
import { v4 as uuidv4 } from 'uuid'
import { EmbededObjectModel } from '@models/embeded-objects.model.js'
import { ulid } from 'ulid'
import { ReqAuth } from '@app/lib/interfaces/reqAuth.js'
import { HttpError } from '@app/lib/utils/middlewares/http-error.js'

async function updateAddInStatus(req: Request, res: Response) {
  const payload = await updateAddInStatusValidation.validate(req.body)


  console.log("SELECTED ITEM", payload.contentAddInStatus.selectedItem)

  let presentation = await PresentationModel.query().where('unique_id', payload.uniqueID).first()

  if (!presentation) {
    const [device_id] = payload.uniqueID.split('|')
    const date_time_stamp = blobDateFormat(new Date())
    const uniqueId = payload?.uniqueID || ''

    presentation = await PresentationModel.query().insert({
      id: uuidv4(),
      date_time_stamp: date_time_stamp,
      device_id: device_id,
      unique_Id: uniqueId,
    })
  }


  let shape = await EmbededObjectModel.query().where({name: payload.shapeName, presentation_id: presentation.id}).first()

  if (!shape) {
    console.log("CREATING FIGURE", payload.shapeName)


    shape = await EmbededObjectModel.query().insert({
      id: ulid(),
      presentation_id: presentation.id,
      name: payload.shapeName,
      slide: 0,
      size: '{}',
      bounds: '{}'
    })
  }

  console.log("UPDATING FIGURE", payload)
  shape = await EmbededObjectModel.query().patchAndFetchById(shape.id, {
    content_config: JSON.stringify(payload.contentAddInStatus),
  })

  console.log("UPDATED FIGURE", shape)

  res.status(200).json({ status: 'Successfully updated!', shape })
}

async function getFigureConfig(req: Request & ReqAuth, res: Response) {
  const { item_name } = await getFigureConfigValidation.validate(req.params)

  const figure = await EmbededObjectModel.query().where('name', item_name).first()
  if (!figure) {
    throw new HttpError(404, 'Figure has not found')
  }

  res.status(200).json({ status: 'ok', payload: figure })
}

export const ContentAddInController = {
  updateAddInStatus,
  getFigureConfig
}
