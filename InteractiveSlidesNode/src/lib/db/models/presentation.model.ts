import { Model } from 'objection'
import { TagsModel } from './tags.model.js'

export interface IPresentation {
  id?: string
  unique_Id: string
  device_id: string
  date_time_stamp: string
  name?: string
  user_id?: string
  integration_fields?: string
  presentation_icon?: string
  presentation_color?: string
  save_color?: string
  controls_colors?: string
  transition?: string
}
export class PresentationModel extends Model implements IPresentation {
  static get tableName() {
    return 'presentations'
  }

  id: string
  unique_Id: string
  device_id: string
  date_time_stamp: string
  name?: string
  user_id?: string
  integration_fields?: string
  presentation_icon?: string
  presentation_color?: string
  save_color?: string
  controls_colors?: string
  transition?: string

  static get relationMappings() {
    return {

      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: TagsModel,
        join: {
          from: 'presentations.id',
          through: {
            from: 'presentations_tags.presentation_id',
            to: 'presentations_tags.tag_id'
          },
          to: 'tags.id'
        }
      }
    }
  }
}
