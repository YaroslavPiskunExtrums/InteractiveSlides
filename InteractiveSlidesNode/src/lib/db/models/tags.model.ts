import Objection, { Model } from 'objection'
import { SaasCompanyModel } from './saas-company.model.js'
import { PresentationModel } from './presentation.model.js'


export class TagsModel extends Model {
	id: number
	tag_title: string
	company_id: string
	created_at: Objection.FunctionBuilder
	updated_at: Objection.FunctionBuilder

	static get tableName() {
		return 'tags'
	}

	$beforeInsert() {
		this.created_at = TagsModel.fn.now()
		this.updated_at = TagsModel.fn.now()
	}

	$beforeUpdate() {
		this.updated_at = TagsModel.fn.now()
	}

	static get relationMappings() {
		return {
			company: {
				relation: Model.HasOneRelation,
				modelClass: SaasCompanyModel,
				join: {
					from: 'tags.company_id',
					to: 'saas_companies.id'
				}
			},
			presentations: {
				relation: Model.ManyToManyRelation,
				modelClass: PresentationModel,
				join: {
					from: 'tags.id',
					through: {
						from: 'presentations_tags.tag_id',
						to: 'presentations_tags.presentation_id'
					},
					to: 'presentations.id'
				}
			}
		}
	}
}
