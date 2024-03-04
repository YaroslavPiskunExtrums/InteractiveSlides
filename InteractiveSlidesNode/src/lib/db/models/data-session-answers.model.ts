import { Model } from 'objection'

export interface IDataSessionsAnswers {
	id?: number
	value?: string
	updated_at?: Date
	created_at?: Date
	data_session_id?: string
	presentation_item_id?: string
}

export class DataSessionsAnswersModel extends Model implements IDataSessionsAnswers {
	static get tableName() {
		return 'data_sessions_answers'
	}

	id?: number
	value?: string
	updated_at?: Date
	created_at?: Date
	data_session_id?: string
	presentation_item_id?: string
}