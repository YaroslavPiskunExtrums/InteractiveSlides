import { Model } from 'objection'

export interface IContent {
  id?: number
  shapename: string
  date_time: Date
  content_config: string
  unique_id: string
}
export class ContentModel extends Model implements IContent {
  static get tableName() {
    return 'content'
  }
  id?: number
  shapename: string
  date_time: Date
  content_config: string
  unique_id: string
}
