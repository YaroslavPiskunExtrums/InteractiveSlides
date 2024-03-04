import { Model } from 'objection'

export interface ISlidesNotes {
	id?: string
	slide_id?: string
	session_id?: string
	note?: string
	created_at?: Date
	updated_at?: Date
	hubspot_note_id?: string
}
export class SlidesNotesModel extends Model implements ISlidesNotes {
	static get tableName() {
		return 'slides_notes'
	}
	id?: string
	slide_id?: string
	session_id?: string
	note?: string
	created_at?: Date
	updated_at?: Date
	hubspot_note_id?: string
}
