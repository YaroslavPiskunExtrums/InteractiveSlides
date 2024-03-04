import { Model } from 'objection'

export interface IPresentationLink {
  id?: string
  presentation_id: string
  name: string
  answers: string
  created_at?: string
  finished: boolean
  sales_id?: string
  updated_at?: string
  predefined_hs_company_id?: string
  predefined_hs_deal_id?: string
}

export class PresentationLinksModel extends Model implements IPresentationLink {
  static get tableName() {
    return 'data_sessions'
  }

  id?: string
  presentation_id: string
  name: string
  answers: string
  created_at?: string
  finished: boolean
  sales_id?: string
  updated_at?: string
  predefined_hs_company_id?: string
  predefined_hs_deal_id?: string
  read_only_id?: string
}
