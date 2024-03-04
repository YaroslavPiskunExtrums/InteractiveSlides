exports.up = function(knex) {
	return knex.schema.alterTable('slides_notes', (table) => {
		table.text('note').alter()
	})
}

exports.down = function(knex) {
	return knex.schema.alterTable('slides_notes', (table) => {
		table.string('note').alter()
	})
}
