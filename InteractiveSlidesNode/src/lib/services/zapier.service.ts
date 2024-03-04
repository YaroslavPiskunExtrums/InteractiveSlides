import { DataSessionsAnswersModel } from '@models/data-session-answers.model.js'
import { EmbededObjectModel } from '@models/embeded-objects.model.js'
import { figuresName } from '@lib/constants/figures.js'

async function mapAnswer(sessionName: string, sessionAnswers: DataSessionsAnswersModel[]) {
  const mappedAnswers = await Promise.all(sessionAnswers.map(async (answer) => {
    const presentationItem = await EmbededObjectModel.query().where('id', answer.presentation_item_id).first()

    presentationItem.content_config = JSON.parse(presentationItem.content_config)
    const answerValue = JSON.parse(answer.value).value
    // @ts-ignore
    const figureName = figuresName[presentationItem?.content_config?.selectedItem]
    // @ts-ignore
    const itemLabel = presentationItem?.content_config?.itemConfig[presentationItem?.content_config?.selectedItem].label

    return {
      figureType: figureName,
      label: itemLabel,
      value: answerValue ? answerValue.toString().trim() : answerValue,
    }
  }))
  const answersObject = {}

  let keyIndex = 1

  mappedAnswers.forEach((answer) => {
    let key = answer.label.trim() ? `${answer.label}` : `no-value`

    while (key in answersObject) {
      key = `${key}_${keyIndex}`
      keyIndex++
    }

    keyIndex = 1
    answersObject[key] = answer.value
  })

  return {
    session_name: sessionName,
    ...answersObject
  }
}


export const ZapierService = {
  mapAnswer,
}
