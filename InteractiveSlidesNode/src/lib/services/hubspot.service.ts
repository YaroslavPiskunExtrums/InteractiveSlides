import * as hubspot from '@hubspot/api-client'
import { IntegrationsModel } from '@models/integrations.model.js'
import fetch from 'node-fetch'
import { IPresentationLink, PresentationLinksModel } from '@models/presentation-links-model.js'
import { PresentationModel } from '@models/presentation.model.js'
import { ContentModel } from '@models/contents.model.js'
import { Figures, figuresName } from '@lib/constants/figures.js'
import { CompanyModel } from '@models/company.model.js'
import { ulid } from 'ulid'
import { EmbededObjectModel } from '@models/embeded-objects.model.js'
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts/index.js'
import { HttpError } from '../utils/middlewares/http-error.js'
import { DataSessionsAnswersModel } from '../db/models/data-session-answers.model.js'
import { SlidesNotesModel } from '../db/models/slides-notes.model.js'
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/companies/index.js'
import * as console from 'console'
import { UserModel } from '@models/user.model.js'
import { SaasCompanyModel } from '@models/saas-company.model.js'
interface IFields {
  [key: string]: string | any
}

async function getMapIntegrationValues(integrationFields: any[], presentationSession: IPresentationLink) {
  const integrationFieldsMap: any = {}
  const sessionAnswers = JSON.parse(presentationSession.answers)

  for (const field of integrationFields) {
    const [property, propertyValue] = Object.entries(field)[0] as [string, { id: string, text: string }]

    const propertyValueId = propertyValue.id.toString().split('_')[0]
    // console.log('propertyValueId', propertyValueId)

    const valueFigure = await EmbededObjectModel.query().where({ id: propertyValueId }).first()

    // console.log('valueFigure', valueFigure)

    if (valueFigure && valueFigure?.name) {
      // console.log('valueFigure.shapename', valueFigure.name)
      // console.log('valueFigure', valueFigure)


      const propertyAnswer = sessionAnswers[valueFigure.name]
      integrationFieldsMap[property] = mapSessionAnswers(propertyAnswer, propertyValue.id.toString().split('_')[1])
    } else {
      // console.log('VALUE IS NULL', integrationFieldsMap, property)
      integrationFieldsMap[property] = null
    }


  }

  console.log('integrationFieldsMap', integrationFieldsMap)

  return integrationFieldsMap
}

function mapSessionAnswers(answer: any, type = null) {
  if (!answer) return null
  let answerValue: string | number = ''
  const answerFigure = answer.figureName
  const contentConfig = answer.content_config

  // console.log(answerFigure, answer.content_config.value)

  if (answerFigure === Figures.OPEN_FIELD || answerFigure === Figures.CALCULATOR) {
    answerValue = contentConfig.value ? contentConfig.value : ''
  }
  if (answerFigure === Figures.MULTIPLE_CHOICE) {
    const answer = contentConfig.answers[contentConfig.selected]

    if (typeof answer === 'object') {
      answerValue = answer.value
    } else {
      answerValue = answer
    }
  }
  if (answerFigure === Figures.RANGE_SELECTOR) {
    if (+contentConfig.type === 0) {
      answerValue = contentConfig.rangeConfig[0]?.value
      if (!answer) {
        answerValue = '0'
      }
    }
    if (+contentConfig.type === 1) {
      const answer = contentConfig.rangeConfig[1].options[contentConfig.rangeConfig[1]?.selected]
      if (typeof answer === 'object') {
        answerValue = answer.value
      } else {
        answerValue = answer
      }
    }
  }

  if (answerFigure === Figures.CUSTOMER_DETAILS) {
    if (type === 'full-name') {
      answerValue = contentConfig.fullName ? contentConfig.fullName : ''
    }
    if (type === 'email') {
      answerValue = contentConfig.email ? contentConfig.email : ''
    }
    if (type === 'phone') {
      answerValue = contentConfig.phone ? contentConfig.phone : ''
    }
  }


  if (answerFigure === Figures.DATE_FIELD) {
    answerValue = contentConfig.value ? +contentConfig.value : ''
  }

  return answerValue
}

async function getUsersTokens(userId: string) {
  let integrationData = await IntegrationsModel.query().where({ user_id: userId }).first()


  if (!integrationData && !integrationData) {
    return null
  }


  const tokenDate = new Date(integrationData.created_at)
  tokenDate.setUTCSeconds(tokenDate.getUTCSeconds() + +integrationData.expires_in)

  const grant_type = encodeURIComponent('refresh_token')
  const client_id = encodeURIComponent(process.env.HUBSPOT_CLIENT_ID)
  const client_secret = encodeURIComponent(process.env.HUBSPOT_CLIENT_SECRET)
  const token = encodeURIComponent(integrationData.refresh_token)


  const formData = `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${token}`

  console.log("TOKEN DATE", tokenDate, new Date(), new Date() > tokenDate)

  if (new Date() > tokenDate) {

    console.log("USER NEEDS TO REF", userId, encodeURIComponent(integrationData.refresh_token), formData)

    const token = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: formData,
    })

    const updatedToken = await token.json() as { access_token: string, refresh_token: string, expiresIn: string }

    console.log('UPDATED TOKEN', updatedToken)

    integrationData = await IntegrationsModel.query().patchAndFetchById(integrationData.id, {
      access_token: updatedToken.access_token,
      refresh_token: updatedToken.refresh_token,
      expires_in: updatedToken.expiresIn,
      created_at: new Date(),
    })

  }

  return { access_token: integrationData.access_token, refresh_token: integrationData.refresh_token }
}

async function getHubspotClient(userId: string): Promise<hubspot.Client> {
  const { access_token } = await getUsersTokens(userId)
  const hubspotClient = new hubspot.Client({ accessToken: access_token })
  return hubspotClient
}


async function createOrUpdateDeals(hubspotClient: hubspot.Client, predefined_hs_deal_id: string, dealsFields: IFields): Promise<void> {
  if (predefined_hs_deal_id) {

    await hubspotClient.crm.deals.basicApi.update(
      predefined_hs_deal_id,
      { properties: dealsFields, }
    )

  } else if (dealsFields && dealsFields?.dealname) {

    await hubspotClient.crm.deals.basicApi.create({
      associations: null,
      properties: {
        'dealstage': dealsFields.dealstage ? dealsFields.dealstage : 'appointmentscheduled',
        'pipeline': dealsFields.dealstage ? dealsFields.dealstage : 'default',
        ...dealsFields,
      },
    })
  }
}


async function createOrUpdateCompanies(predefined_hs_company_id: string, companyFields: IFields, hubspotClient: hubspot.Client, userId: string): Promise<CompanyModel | null> {
  let company: CompanyModel = null

  if (predefined_hs_company_id) {
    company = await CompanyModel
      .query()
      .where({ hubspot_id: predefined_hs_company_id })
      .first()

    if (companyFields?.name) {
      company = await CompanyModel
        .query()
        .patchAndFetchById(company.id, { name: companyFields.name })
    }

    await hubspotClient.crm.companies.basicApi.update(
      predefined_hs_company_id,
      { properties: companyFields }
    )
  } else if (companyFields && companyFields?.name) {
    company = await CompanyModel
      .query()
      .where({ name: companyFields.name })
      .andWhere({ saas_client_id: userId })
      .first()

    if (!company) {
      company = await CompanyModel
        .query()
        .insert({
          id: ulid().toString(),
          name: companyFields?.name.toString(),
          saas_client_id: userId,
          icon: '',
          created_at: new Date(),
          updated_at: new Date(),
        })
    }

    if (!company.hubspot_id) {
      const hsCompany = await hubspotClient.crm.companies.basicApi.create({
        associations: null,
        properties: companyFields,
      })

      company = await CompanyModel
        .query()
        .patchAndFetchById(company.id, { hubspot_id: hsCompany.id })
    } else {
      company = await CompanyModel
        .query()
        .patchAndFetchById(company.id, { name: companyFields.name })

      await hubspotClient.crm.companies.basicApi.update(company.hubspot_id, {
        properties: companyFields,
      })
    }
  }

  return company
}


async function createContacts(contactFields: IFields, hubspotClient: hubspot.Client, companyFieldsName: string, companyId: string): Promise<null | SimplePublicObject> {
  let contact: SimplePublicObject = null
  if (contactFields && contactFields?.firstname) {
    contact = await hubspotClient.crm.contacts.basicApi.create({
      associations: companyFieldsName ? [{
        'to': { 'id': companyId },
        'types': [{ 'associationCategory': 'HUBSPOT_DEFINED', 'associationTypeId': 279 }],
      }] : null,
      properties: contactFields,
    })
  }

  return contact
}

async function savePresentationIntegration(userId: string, sessionId: string) {
  const hubspotClient = await getHubspotClient(userId)

  const presentationSession = await PresentationLinksModel.query().where({ id: sessionId }).first()

  const presentation = await PresentationModel.query().where({ id: presentationSession.presentation_id }).first()

  const fieldProperties = JSON.parse(presentation.integration_fields)

  const companyFields = await getMapIntegrationValues(fieldProperties.company, presentationSession)
  const contactFields = await getMapIntegrationValues(fieldProperties.contact, presentationSession)
  const dealsFields = await getMapIntegrationValues(fieldProperties.deals, presentationSession)

  await createOrUpdateDeals(hubspotClient, presentationSession.predefined_hs_deal_id, dealsFields)

  const company = await createOrUpdateCompanies(
    presentationSession.predefined_hs_company_id,
    companyFields,
    hubspotClient,
    userId
  )

  const contact = await createContacts(contactFields, hubspotClient, companyFields, company.id)

  return { company, contact }

}

async function saveHubspotField(
  userId: string,
  session: PresentationLinksModel,
  figureId: string,
  presentation: PresentationModel,
  figureValue: {
    value?: string | string[]
    fullName?: string
    business?: string
    phone?: string
    email?: string
    additionalFields?: string[]
    textMessage?: string
  },) {

  const hubspotClient = await getHubspotClient(userId)

  const fieldProp: {
    deals: { [key: string]: { id: string } }[]
    company: { [key: string]: { id: string } }[]
    contact: { [key: string]: { id: string } }[]
  } = JSON.parse(presentation.integration_fields)

  if (!fieldProp) {
    console.log(`No integration_fields for presentation_id - ${presentation.id}`)
    return
  }

  let propType = null
  let integrationPropType = null

  let companyNameId = null

  Object.entries(fieldProp ?? {}).forEach((type => {

    type[1].forEach(prop => {

      const keys = Object.keys(prop)
      keys.forEach(key => {

        if (type[0] === 'company' && key === 'name') {
          companyNameId = prop[key].id
        }

        if (prop[key].id === figureId) {
          propType = type[0]
          integrationPropType = key
        }
      })
    })
  }))

  if (!propType) throw new HttpError(400, 'Unexpected property type')
  if (!integrationPropType) throw new HttpError(400, 'Unexpected integration property type')

  const { value, ...customerDetails } = figureValue

  const fieldValue = value === null ? JSON.stringify(customerDetails) : Array.isArray(value) ? value.join(';') : value

  switch (propType) {
    case 'company': {
      await createOrUpdateCompanies(session.predefined_hs_company_id, { [integrationPropType]: fieldValue }, hubspotClient, userId)
      break
    }
    case 'deals': {
      await createOrUpdateDeals(hubspotClient, session.predefined_hs_deal_id, { [integrationPropType]: fieldValue })
      break
    }
    case 'contact': {
      const company = await CompanyModel
        .query()
        .where({ hubspot_id: session.predefined_hs_company_id })
        .first()

      const companyNameAnswer = await DataSessionsAnswersModel.query()
        .where('data_session_id', session.id)
        .andWhere('presentation_item_id', companyNameId)
        .first()

      const companyName = JSON.parse(companyNameAnswer.value)?.value ?? null
      let companyId = null


      if (company) {
        companyId = company.id
      } else if (!company && companyName && userId) {
        const company = await CompanyModel
          .query()
          .where({ name: companyName })
          .andWhere({ saas_client_id: userId })
          .first()

        companyId = company.id
      }

      await createContacts({ [integrationPropType]: fieldValue }, hubspotClient, companyName, companyId)
      break
    }
    default: {
      throw new HttpError(400, 'Unexpected property type')
    }
  }
}

const getHubspotNote = async (hubspotNoteId: string, hubspotClient: hubspot.Client) => {

  let existNoteInHubspot: SimplePublicObjectWithAssociations | null = null

  try {
    const hubspotNote = await hubspotClient.crm.objects.notes.basicApi.getById(hubspotNoteId, [
      'hs_body_preview',
      'hs_body_preview_html',
      'hs_body_preview_is_truncated',
      'hs_createdate',
      'hs_lastmodifieddate',
      'hs_note_body',
      'hs_object_id',
      'hs_object_source',
      'hs_object_source_id',
      'hs_timestamp'
    ])
    existNoteInHubspot = hubspotNote
  } catch (e) {
    console.warn(`Searching note error (hubspot_note_id=${hubspotNoteId})`)
  }
  return existNoteInHubspot
}

const getAssociations = (session: { predefined_hs_company_id?: string, predefined_hs_deal_id?: string }) => {
  const associationsToId = (session.predefined_hs_deal_id ? session.predefined_hs_deal_id : session.predefined_hs_company_id) ?? null
  const associationsTo = { id: associationsToId }

  const associationTypeIds = {
    noteToCompany: 190,
    noteToDeal: 214
  }

  const associationTypeId = session.predefined_hs_deal_id ?
    associationTypeIds.noteToDeal :
    session.predefined_hs_company_id ?
      associationTypeIds.noteToCompany :
      null

  const associationsType: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: number }] = [{
    associationCategory: 'HUBSPOT_DEFINED',
    associationTypeId
  }]

  const associations = associationsToId && associationTypeId ?
    [{ to: associationsTo, types: associationsType }] :
    null

  return associations
}

const saveNote = async (session: PresentationLinksModel, slideNote: string, numberOfSlide: number, slideId: string): Promise<SimplePublicObject> => {

  const presentation = await PresentationModel
    .query()
    .where('id', session.presentation_id)
    .first()

  const hubspotClient = await HubspotService.getHubspotClient(presentation.user_id)

  const slideNotes = await SlidesNotesModel
    .query()
    .where('session_id', session.id,)
    .andWhere('slide_id', slideId)

  const hubspotNoteId = slideNotes.find(note => note.hubspot_note_id)?.hubspot_note_id ?? null

  let existNoteInHubspot: SimplePublicObjectWithAssociations | null = null

  if (!hubspotNoteId) {
    console.warn(`Notes from slide (slide_id=${slideNotes?.[0]?.slide_id}) have not contained hubspot note id`)
  } else {
    const hubspotNote = await getHubspotNote(hubspotNoteId, hubspotClient)
    existNoteInHubspot = hubspotNote
  }

  const associations = getAssociations(session)

  let note = null

  try {
    if (existNoteInHubspot) {
      let html: string = JSON.parse(JSON.stringify(existNoteInHubspot.properties.hs_note_body))
      const findLastLiIndex = html.indexOf('</li></ul>')

      if (findLastLiIndex === -1) {
        console.warn('Notes not in <li> tag')
        html += ` ${slideNote}`
      } else {
        const htmlArr = html.split('</li></ul>')
        html = htmlArr[0] + `</li><li>${slideNote}</li></ul>`
      }

      note = await hubspotClient.crm.objects.notes.basicApi.update(existNoteInHubspot.id, {
        properties: { hs_note_body: html }
      })

    } else {

      const html = `<strong>Slide #${numberOfSlide}, Session name: ${session.name}</strong><ul><li>${slideNote}</li></ul>`
      note = await hubspotClient.crm.objects.notes.basicApi.create({
        associations,
        properties: { hs_timestamp: Date.now().toString(), hs_note_body: html }
      })
    }
    return note
  } catch (e) {
    console.warn(`Unsuccessful try to save note in hubspot. Error - ${e}`)
  }
}

const deleteNote = async (note: SlidesNotesModel): Promise<void> => {
  const session = await PresentationLinksModel.query().where('id', note.session_id).first()
  const presentation = await PresentationModel.query().where('id', session.presentation_id).first()

  const hubspotClient = await HubspotService.getHubspotClient(presentation?.user_id)

  let existNoteInHubspot: SimplePublicObjectWithAssociations | null = null

  if (!note.hubspot_note_id) {
    console.warn(`Notes from slide (slide_id=${note.slide_id}) have not contained hubspot note id`)
    return void 0
  } else {
    const hubspotNote = await getHubspotNote(note.hubspot_note_id, hubspotClient)
    if (!hubspotNote) return void 0
    existNoteInHubspot = hubspotNote
  }

  const noteBody = existNoteInHubspot.properties.hs_note_body.split(/<li><\/li>|<li>|<\/li>/g).filter(item => item)

  if (noteBody.length === 1) {
    console.warn('Notes not in <li> tag')

    return void 0
  }

  let isRemovedNote = false
  const htmlArr = noteBody.filter((item) => {
    if (item === note.note && !isRemovedNote) {
      isRemovedNote = true
      return false
    }
    return true
  }).map((item, index, arr) => index === 0 || arr.length - 1 === index ? item : `<li>${item}</li>`)

  if (htmlArr.length < 3) {
    hubspotClient.crm.objects.notes.basicApi.archive(existNoteInHubspot.id)
  } else {
    const html = htmlArr.join('')
    hubspotClient.crm.objects.notes.basicApi.update(existNoteInHubspot.id, {
      properties: { hs_note_body: html }
    })
  }
}

export const HubspotService = {
  getHubspotClient,
  getUsersTokens,
  savePresentationIntegration,
  mapSessionAnswers,
  saveHubspotField,
  saveNote,
  deleteNote
}
