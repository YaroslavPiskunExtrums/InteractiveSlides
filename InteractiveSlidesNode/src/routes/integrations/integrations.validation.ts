import yup from 'yup'

export const insertIntegrationKeys = yup.object().shape({
  access_token: yup.string().required(),
  refresh_token: yup.string().required(),
  token_type: yup.string().required(),
  hubspot_id: yup.string(),
  hubspot_portal_id: yup.string(),
  expires_in: yup.string(),
  user_id: yup.string(),
})

export const createIntegrationPropertyValidation = yup.object().shape({
  label: yup.string().required(),
  scope: yup.string().required(),
  userId: yup.string().required(),
})

export const loginCallbackValidation = yup.object().shape({
  code: yup.string().required(),
})


export const updateIntegrationConfig = yup.object().shape({
  integrationConfig: yup.object(),
  presentationId: yup.string().required(),
})

export const createHubspotContactValidation = yup.object().shape({
  userId: yup.string().required(),
  properties: yup.object().shape({
    email: yup.string(),
    name: yup.string(),
    phone: yup.string(),
    website: yup.string(),

    company_name: yup.string(),
    company_revenue: yup.string(),
    company_domain: yup.string(),
    company_phone: yup.string(),
    company_city: yup.string(),
    company_state: yup.string(),
    company_industry: yup.string(),
  }),
})

export const zapierAuthValidation = yup.object().shape({
  api_key: yup.string().required(),
})

export const zapierWebhookCreateValidation = yup.object().shape({
  hookUrl: yup.string().required(),
  presentations:  yup.array().of(yup.string()),
})
