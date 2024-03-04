import { PresentationModel } from '@models/presentation.model.js'
import { v4 as uuidv4 } from 'uuid'


async function resolvePresentationById(
  uniqueId: string,
  dateTimeStamp: string,
  onlyCheckExist = false,
  user_id?: string,
): Promise<PresentationModel> {

  console.log("PresentationId", uniqueId, dateTimeStamp)

  let presentation = await PresentationModel.query()
    .where('unique_Id', uniqueId)
    .first()


  if (!presentation && !onlyCheckExist) {
    const [deviceId] = uniqueId.split('|')
    const inserted_data ={
      id: uuidv4(),
      unique_Id: uniqueId,
      device_id: deviceId,
      date_time_stamp: dateTimeStamp,
      user_id: user_id,
    }

    presentation = await PresentationModel.query().insert(inserted_data)
  }
  return presentation
}

export const PresentationRepository = {
  resolvePresentationById,
}
