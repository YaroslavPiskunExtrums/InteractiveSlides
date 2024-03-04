import { Model } from 'objection'

export interface ICompany {
  id?: string
  name: string
  icon?: string
  created_at: Date
  updated_at: Date
  saas_client_id?: string
  hubspot_id?: string
}
export class CompanyModel extends Model implements ICompany {
  static get tableName() {
    return 'customer_companies'
  }
  id?: string
  name: string
  icon?: string
  created_at: Date
  updated_at: Date
  saas_client_id?: string
  hubspot_id?: string
}
