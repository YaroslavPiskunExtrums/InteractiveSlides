import { Model } from 'objection'

export interface IIntegrationSchemes {
  id?: string
  scheme_id: string
  created_at?: Date
}
export class IntegrationSchemeModel extends Model implements IIntegrationSchemes {
  static get tableName() {
    return 'integration_schemes'
  }
  id?: string
  scheme_id: string
  created_at?: Date
}
