import { Model } from 'objection'

export interface IIntegrations {
  id?: string
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: string
  created_at?: Date
  user_id?: string
  hubspot_id?: string
  hubspot_portal_id?: string,
  internal_api_key?: string
}
export class IntegrationsModel extends Model implements IIntegrations {
  static get tableName() {
    return 'integrations'
  }
  id?: string
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: string
  created_at?: Date
  user_id?: string
  hubspot_id?: string
  hubspot_portal_id?: string
  internal_api_key?: string
}
