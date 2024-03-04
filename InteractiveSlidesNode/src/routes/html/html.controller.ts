import { HttpError } from '@lib/utils/middlewares/http-error.js'
import { Request, Response } from 'express'
import {
  autosavePresentationValidation,
  deletePresentationSessionValidation,
  finishSessionValidation,
  getCompaniesPresentationsValidation,
  getPresentationSessionAnswersValidation, getRedonlySessionValidation,
  getUsersPresentationsValidation,
  patchPresentationTitleValidation,
  patchPresentationTransitionValidation,
  presentationDeleteValidation,
  presentationEditColorValidation,
  presentationResultFinishValidation,
  presentationResultSaveValidation,
  presentationSessionCreateValidation, presentationSessionReadonlyValidation,
  presentationViewValidation,
  saveDefaultStylesValidation,
} from '@app/routes/html/html.validation.js'
import { alias } from '@lib/utils/database.js'
import { ContentModel } from '@models/contents.model.js'
import { EmbededObjectModel } from '@models/embeded-objects.model.js'
import { SlideModel } from '@models/slide.model.js'
import { PresentationModel } from '@models/presentation.model.js'
import * as console from 'console'
import fetch from 'node-fetch'
import * as process from 'process'
import { PresentationLinksModel } from '@models/presentation-links-model.js'
import { ulid } from 'ulid'
import { SalesRepository } from '@lib/repositories/sales.repository.js'
import { SalesModel } from '@models/sales.model.js'
import { CompanyModel } from '@models/company.model.js'
import { figuresName } from '@lib/constants/figures.js'
import { HubspotService } from '@lib/services/hubspot.service.js'
import { UserModel } from '@models/user.model.js'
import { editColorsScopes } from '@lib/constants/editColorsScopes.js'
import { ReqAuth } from '@app/lib/interfaces/reqAuth.js'
import { CompanyDefaultStylesModel } from '@app/lib/db/models/company-default-styles.model.js'
import { DataSessionsAnswersModel } from '@app/lib/db/models/data-session-answers.model.js'
import { v4 as uuidv4 } from 'uuid'
import { BlobStorageService } from '@app/lib/services/blobStorage.service.js'
import { BlobContainers } from '@app/lib/constants/blob-containers.js'
import { blobDateFormat } from '@app/lib/utils/data.js'
import { IntegrationEventsModel } from '@models/integration-event.model.js'
import { ZapierService } from '@lib/services/zapier.service.js'


const viewPresentation = async (req: Request, res: Response) => {
  const payload = await presentationViewValidation.validate(req.params)
  const presentation = await PresentationModel.query().where('id', payload.id).first()
  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }
  const slides = await SlideModel.query().where('presentation_id', presentation.id)
  let figures = (await EmbededObjectModel.query()
    .from(alias(EmbededObjectModel.tableName, 'e'))
    .where('presentation_id', presentation.id))

  for (const figure of figures) {
    if (!figure.content_config) {
      const oldConfig = await ContentModel.query().where('shapename', figure.name).first()
      if (!oldConfig || !oldConfig.content_config) {
        console.log('NULL OBJECT', figure.name)
        figure.content_config = null
      } else {
        figure.content_config = oldConfig.content_config
      }
    }

  }


  figures = figures.filter((f) => f.content_config)

  const response = await fetch(`${process.env.REACT_APP_LINK}/manifest.json`)
  const manifest = await response.json()


  Object.keys(manifest).forEach((key: string) => {
    manifest[key] = `${process.env.REACT_APP_LINK}${manifest[key]}`
  })

  res.render('presentationView', {
    readonly: false,
    images: slides,
    title: presentation.name,
    figures: JSON.stringify(figures),
    manifest,
    session: '',
    isSessionFinished: false,
    saved: true,
    save_color: presentation?.save_color,
    controls_colors: presentation?.controls_colors,
    presentation_color: presentation?.presentation_color,
    transition: presentation?.transition,
    isDisableBtn: true,
  })
}
const createPresentationSession = async (req: Request, res: Response) => {
  const payload = await presentationSessionCreateValidation.validate(req.body)
  const presentation = await PresentationModel.query().where('id', payload.id).first()
  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }

  const auth = req.headers.authorization
  const token = auth.split(' ')[1]
  const tokenData = JSON.parse(atob(token.split('.')[1]))

  const sales = await SalesRepository.createSales({
    name: payload.sales_name,
    company_name: payload.company_name,
    user_id: tokenData.id,
    hs_company_id: payload.hs_company_id,
  })


  const link = await PresentationLinksModel.query().insert({
    id: ulid().toString(),
    presentation_id: presentation.id,
    sales_id: sales.id,
    name: payload.name,
    answers: '{}',
    predefined_hs_company_id: payload.hs_company_id ? payload.hs_company_id : null,
    predefined_hs_deal_id: payload.hs_deals_id ? payload.hs_deals_id : null,
  })
  res.send(JSON.stringify({
    id: link.id,
    name: presentation.name,
    link: `${process.env.SELF_HOST}/api/HTML/view-presentation/${link.id}`,
    linkName: link.name,
    finished: link.finished,
    sales_id: sales.id,
    sales_name: sales.name,
    company_name: payload.company_name,
    answers: {},
  }))
}
const viewPresentationSession = async (req: Request, res: Response) => {
  const payload = await presentationViewValidation.validate(req.params)
  const presentationLink = await PresentationLinksModel.query().where('id', payload.id).first()
  if (!presentationLink) {
    throw new HttpError(404, 'Presentation not found')
  }
  const presentation = await PresentationModel.query().select(['name', 'presentation_color', 'controls_colors', 'save_color']).where('id', presentationLink.presentation_id).first()
  const slides = await SlideModel.query().where('presentation_id', presentationLink.presentation_id)
  let figures = (await EmbededObjectModel.query()
      .from(alias(EmbededObjectModel.tableName, 'e'))
      .where('presentation_id', presentationLink.presentation_id)
  )


  for (const figure of figures) {
    if (!figure.content_config) {
      const oldConfig = await ContentModel.query().where('shapename', figure.name).first()

      if (!oldConfig || !oldConfig.content_config) {
        console.log('NULL OBJECT', figure.name)
        figure.content_config = null
      } else {
        figure.content_config = oldConfig.content_config
      }
    }
  }

  figures = figures.filter((f) => f.content_config)


  if (presentationLink.answers) {
    const figuresData = JSON.parse(presentationLink.answers)

    figures = figures.map((figure) => {
      const figureData = figuresData[figure.name]
      const contentConfig = JSON.parse(figure.content_config)


      if (figureData) {
        contentConfig.itemConfig[contentConfig.selectedItem] = figureData.content_config
        figure.content_config = JSON.stringify(contentConfig)
      }

      return figure
    })
  }


  const response = await fetch(`${process.env.REACT_APP_LINK}/manifest.json`)
  const manifest = await response.json()


  Object.keys(manifest).forEach((key: string) => {
    manifest[key] = `${process.env.REACT_APP_LINK}${manifest[key]}`
  })


  res.render('presentationView', {
    readonly: false,
    images: slides,
    title: presentation.name,
    figures: JSON.stringify(figures),
    manifest,
    session: payload.id,
    isSessionFinished: presentationLink.finished,
    saved: presentationLink.finished,
    save_color: presentation?.save_color,
    controls_colors: presentation?.controls_colors,
    presentation_color: presentation?.presentation_color,
    transition: presentation?.transition,
    isDisableBtn: false,
  })
}
const savePresentationResult = async (req: Request, res: Response) => {
  const payload = await presentationResultSaveValidation.validate(req.body)
  const session = await PresentationLinksModel.query().where('id', payload.session).first()

  if (!session) {
    throw new HttpError(404, 'Session not found')
  }

  if (!session.finished) {
    await PresentationLinksModel.query().update({ answers: JSON.stringify(payload.figures) }).where('id', session.id)
  }

  res.status(200).json({ success: true })
}
const finishPresentationResult = async (req: Request, res: Response) => {
  const payload = await presentationResultFinishValidation.validate(req.body)
  const session = await PresentationLinksModel.query().where('id', payload.session).first()
  const presentation = await PresentationModel.query().where('id', session.presentation_id).first()


  if (!session) {
    throw new HttpError(404, 'Session not found')
  }

  try {
    await HubspotService.savePresentationIntegration(presentation.user_id, session.id)
  } catch (e) {
    // console.log(e)
    throw new HttpError(500, 'Hubspot error; ' + e.message)
  }

  res.status(200).json({ success: true })
}

const autosavePresentation = async (req: Request, res: Response) => {

  console.log('AUTOSAVE', req.body.figure.value)
  const payload = await autosavePresentationValidation.validate(req.body)
  const session = await PresentationLinksModel
    .query()
    .where('id', payload.sessionId)
    .first()

  if (!session) {
    throw new HttpError(404, 'Session not found')
  }

  if (session.finished) {
    throw new HttpError(400, 'Session have finished. User can`t change answer')
  }

  const presentation = await PresentationModel.query().where('id', session.presentation_id).first()

  //save in db
  let answer = await DataSessionsAnswersModel
    .query()
    .where('data_session_id', payload.sessionId)
    .andWhere('presentation_item_id', payload.figure.id).first()


  const { sessionId, figure: { id, ...figureValues } } = payload


  if (answer) {
    //update prev record

    console.log('EDiting', answer.id)

    await DataSessionsAnswersModel.query().patchAndFetchById(answer.id, {
      value: JSON.stringify(figureValues),
    })


  } else {
    console.log('CREATING')
    //create new record
    answer = await DataSessionsAnswersModel
      .query()
      .insert({
        data_session_id: sessionId,
        value: JSON.stringify(figureValues),
        presentation_item_id: id,
        id: uuidv4(),
      })
  }

  //save in hubspot

  try {
    await HubspotService.saveHubspotField(
      presentation.user_id,
      session,
      payload.figure.id,
      presentation,
      figureValues,
    )
  } catch (e) {
    throw new HttpError(500, 'Hubspot error; ' + e.message)

  }

  res.status(200).json({ success: true })
}

const getPresentationSessionAnswers = async (req: Request, res: Response) => {
  const payload = await getPresentationSessionAnswersValidation.validate(req.params)
  const presentationLink = await PresentationLinksModel.query().where('id', payload.id).first()
  if (!presentationLink) {
    throw new HttpError(404, 'Presentation not found')
  }

  res.send(presentationLink.answers)
}
const deletePresentationSession = async (req: Request, res: Response) => {
  const payload = await deletePresentationSessionValidation.validate(req.params)

  const presentationLink = await PresentationLinksModel.query().where('id', payload.id).first()
  const presentation = await PresentationModel.query().where('id', presentationLink.presentation_id).first()

  if (payload.user_id !== presentation.user_id) {
    throw new HttpError(403, 'Forbidden')
  }
  if (!presentationLink) {
    throw new HttpError(404, 'Presentation not found')
  }

  await PresentationLinksModel.query().deleteById(presentationLink.id)

  res.send(JSON.stringify({ status: 'ok' }))
}
const getUsersPresentationsSessions = async (req: Request, res: Response) => {
  const payload = await getUsersPresentationsValidation.validate(req.params)
  let presentationsRes = []
  const presentations = await PresentationModel.query().where('user_id', payload.user_id)

  for (const presentation of presentations) {
    const links = await PresentationLinksModel.query().where('presentation_id', presentation.id)
    for (const link of links) {

      const sales = await SalesModel.query().where('id', link.sales_id).first()
      const company = await CompanyModel.query().where('id', sales.company_id).first()

      const answers = JSON.parse(link.answers)

      let mappedAnswers = {}


      for (const figure of Object.keys(answers)) {
        mappedAnswers[figure] = {}
        mappedAnswers[figure].content_config = answers[figure]?.content_config || ''
        mappedAnswers[figure].figureName = answers[figure]?.figureName || ''
      }


      presentationsRes.push({
        id: link.id,
        name: presentation.name,
        link: `${process.env.SELF_HOST}/api/HTML/view-presentation/${link.id}`,
        linkName: link.name,
        sales_id: link.sales_id,
        sales_name: sales.name,
        company_name: company.name,
        finished: link.finished,
        answers: mappedAnswers,
      })
    }
  }
  res.send(JSON.stringify(presentationsRes))
}


const getCompanyPresentationsSessions = async (req: Request, res: Response) => {
  const payload = await getCompaniesPresentationsValidation.validate(req.params)

  const users = await UserModel.query().where('saas_company_id', payload.saas_company_id)

  const presentations = await PresentationModel.query().whereIn('user_id', users.map((u) => u.id))
  let presentationsRes = []

  for (const presentation of presentations) {
    const links = await PresentationLinksModel.query().where('presentation_id', presentation.id)
    for (const link of links) {

      const sales = await SalesModel.query().where('id', link.sales_id).first()
      const company = await CompanyModel.query().where('id', sales.company_id).first()

      const linkItems = await EmbededObjectModel.query().where('presentation_id', presentation.id)
      const mappedAnswers = []
      for (const linkItem of linkItems) {
        const linkAnswer = await DataSessionsAnswersModel.query().where('data_session_id', link.id).andWhere('presentation_item_id', linkItem.id).first()

        const linkItemConfig = JSON.parse(linkItem.content_config)
        const figureName = figuresName[linkItemConfig?.selectedItem]
        const label = linkItemConfig?.itemConfig[linkItemConfig?.selectedItem]?.label

        const linkAnswerValue = linkAnswer?.value ? JSON.parse(linkAnswer.value).value : null

        const mappedAnswer = {
          figureName,
          label: label ? label : 'No label',
          value: linkAnswerValue ? linkAnswerValue : 'No value',
        }
        mappedAnswers.push(mappedAnswer)
      }
      presentationsRes.push({
        id: link.id,
        name: presentation.name,
        link: `${process.env.SELF_HOST}/api/HTML/view-presentation/${link.id}`,
        linkName: link.name,
        sales_id: link.sales_id,
        sales_name: sales.name,
        company_name: company.name,
        finished: link.finished,
        answers: mappedAnswers,
      })
    }
  }
  return res.send(JSON.stringify(presentationsRes))
}

const getUserPresentations = async (req: Request, res: Response) => {
  const payload = await getUsersPresentationsValidation.validate(req.params)
  const presentations = await PresentationModel.query().where('user_id', payload.user_id)


  for (const presentation of presentations) {

    const mappedObj = []


    const objectsInfo = (await EmbededObjectModel.query()
        .from(alias(EmbededObjectModel.tableName, 'e'))
        .where('presentation_id', presentation.id)
    )


    for (const object of objectsInfo) {
      const contentConfig = JSON.parse(object.content_config)
      const figureName = figuresName[contentConfig.selectedItem]
      mappedObj.push({ ...object, content_config: contentConfig, figureName })
    }

    (presentation as any).objects = mappedObj
  }

  return res.send(JSON.stringify(presentations))
}

const getCompaniesPresentations = async (req: Request, res: Response) => {
  const payload = await getCompaniesPresentationsValidation.validate(req.params)

  const users = await UserModel.query().where('saas_company_id', payload.saas_company_id)

  const presentations = await PresentationModel.query().whereIn('user_id', users.map((u) => u.id)).withGraphFetched('tags')

  for (const presentation of presentations) {

    const mappedObj = []


    const objectsInfo = (await EmbededObjectModel.query().from(alias(EmbededObjectModel.tableName, 'e'))
        .where('presentation_id', presentation.id)
    )


    for (const object of objectsInfo) {
      if (!object.content_config) {
        const oldConfig = await ContentModel.query().where('shapename', object.name).first()
        if (!oldConfig || !oldConfig.content_config) {
          console.log('NULL OBJECT', object.name)
          object.content_config = null
        } else {
          object.content_config = oldConfig.content_config
        }
      }


      if (object.content_config) {
        const contentConfig = JSON.parse(object.content_config)
        const figureName = figuresName[contentConfig.selectedItem]
        mappedObj.push({ ...object, content_config: contentConfig, figureName })
      } else {

        console.log('NULL OBJECT', object.name)
      }

    }

    (presentation as any).objects = mappedObj
  }

  return res.send(JSON.stringify(presentations))
}

const deletePresentation = async (req: Request, res: Response) => {
  const payload = await presentationDeleteValidation.validate(req.params)
  const presentation = await PresentationModel.query().where('id', payload.id).first()
  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }
  await PresentationModel.query().deleteById(presentation.id)
  const prefix = `${presentation.device_id}/${presentation.id}/${blobDateFormat(presentation.date_time_stamp)}`

  await BlobStorageService.cleanFilesByFolder(prefix, BlobContainers.IMAGES)
  await BlobStorageService.cleanFilesByFolder(prefix, BlobContainers.PRESENTATIONS)

  res.send(JSON.stringify({ status: 'ok' }))
}
const editPresentationColor = async (req: Request, res: Response) => {
  const payload = await presentationEditColorValidation.validate(req.body)
  const presentation = await PresentationModel.query().where('id', payload.id).first()
  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }

  if (payload.scope === editColorsScopes.BACKGROUND) {
    await PresentationModel.query().patchAndFetchById(presentation.id, { presentation_color: payload.color })
  }
  if (payload.scope === editColorsScopes.SAVE_BUTTON) {
    await PresentationModel.query().patchAndFetchById(presentation.id, { save_color: payload.color })
  }
  if (payload.scope === editColorsScopes.CONTROLS) {
    await PresentationModel.query().patchAndFetchById(presentation.id, { controls_colors: payload.color })
  }
  res.send(JSON.stringify({ status: 'ok' }))
}
const getPresentationSettings = async (req: Request, res: Response) => {
  const payload = await presentationViewValidation.validate(req.params)
  const presentation = await PresentationModel.query().where('id', payload.id).first()
  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }

  const slides = await SlideModel.query().where('presentation_id', presentation.id)

  for (const slide of slides) {
    const figures = (await EmbededObjectModel.query()
        .from(alias(EmbededObjectModel.tableName, 'e'))
        .where('presentation_id', presentation.id).andWhere('slide', slide.slide)
    )

    for (const figure of figures) {
      if (!figure.content_config) {
        const oldConfig = await ContentModel.query().where('shapename', figure.name).first()
        figure.content_config = oldConfig.content_config
      }
    }

    slide['figures'] = figures
  }

  slides.sort((a, b) => a.slide - b.slide)

  presentation['slides'] = slides

  res.send(JSON.stringify({ presentation }))
}

const getDefaultStyles = async (req: Request & ReqAuth, res: Response) => {

  const defaultStyles = await CompanyDefaultStylesModel.query()
    .where('company_id', req.auth.saas_company_id)
    .select([
      'button_default_styles',
      'calculator_default_styles',
      'customer_details_default_styles',
      'multiple_choice_default_styles',
      'open_field_default_styles',
      'range_selector_default_styles',
    ])

  if (!defaultStyles.length) throw new HttpError(404, 'Styles were not found')

  res.status(200).send(JSON.stringify(defaultStyles[0]))
}

const saveDefaultStyles = async (req: Request & ReqAuth, res: Response) => {
  const payload = await saveDefaultStylesValidation.validate(req.body)

  if (!req.auth.companyOwner) throw new HttpError(403, 'Permission denied')

  const columnName = payload.target.replace(/-/g, '_') + '_default_styles'

  const isExistStylesForCompany = await CompanyDefaultStylesModel
    .query()
    .where('company_id', payload.saas_company_id)

  if (!isExistStylesForCompany.length) {
    //create record in DB
    const savedStyles = await CompanyDefaultStylesModel
      .query()
      .insert({ [columnName]: payload.styles, company_id: payload.saas_company_id })

    if (!savedStyles) {
      throw new HttpError(400, 'Saving error')
    }

    return res.send(JSON.stringify({ status: 'ok' }))
  }
  //update record in DB
  const savedStyles = await CompanyDefaultStylesModel.query()
    .where('company_id', payload.saas_company_id)
    .patch({ [columnName]: payload.styles })

  if (!savedStyles) {
    throw new HttpError(400, 'Saving error')
  }

  res.send(JSON.stringify({ status: 'ok' }))
}

const finishSession = async (req: Request & ReqAuth, res: Response) => {
  const payload = await finishSessionValidation.validate(req.params)

  const isUpdated = await PresentationLinksModel.query().patchAndFetchById(payload.session_id, { finished: true })

  if (!isUpdated.finished) {
    throw new HttpError(400, 'Session error')
  }

  const integrationEvents = await IntegrationEventsModel.query().where({ presentation_id: isUpdated.presentation_id }).orWhere({ presentation_id: process.env.ALL_PRESENTATION_ID })
  const sessionAnswers = await DataSessionsAnswersModel.query().where('data_session_id', payload.session_id)
  let answersObject = await ZapierService.mapAnswer(isUpdated.name, sessionAnswers)
  for (const integrationEvent of integrationEvents) {
    try {
      const zapierResponse = await fetch(integrationEvent.url, {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answersObject),
      })

      const zapierResponseJson = await zapierResponse.json()

      console.log('zapierResponseJson', zapierResponseJson)

    } catch (e) {
      throw new HttpError(500, 'Hubspot error; ' + e.message)
    }
  }


  res.send(JSON.stringify({ status: 'ok' }))
}

const patchPresentationTitle = async (req: Request, res: Response) => {
  const payload = await patchPresentationTitleValidation.validate(req.body)

  const isPresentationExist = await PresentationModel.query().findById(payload.presentation_id)

  if (!isPresentationExist) {
    throw new HttpError(404, 'Presentation hasn`t found')
  }

  const updatedPresentation = await PresentationModel
    .query()
    .findById(payload.presentation_id)
    .patch({ name: payload.new_title })

  if (!updatedPresentation) {
    throw new HttpError(400, 'Patch error')
  }

  res.send(JSON.stringify({ status: 'ok' }))
}

const patchPresentationTransition = async (req: Request, res: Response) => {
  const payload = await patchPresentationTransitionValidation.validate(req.body)

  const isPresentationExist = await PresentationModel.query().findById(payload.presentation_id)

  if (!isPresentationExist) {
    throw new HttpError(404, 'Presentation hasn`t found')
  }

  const updatedPresentation = await PresentationModel
    .query()
    .findById(payload.presentation_id)
    .patch({ transition: payload.transition })

  if (!updatedPresentation) {
    throw new HttpError(400, 'Patch error')
  }

  res.send(JSON.stringify({ status: 'ok' }))
}

const viewPreview = async (req: Request, res: Response) => {
  const payload = await presentationViewValidation.validate(req.params)
  const presentation = await PresentationModel.query().where('id', payload.id).first()
  if (!presentation) {
    throw new HttpError(404, 'Presentation not found')
  }
  const slides = await SlideModel.query().where('presentation_id', presentation.id)

  const response = await fetch(`${process.env.REACT_APP_LINK}/manifest.json`)
  const manifest = await response.json()


  Object.keys(manifest).forEach((key: string) => {
    manifest[key] = `${process.env.REACT_APP_LINK}${manifest[key]}`
  })

  res.render('presentationView', {
    readonly: false,
    images: slides,
    title: presentation.name,
    figures: JSON.stringify([]),
    manifest,
    session: '',
    isSessionFinished: false,
    saved: false,
    save_color: presentation?.save_color,
    controls_colors: presentation?.controls_colors,
    presentation_color: presentation?.presentation_color,
    transition: presentation?.transition,
    isDisableBtn: true,
  })
}

const createReadOnlySession = async (req: Request, res: Response) => {
  const payload = await presentationSessionReadonlyValidation.validate(req.body)
  let presentationSession = await PresentationLinksModel.query().where('id', payload.session_id).first()

  if (!presentationSession) {
    throw new HttpError(404, 'Presentation session not found')
  }

  if (presentationSession.read_only_id) {
    return res.send(JSON.stringify({ read_only_id: presentationSession.read_only_id }))
  }

  const newReadOnlyId = ulid()
  await PresentationLinksModel.query().patchAndFetchById(presentationSession.id, { read_only_id: newReadOnlyId })

  res.send(JSON.stringify({ read_only_id: newReadOnlyId }))
}

const getReadonlyModeSession = async (req: Request, res: Response) => {
  const payload = await getRedonlySessionValidation.validate(req.params)
  const presentationLink = await PresentationLinksModel.query().where('read_only_id', payload.id).first()
  if (!presentationLink) {
    throw new HttpError(404, 'Presentation not found')
  }
  const presentation = await PresentationModel.query().select(['name', 'presentation_color', 'controls_colors', 'save_color']).where('id', presentationLink.presentation_id).first()
  const slides = await SlideModel.query().where('presentation_id', presentationLink.presentation_id)
  let figures = (await EmbededObjectModel.query()
      .from(alias(EmbededObjectModel.tableName, 'e'))
      .where('presentation_id', presentationLink.presentation_id)
  )


  for (const figure of figures) {
    if (!figure.content_config) {
      const oldConfig = await ContentModel.query().where('shapename', figure.name).first()

      if (!oldConfig || !oldConfig.content_config) {
        console.log('NULL OBJECT', figure.name)
        figure.content_config = null
      } else {
        figure.content_config = oldConfig.content_config
      }
    }
  }

  figures = figures.filter((f) => f.content_config)


  if (presentationLink.answers) {
    const figuresData = JSON.parse(presentationLink.answers)

    figures = figures.map((figure) => {
      const figureData = figuresData[figure.name]
      const contentConfig = JSON.parse(figure.content_config)


      if (figureData) {
        contentConfig.itemConfig[contentConfig.selectedItem] = figureData.content_config
        figure.content_config = JSON.stringify(contentConfig)
      }

      return figure
    })
  }


  const response = await fetch(`${process.env.REACT_APP_LINK}/manifest.json`)
  const manifest = await response.json()


  Object.keys(manifest).forEach((key: string) => {
    manifest[key] = `${process.env.REACT_APP_LINK}${manifest[key]}`
  })


  res.render('presentationView', {
    readonly: true,
    images: slides,
    title: presentation.name,
    figures: JSON.stringify(figures),
    manifest,
    session: payload.id,
    isSessionFinished: presentationLink.finished,
    saved: presentationLink.finished,
    save_color: presentation?.save_color,
    controls_colors: presentation?.controls_colors,
    presentation_color: presentation?.presentation_color,
    transition: presentation?.transition,
    isDisableBtn: false,
  })
}


export const HtmlController = {
  viewPresentation,
  createPresentationSession,
  viewPresentationSession,
  savePresentationResult,
  finishPresentationResult,
  getPresentationSessionAnswers,
  getUsersPresentationsSessions,
  deletePresentationSession,
  getUserPresentations,
  deletePresentation,
  editPresentationColor,
  getCompaniesPresentations,
  getPresentationSettings,
  getCompanyPresentationsSessions,
  getDefaultStyles,
  saveDefaultStyles,
  patchPresentationTitle,
  finishSession,
  patchPresentationTransition,
  viewPreview,
  autosavePresentation,
  createReadOnlySession,
  getReadonlyModeSession
}
