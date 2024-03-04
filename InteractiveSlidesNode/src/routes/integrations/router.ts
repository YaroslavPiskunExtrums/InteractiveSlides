import { Router } from 'express'
import { IntegrationsController } from '@app/routes/integrations/integrations.controller.js'
import { createAuthMiddleware } from '@lib/utils/middlewares/auth.middleware.js'

export function createIntegrationsRouter() {
  const router = Router({ mergeParams: true })
  router.get('/hubspot/authorization-url', IntegrationsController.getAuthorizationUrl)
  router.get('/hubspot/callback', IntegrationsController.callback)
  router.post('/hubspot/save-users-keys', IntegrationsController.saveUsersKeys)

  router.get('/hubspot/get-company-sessions', IntegrationsController.getHubspotCompaniesSessions)
  router.get('/hubspot/get-deals-sessions', IntegrationsController.getHubspotDealsSessions)
  router.get('/hubspot/presentation-sessions', IntegrationsController.integrationPresentationSession)

  router.post('/hubspot/add', IntegrationsController.addHubspotContact)


  router.get('/hubspot/get-company-properties', IntegrationsController.getHubspotCompanyProperties)
  router.get('/hubspot/get-contact-properties', IntegrationsController.getHubspotClientProperties)
  router.get('/hubspot/get-deals-properties', IntegrationsController.getHubspotDealsProperties)

  router.post('/hubspot/save-presentations', IntegrationsController.savePresentationIntegration)


  router.post('/hubspot/create-custom-field', IntegrationsController.createHubspotProperty)

  router.post('/hubspot/update-integration-config', IntegrationsController.updatePresentationIntegrationConfig)


  router.get("/resolve-user-internal-api-key", createAuthMiddleware(),  IntegrationsController.resolveUserInternalApiKey)

  router.get("/zapier-auth-user", IntegrationsController.zapierAuthUser)
  router.get("/zapier/user-presentations", IntegrationsController.getZapierIntegrationPresentations)
  router.post("/zapier/subscription", IntegrationsController.zapierCreateUserHook)
  router.delete("/zapier/subscription", IntegrationsController.zapierRemoveUserHook)
  return router
}
