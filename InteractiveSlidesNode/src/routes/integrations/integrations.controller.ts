import * as hubspot from '@hubspot/api-client'
import { Request, Response } from 'express'
import { IntegrationsModel } from '@models/integrations.model.js'
import {
  createHubspotContactValidation,
  createIntegrationPropertyValidation,
  insertIntegrationKeys,
  loginCallbackValidation,
  updateIntegrationConfig, zapierAuthValidation, zapierWebhookCreateValidation,
} from '@app/routes/integrations/integrations.validation.js'
import * as process from 'process'
import * as console from 'console'
import { HubspotService } from '@lib/services/hubspot.service.js'
import { HttpError } from '@lib/utils/middlewares/http-error.js'
import { CompanyModel } from '@models/company.model.js'
import { ulid } from 'ulid'
import { SalesModel } from '@models/sales.model.js'
import { PresentationLinksModel } from '@models/presentation-links-model.js'
import { PresentationModel } from '@models/presentation.model.js'
import { UserModel } from '@models/user.model.js'
import jwt from 'jsonwebtoken'
import { getLogger } from '@lib/logger.js'
import { ReqAuth } from '@lib/interfaces/reqAuth.js'
import { IntegrationEventsModel } from '@models/integration-event.model.js'
import { SaasCompanyModel } from '@models/saas-company.model.js'
import { DataSessionsAnswersModel } from '@models/data-session-answers.model.js'
import { ZapierService } from '@lib/services/zapier.service.js'
import fetch from 'node-fetch'


const getAuthorizationUrl = async (req: Request, res: Response) => {
  const hubspotClient = new hubspot.Client({ apiKey: process.env.HUBSPOT_DEVELOPER_API_KEY })
  const scopes = 'actions oauth crm.objects.custom.read crm.objects.custom.write crm.objects.companies.read crm.objects.companies.write crm.objects.companies.write crm.objects.contacts.write crm.schemas.companies.read crm.schemas.companies.write crm.schemas.contacts.read crm.schemas.contacts.write'
  const authUrl = hubspotClient.oauth.getAuthorizationUrl(process.env.HUBSPOT_CLIENT_ID, process.env.HUBSPOT_REDIRECT_URI, scopes)
  res.status(200).json({ link: process.env.HUBSPOT_SCOPE_REDIRECT_URL })
}


const callback = async (req: Request, res: Response) => {
  const client = new hubspot.Client({ developerApiKey: process.env.HUBSPOT_DEVELOPER_API_KEY })

  const { code } = await loginCallbackValidation.validate(req.query)


  const token = await client.oauth.tokensApi.create(
    'authorization_code',
    code,
    process.env.HUBSPOT_REDIRECT_URI,
    process.env.HUBSPOT_CLIENT_ID,
    process.env.HUBSPOT_CLIENT_SECRET,
  )


  const clientHubspot = new hubspot.Client({ accessToken: token.accessToken })

  const objectType = 'companies'
  const archived = false
  const properties = undefined


  try {
    const apiResponse = await clientHubspot.crm.properties.coreApi.getAll(objectType, archived, properties)
    console.log(apiResponse.results.filter((property) => property.groupName === 'companyinformation'))
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }

  const tokenData = await client.oauth.accessTokensApi.get(token.accessToken)

  res.redirect(`${process.env.HUBSPOT_SUCCESS_REDIRECT_URI}/?service=${encodeURIComponent('hubspot')}&hubspot_id=${encodeURIComponent(tokenData.userId)}&hubspot_portal_id=${encodeURIComponent(tokenData.hubId)}&access_token=${encodeURIComponent(token.accessToken)}&refresh_token=${encodeURIComponent(token.refreshToken)}&token_type=${encodeURIComponent(token.tokenType)}&expires_in=${encodeURIComponent(token.expiresIn)}`)
}

const saveUsersKeys = async (req: Request, res: Response) => {

  const {
    access_token,
    refresh_token,
    token_type,
    expires_in,
    user_id,
    hubspot_id,
    hubspot_portal_id,
  } = await insertIntegrationKeys.validate(req.body)


  let integration = await IntegrationsModel.query().where({ user_id }).first()


  if (integration) {
    integration = await IntegrationsModel.query().patchAndFetchById(integration.id, {
      access_token,
      refresh_token,
      token_type,
      expires_in,
      user_id,
      hubspot_id,
      hubspot_portal_id,
    })
  } else {
    integration = await IntegrationsModel.query().insert({
      access_token,
      refresh_token,
      token_type,
      expires_in,
      user_id,
      hubspot_id,
      hubspot_portal_id,
    })
  }

  res.status(200).send(integration)
}

const addHubspotContact = async (req: Request, res: Response) => {
  const { userId, properties: fieldProperties } = await createHubspotContactValidation.validate(req.body)

  const userIntegrationsTokens = await HubspotService.getUsersTokens(userId)

  if (!userIntegrationsTokens) {
    new HttpError(400, 'User has no integrations')
  }

  const hubspotClient = new hubspot.Client({
    accessToken: userIntegrationsTokens.access_token,
  })

  let company = null

  if (fieldProperties.company_name) {
    const limit = 100
    const after = undefined
    const properties = undefined
    const propertiesWithHistory = undefined
    const associations = undefined
    const archived = false

    const companies = await hubspotClient.crm.companies.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived)


    company = companies.results.find((company) => company.properties.name === fieldProperties.company_name)

    if (!company) {
      company = await hubspotClient.crm.companies.basicApi.create({
        associations: null,
        properties: {
          name: fieldProperties.company_name,
          domain: fieldProperties.company_domain,
          phone: fieldProperties.company_phone,
          city: fieldProperties.company_city,
          state: fieldProperties.company_state,
          industry: fieldProperties.company_industry,
          annualrevenue: fieldProperties.company_revenue,
        },
      })
    } else {
      company = await hubspotClient.crm.companies.basicApi.update(company.id, {
        properties: {
          name: fieldProperties.company_name,
          domain: fieldProperties.company_domain,
          phone: fieldProperties.company_phone,
          city: fieldProperties.company_city,
          state: fieldProperties.company_state,
          industry: fieldProperties.company_industry,
          annualrevenue: fieldProperties.company_revenue,
        },
      })
    }

    console.log('COMPANY', company)


  }

  const nameString = fieldProperties.name.split(' ')

  const firstName = nameString.shift()
  const lastName = nameString.join(' ')
  const userProperties = {
    firstname: firstName,
    lastname: lastName,
    email: '',
    company: fieldProperties.company_name,
    phone: '',
    website: '',
  }

  const createUserResponse = await hubspotClient.crm.contacts.basicApi.create({
      associations: fieldProperties.company_name ? [{
        'to': { 'id': company.id },
        'types': [{ 'associationCategory': 'HUBSPOT_DEFINED', 'associationTypeId': 279 }],
      }] : null,
      properties: userProperties,
    },
  )

  console.log('INTEGRATION USER CREATED', createUserResponse)
  res.json(createUserResponse)
}

const getHubspotCompaniesSessions = async (req: Request, res: Response) => {
  const { name: companyName, userId, hs_object_id, portalId } = req.query as {
    name: string,
    userId: string,
    hs_object_id: string,
    portalId: string
  }


  // let integrationData = await IntegrationsModel.query().findOne({ hubspot_id: userId })

  const integrationData = await IntegrationsModel.query().findOne({ hubspot_portal_id: portalId })


  const user = await UserModel.query().findOne({ id: integrationData.user_id })


  let company = await CompanyModel.query().where({ hubspot_id: hs_object_id }).first()

  if (!company) {
    company = await CompanyModel.query().insert({
      id: ulid().toString(),
      name: companyName,
      created_at: new Date(),
      updated_at: new Date(),
      icon: '',
      saas_client_id: user.id,
      hubspot_id: hs_object_id,
    })
  }


  const companyUsers = await UserModel.query().where({ saas_company_id: user.saas_company_id })


  const companyPresentations = await PresentationModel.query().whereIn('user_id', companyUsers.map((user) => user.id))


  res.render('hubspotPresentations', {
    presentations: companyPresentations,
    apiUrl: process.env.SELF_HOST,
    hs_object_id: -1,
    hs_company_id: company.hubspot_id,
    objectTheme: 'companies',
    userId,
    portalId,
  })
}


const getHubspotDealsSessions = async (req: Request, res: Response) => {
  const { name: dealName, userId, hs_object_id, portalId } = req.query as {
    name: string,
    userId: string,
    hs_object_id: string,
    portalId: string
  }


  const integrationData = await IntegrationsModel.query().findOne({ hubspot_portal_id: portalId })

  const user = await UserModel.query().findOne({ id: integrationData.user_id })


  const authTokens = await HubspotService.getUsersTokens(user.id)

  const hubspotClient = new hubspot.Client({ accessToken: authTokens.access_token })

  const deal = await hubspotClient.crm.deals.basicApi.getById(hs_object_id, null, null, ['contacts', 'companies'])


  const companyAssociationId = deal.associations?.companies?.results[0]?.id
  const contactAssociationId = deal.associations?.companies?.results[0]?.id
  const hsCompany = await hubspotClient.crm.companies.basicApi.getById(companyAssociationId)


  let company = await CompanyModel.query().where({ hubspot_id: companyAssociationId }).first()
  if (!company) {
    company = await CompanyModel.query().insert({
      id: ulid().toString(),
      name: hsCompany.properties.name,
      created_at: new Date(),
      updated_at: new Date(),
      icon: '',
      saas_client_id: user.id,
      hubspot_id: companyAssociationId,
    })
  }
  const companyUsers = await UserModel.query().where({ saas_company_id: user.saas_company_id })
  console.log('DEALS companyUsers', companyUsers.length)
  const companyPresentations = await PresentationModel.query().whereIn('user_id', companyUsers.map((user) => user.id))
  console.log('DEALS companyPresentations', companyPresentations.length)

  res.render('hubspotPresentations', {
    presentations: companyPresentations,
    apiUrl: process.env.SELF_HOST,
    hs_company_id: company.hubspot_id,
    hs_object_id: hs_object_id,
    userId,
    objectTheme: 'deals',
    portalId,
  })
}

const integrationPresentationSession = async (req: Request, res: Response) => {
  const { presentationId, userId, hs_company_id, hs_object_id, objectTheme, portalId } = req.query as {
    presentationId: string,
    userId: string,
    hs_company_id: string,
    hs_object_id: string,
    objectTheme: string,
    portalId: string
  }


  const company = await CompanyModel.query().where({ hubspot_id: hs_company_id }).first()
  const sales = await SalesModel.query().where({ company_id: company.id })


  let integrationData = await IntegrationsModel.query().findOne({ hubspot_id: userId })

  if (!integrationData) {
    integrationData = await IntegrationsModel.query().findOne({ hubspot_portal_id: portalId })
  }

  const user = await UserModel.query().findOne({ id: integrationData.user_id })

  const companySessions = []

  for (const sale of sales) {
    const sessions = await PresentationLinksModel.query().where({ sales_id: sale.id }).andWhere({ presentation_id: presentationId })

    sessions.forEach((session) => {
      const date = new Date(session.created_at)

      const dateStr =
        ('00' + (date.getMonth() + 1)).slice(-2) + '/' +
        ('00' + date.getDate()).slice(-2) + '/' +
        date.getFullYear() + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2)
      companySessions.push({
        name: session.name,
        sales: sale.name,
        link: `${process.env.SELF_HOST}/api/HTML/view-presentation/${session.id}`,
        created_at: dateStr,
      })
    })
  }


  res.render('hubspotSessions', {
    sessions: companySessions,
    presentation_id: presentationId,
    apiUrl: process.env.SELF_HOST,
    hs_company_id: company.hubspot_id,
    hs_object_id: hs_object_id,
    company: company.name,
    objectTheme,
    userId,
    user_id: user.id,
    jwt: `Bearer ${jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })}`,
    salesName: user.username,
    portalId,
  })

}

const names = ['Phone Number'].map((name) => name.toLowerCase())


const getHubspotCompanyProperties = async (req: Request, res: Response) => {
  const { userId } = req.query as {
    userId: string
  }


  const userTokens = await HubspotService.getUsersTokens(userId)
  const hubspotClient = new hubspot.Client({ accessToken: userTokens.access_token })


  const objectType = 'companies'
  const archived = false
  const properties = undefined

  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.getAll(objectType, archived, properties)

    const companyProperties = apiResponse.results.filter((property) => (property.groupName === 'companyinformation' || property.groupName === 'company_activity') && !property.hidden)
    res.status(200).json(companyProperties)
  } catch (e) {

    new HttpError(400, e.message)
  }
}

const getHubspotClientProperties = async (req: Request, res: Response) => {
  const { userId } = req.query as {
    userId: string
  }


  const userTokens = await HubspotService.getUsersTokens(userId)
  const hubspotClient = new hubspot.Client({ accessToken: userTokens.access_token })

  const objectType = 'contacts'
  const archived = false
  const properties = undefined

  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.getAll(objectType, archived, properties)


    const companyProperties = apiResponse.results.filter((property) => (property.groupName === 'contactinformation' || property.groupName === 'contact_activity') && !property.hidden)
    res.status(200).json(companyProperties)
  } catch (e) {
    new HttpError(400, e.message)
  }

}

const getHubspotDealsProperties = async (req: Request, res: Response) => {
  const { userId } = req.query as {
    userId: string
  }
  const userTokens = await HubspotService.getUsersTokens(userId)
  const hubspotClient = new hubspot.Client({ accessToken: userTokens.access_token })

  const objectType = 'deals'
  const archived = false
  const properties = undefined

  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.getAll(objectType, archived, properties)


    const dealsProperties = apiResponse.results.filter((property) => !property.hidden)
    res.status(200).json(dealsProperties)
  } catch (e) {
    new HttpError(400, e.message)
  }
}

const createHubspotProperty = async (req: Request, res: Response) => {
  const { label, scope, userId } = await createIntegrationPropertyValidation.validate(req.body)
  const PropertyCreate = {
    name: label.toLowerCase().split(' ').join('_'),
    label: label,
    type: 'string',
    fieldType: 'text',
    groupName: 'companyinformation',
    options: [],
    displayOrder: 0,
    hasUniqueValue: false,
    hidden: false,
    formField: true,
  }
  let objectType = ''


  const userIntegrationsTokens = await HubspotService.getUsersTokens(userId)

  let hubspotProperties = null
  const hubspotClient = new hubspot.Client({ accessToken: userIntegrationsTokens.access_token })


  if (scope === 'company') {
    hubspotProperties = await hubspotClient.crm.properties.coreApi.getAll('companies', false, undefined)
    PropertyCreate.groupName = 'companyinformation'
    objectType = 'companies'
  }
  if (scope === 'contact') {
    hubspotProperties = await hubspotClient.crm.properties.coreApi.getAll('contacts', false, undefined)
    PropertyCreate.groupName = 'contactinformation'
    objectType = 'contacts'
  }
  if (scope === 'deals') {
    hubspotProperties = await hubspotClient.crm.properties.coreApi.getAll('deals', false, undefined)
    PropertyCreate.groupName = 'dealinformation'
    objectType = 'deals'
  }

  console.log('CUSTOM PROPERTY IS CREATING', label, scope)

  if (hubspotProperties && !hubspotProperties.results.find((property) => property.name === hubspotProperties.name)) {
    // @ts-ignore
    const apiResponse = await hubspotClient.crm.properties.coreApi.create(objectType, PropertyCreate)
    return res.json({ property: apiResponse })
  } else new HttpError(400, 'Property already exists')

}

const updatePresentationIntegrationConfig = async (req: Request, res: Response) => {
  const { presentationId, integrationConfig } = await updateIntegrationConfig.validate(req.body)

  const presentation = await PresentationModel.query().where({ id: presentationId }).first()


  if (!presentation) {
    new HttpError(400, 'Presentation not found')
  }

  const updatedPresentation = await PresentationModel.query().patchAndFetchById(presentation.id, { integration_fields: JSON.stringify(integrationConfig) })

  res.json({ presentation: updatedPresentation })
}


const savePresentationIntegration = async (req: Request, res: Response) => {
  const { userId, properties, fields, presentation: presentationId } = req.body

  const userIntegrationsTokens = await HubspotService.getUsersTokens(userId)

  const customCompanyProperties = properties.company.filter((property) => {
    return property?.custom
  })


  const customClientProperties = properties.contact.filter((property) => {
    return property?.custom
  })


  const customDealsProperties = properties.contact.filter((property) => {
    return property?.custom
  })

  const hubspotClient = new hubspot.Client({ accessToken: userIntegrationsTokens.access_token })
  const companyProperties = await hubspotClient.crm.properties.coreApi.getAll('companies', false, undefined)
  const contactProperties = await hubspotClient.crm.properties.coreApi.getAll('contacts', false, undefined)
  const dealsProperties = await hubspotClient.crm.properties.coreApi.getAll('deals', false, undefined)


  for (const customCompanyProperty of customCompanyProperties) {
    const PropertyCreate = {
      name: customCompanyProperty.name,
      label: customCompanyProperty.label,
      type: 'string',
      fieldType: 'text',
      groupName: 'companyinformation',
      options: [],
      displayOrder: 0,
      hasUniqueValue: false,
      hidden: false,
      formField: true,
    }
    const objectType = 'companies'

    if (!companyProperties.results.find((property) => property.groupName === 'companyinformation' && property.name === customCompanyProperty.name)) {
      // @ts-ignore
      const apiResponse = await hubspotClient.crm.properties.coreApi.create(objectType, PropertyCreate)
      console.log('PROPERTY CREATE COM', apiResponse)
    } else new HttpError(400, 'Property already exists')
  }
  for (const customClientProperty of customClientProperties) {
    const PropertyCreate = {
      name: customClientProperty.name,
      label: customClientProperty.label,
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation',
      options: [],
      displayOrder: 0,
      hasUniqueValue: false,
      hidden: false,
      formField: true,
    }
    const objectType = 'contacts'

    if (!contactProperties.results.find((property) => property.groupName === 'contactinformation' && property.name === customClientProperty.name)) {
      // @ts-ignore
      const apiResponse = await hubspotClient.crm.properties.coreApi.create(objectType, PropertyCreate)
      console.log('PROPERTY CREATE CON', apiResponse)
    } else new HttpError(400, 'Property already exists')

  }

  for (const customDealsProperty of customDealsProperties) {
    const PropertyCreate = {
      name: customDealsProperty.name,
      label: customDealsProperty.label,
      type: 'string',
      fieldType: 'text',
      groupName: 'dealinformation',
      options: [],
      displayOrder: 0,
      hasUniqueValue: false,
      hidden: false,
      formField: true,
    }
    const objectType = 'deals'

    if (!dealsProperties.results.find((property) => property.name === customDealsProperty.name)) {
      // @ts-ignore
      const apiResponse = await hubspotClient.crm.properties.coreApi.create(objectType, PropertyCreate)
      console.log('PROPERTY CREATE CON', apiResponse)
    } else new HttpError(400, 'Property already exists')
  }

  const mergedFields = { contact: [], company: [], deals: [] }

  properties.contact.forEach((property, index) => {
    mergedFields.contact.push({
      [property.name]: fields.contact[index],
    })
  })
  properties.company.forEach((property, index) => {
    mergedFields.company.push({
      [property.name]: fields.company[index],
    })
  })
  properties.deals.forEach((property, index) => {
    mergedFields.deals.push({
      [property.name]: fields.deals[index],
    })
  })

  console.log('MERGED FIELDS', JSON.stringify(mergedFields))

  let presentation = await PresentationModel.query().where({ id: presentationId }).first()
  presentation = await PresentationModel.query().patchAndFetchById(presentation.id, { integration_fields: JSON.stringify(mergedFields) })


  res.json({ presentation })
}

// const syncSessions = async (req: Request, res: Response) => {
//   let customObjectSchemeId = await IntegrationSchemeModel.query().findOne({ scheme_id:  })
// }

const resolveUserInternalApiKey = async (req: Request & ReqAuth, res: Response) => {
  const user = req.auth

  let internalUserApiKey = await IntegrationsModel.query().findOne({ user_id: user.id })
  if (!internalUserApiKey) {
    internalUserApiKey = await IntegrationsModel.query().insert({
      hubspot_id: '',
      hubspot_portal_id: '',
      user_id: user.id,
      internal_api_key: ulid().toString(),
      access_token: '',
      refresh_token: '',
      token_type: '',
      expires_in: '',
      created_at: new Date(),
    })
  }
  if (!internalUserApiKey.internal_api_key) {
    internalUserApiKey = await IntegrationsModel.query().patchAndFetchById(internalUserApiKey.id, {
      internal_api_key: ulid().toString(),
    })
  }
  return res.json({ internal_api_key: internalUserApiKey.internal_api_key })
}

const zapierAuthUser = async (req: Request, res: Response) => {
  const { query, body } = req
  console.log('QUERY', query, body)

  const { api_key } = query as {
    api_key: string
  }
  const userIntegration = await IntegrationsModel.query().findOne({ internal_api_key: api_key })
  if (!userIntegration) {
    return res.status(400).json({ message: 'User not found' })
  }
  const user = await UserModel.query().findOne({ id: userIntegration.user_id })
  return res.json({ id: user.id, email: user.email, username: user.username, name: user.username })
}

const getZapierIntegrationPresentations = async (req: Request, res: Response) => {
  const { query, body } = req

  console.log('QUERY', query)


  const { api_key } = query as {
    api_key: string
  }
  const userIntegration = await IntegrationsModel.query().findOne({ internal_api_key: api_key })
  if (!userIntegration) {
    return res.status(400).json({ message: 'User not found' })
  }
  const user = await UserModel.query().findOne({ id: userIntegration.user_id })
  const saasCompanyUsers = await UserModel.query().where({ saas_company_id: user.saas_company_id })
  let saasCompanyPresentations: any = await PresentationModel.query().whereIn('user_id', saasCompanyUsers.map((user) => user.id))
  saasCompanyPresentations = saasCompanyPresentations.map((presentation: PresentationModel) => {

    return {
      id: presentation.id,
      name: presentation.name,
    }
  })

  saasCompanyPresentations = [
    {
      id: '0',
      name: 'All presentations',
    },
    ...saasCompanyPresentations,
  ]

  return res.json(saasCompanyPresentations)
}


const zapierCreateUserHook = async (req: Request, res: Response) => {
  const allPresentationId = process.env.ALL_PRESENTATION_ID

  console.log('ZAPIER CREATE HOOK B', req.body)
  console.log('ZAPIER CREATE HOOK Q', req.query)

  const { hookUrl, presentations } = await zapierWebhookCreateValidation.validate(req.body)
  const { api_key } = await zapierAuthValidation.validate(req.query)

  const userIntegration = await IntegrationsModel.query().findOne({ internal_api_key: api_key })

  const presentationsList = [...new Set(presentations)]

  if (!userIntegration) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (presentationsList.find((presentation) => presentation === '0')) {
    const user = await UserModel.query().findOne({ id: userIntegration.user_id })
    const saasCompanyUsers = await UserModel.query().where({ saas_company_id: user.saas_company_id })





    let hook = await IntegrationEventsModel.query().insert({
      id: ulid().toString(),
      url: hookUrl,
      integration_id: +userIntegration.id,
      presentation_id: allPresentationId,
    })



    const saasCompanyPresentations = await PresentationModel.query().whereIn('user_id', saasCompanyUsers.map((user) => user.id))
    const saasFinishedSessions = await PresentationLinksModel.query().whereIn('presentation_id', saasCompanyPresentations.map((presentation) => presentation.id)).andWhere({ finished: true })
    for (const finishedSession of saasFinishedSessions) {
      const sessionAnswers = await DataSessionsAnswersModel.query().where('data_session_id', finishedSession.id)
      let answersObject = await ZapierService.mapAnswer(finishedSession.name, sessionAnswers)
      try {
        const zapierResponse = await fetch(hookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answersObject),
        })

        const zapierResponseJson = await zapierResponse.json()
        console.log('zapierResponseJson', zapierResponseJson)

      } catch (e) {
        throw new HttpError(500, 'Zapier error; ' + e.message)
      }
    }
    return res.json({ status: 'ok', hook: { id: hook.id } })
  }
  else {
    const hooks = []
    for (const presentationId of presentationsList) {
      const presentation = await PresentationModel.query().findOne({ id: presentationId })
      if (!presentation) {
        return res.status(404).json({ message: 'Presentation not found' })
      }
      let hook = await IntegrationEventsModel.query().insert({
        id: ulid().toString(),
        url: hookUrl,
        integration_id: +userIntegration.id,
        presentation_id: presentationId,
      })
      hooks.push(hook)
      const finishedSessions = await PresentationLinksModel.query().where({ presentation_id: presentationId }).andWhere({ finished: true })
      for (const finishedSession of finishedSessions) {
        const sessionAnswers = await DataSessionsAnswersModel.query().where('data_session_id', finishedSession.id)
        let answersObject = await ZapierService.mapAnswer(finishedSession.name, sessionAnswers)
        try {
          const zapierResponse = await fetch(hookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(answersObject),
          })


          const zapierResponseJson = await zapierResponse.json()
          console.log('zapierResponseJson', zapierResponseJson)

        } catch (e) {
          throw new HttpError(500, 'Zapier error; ' + e.message)
        }
      }
    }
    return res.json({ status: 'ok', hooks })
  }


}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const zapierRemoveUserHook = async (req: Request, res: Response) => {
  const { body, query } = req
  console.log('--- REMOVING ---')
  console.log('BODY', body)
  console.log('QUERY', query)
  console.log('----------------')

  return res.json({ status: 'ok' })
}

export const IntegrationsController = {
  getAuthorizationUrl,
  callback,
  saveUsersKeys,
  addHubspotContact,
  getHubspotCompaniesSessions,
  getHubspotCompanyProperties,
  getHubspotClientProperties,
  savePresentationIntegration,
  getHubspotDealsSessions,
  getHubspotDealsProperties,
  integrationPresentationSession,
  updatePresentationIntegrationConfig,
  createHubspotProperty,
  zapierAuthUser,
  getZapierIntegrationPresentations,
  resolveUserInternalApiKey,
  zapierCreateUserHook,
  zapierRemoveUserHook,
}
