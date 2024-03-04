import { Model } from 'objection'

export interface ISales {
  id?: string
  name: string
  created_at: Date
  updated_at: Date
  company_id?: string
}
export class SalesModel extends Model implements ISales {
  static get tableName() {
    return 'sales'
  }
  id?: string
  name: string
  created_at: Date
  updated_at: Date
  company_id?: string
}
