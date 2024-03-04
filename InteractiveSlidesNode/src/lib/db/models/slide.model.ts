import { Model } from 'objection'

export interface ISlideModel {
  id?: string
  presentation_id: string
  slide: number
  url: string
  width: number
  height: number
}

export class SlideModel extends Model implements ISlideModel {
  static get tableName() {
    return 'presentations_slides'
  }

  id?: string
  presentation_id: string
  slide: number
  url: string
  width: number
  height: number
}
