import { Model } from 'objection'

export interface IUser {
  id?: string
  email: string
  password: string
  username?: string,
  saas_company_id?: string,
  is_super_user?: boolean,
  is_trial_user?: boolean,
}
export class UserModel extends Model implements IUser {
  static get tableName() {
    return 'users'
  }
  is_super_user?: boolean
  id?: string
  email: string
  password: string
  username?: string
  saas_company_id?: string
  is_trial_user?: boolean
}

