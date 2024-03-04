import { Figures } from '../constants/figures.js'
import { DataSessionsAnswersModel } from '../db/models/data-session-answers.model.js'
import { PresentationLinksModel } from '../db/models/presentation-links-model.js'
import { PresentationModel } from '../db/models/presentation.model.js'
import { HubspotService } from '../services/hubspot.service.js'
import { v4 as uuidv4 } from 'uuid'

const dataSessionAnswers = async () => {
	try {
		console.log('[data_session_answers] START MIGRATION')

		const data_sessions = await PresentationLinksModel.query()

		console.log(`[data_session_answers] Found ${data_sessions.length} records in data sessions table`)

    for (const data_session of data_sessions) {
      const figures: {
        id?: string
        name?: string
        size?: { width?: number, height?: number }
        slide?: number
        bounds?: { top?: number, left?: number }
        figureName?: string
        content_config?: any
        presentation_id?: string
      }[] = Object.values(data_session.answers ? JSON.parse(data_session.answers) : {})

      const presentation = await PresentationModel.query().where({ id: data_session.presentation_id }).first()
      const fieldProperties: {
        deals: { [key: string]: { id: string } }[]
        company: { [key: string]: { id: string } }[]
        contact: { [key: string]: { id: string } }[]
      } = JSON.parse(presentation.integration_fields)

      for (const field in fieldProperties) {

        for await (const prop of (fieldProperties[field] as { [key: string]: { id: string } }[])) {
          const value = Object.keys(prop)[0]
          const itemId = prop[value].id.toString().split('_')
          const sessionId = data_session.id
          const isExist = await DataSessionsAnswersModel.query()
            .where('presentation_item_id', itemId[0])
            .andWhere('data_session_id', sessionId)

          if (isExist.length) {
            console.log(`[data_session_answers] Answer has existed in table. (presentationItemId-${itemId[0]}) Skipped`)
            continue
          }

          let savingValue = {
            value: null,
            fullName: null,
            business: null,
            phone: null,
            email: null,
            additionalFields: null,
            textMessage: null
          }

          const figure = figures.find(figure => figure.id === itemId[0])

          let figureValue
          if (figure) {
            figureValue = HubspotService.mapSessionAnswers(figure, itemId[1])
          }

          if (figureValue && figure?.figureName !== Figures.CUSTOMER_DETAILS) {
            savingValue = { ...savingValue, value: figureValue }
          } else if (figure?.figureName === Figures.CUSTOMER_DETAILS) {
            savingValue = {
              ...savingValue,
              fullName: figure.content_config.fullName ?? '',
              email: figure.content_config.email ?? '',
              additionalFields: figure.content_config.additionalFields ?? [],
              business: figure.content_config.business ?? '',
              phone: figure.content_config.phone ?? '',
              textMessage: figure.content_config.textMessage ?? '',
            }
          } else {
            console.log(`[data_session_answers] Circle for figure (presentationItemId=${itemId[0]}) has skipped. No value`)
            continue
          }

          await DataSessionsAnswersModel.query()
            .insert({
              id: uuidv4(),
              value: JSON.stringify(savingValue),
              presentation_item_id: itemId[0],
              data_session_id: sessionId
            })
          console.log(`[data_session_answers] Answer has wrote to table (presentationItemId-${itemId[0]})`)
        }
      }
    }
	} catch (e) {
		console.warn(`[data_session_answers] Migration error: ${e}`)
	}
}

export default dataSessionAnswers
