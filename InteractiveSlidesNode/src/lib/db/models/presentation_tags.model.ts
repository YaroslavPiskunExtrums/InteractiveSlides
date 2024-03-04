import { Model } from 'objection'
import { TagsModel } from './tags.model.js'
import { PresentationModel } from './presentation.model.js'



export class Presentations_TagsModel extends Model {
	presentation_id: string
	tag_id: number


	static get tableName() {
		return 'presentations_tags'
	}

	static get relationMappings() {
		return {
			tag: {
				relation: Model.HasOneRelation,
				modelClass: TagsModel,
				join: {
					from: 'presentations_tags.tag_id',
					to: 'tags.id'
				}
			},
			presentation: {
				relation: Model.HasOneRelation,
				modelClass: PresentationModel,
				join: {
					from: 'presentations_tags.presentation_id',
					to: 'presentations.id'
				}
			}
		}
	}
}
