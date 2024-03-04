import { Model } from 'objection'

export interface ISaasCompany {
  id?: string
  owner_id?: string
  name?: string
  domain?: string
}

export class SaasCompanyModel extends Model implements ISaasCompany {
  static get tableName() {
    return 'saas_companies'
  }

  id?: string
  owner_id?: string
  name?: string
  domain?: string
}
