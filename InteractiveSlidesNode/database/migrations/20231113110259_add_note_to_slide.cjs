
exports.up = function (knex) {
	return knex.schema.createTable('slides_notes', function (table) {
		table.increments('id').primary()
		table.string('slide_id')
			.references('id')
			.inTable('presentations_slides')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.string('session_id')
			.references('id')
			.inTable('data_sessions')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()

		table.string('note')
		table.timestamp('updated_at').defaultTo(knex.fn.now())
		table.timestamp('created_at').defaultTo(knex.fn.now())
	})


}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('slides_notes')
}
