import { Model } from 'objection'

export interface IEmbeddedObject {
  id?: string
  presentation_id: string
  name: string
  slide: number
  size: string
  bounds: string
  content_config?: string
}
export class EmbededObjectModel extends Model implements IEmbeddedObject {
  static get tableName() {
    return 'presentations_items'
  }
  id?: string
  presentation_id: string
  name: string
  slide: number
  size: string
  bounds: string
  content_config?: string
}
