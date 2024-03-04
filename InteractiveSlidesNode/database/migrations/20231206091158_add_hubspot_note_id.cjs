
exports.up = function(knex) {
	return knex.schema.alterTable('slides_notes', function(table) {
		table.string('hubspot_note_id')
	})
}

exports.down = function(knex) {
	return knex.schema.alterTable('slides_notes', function(table) {
		table.dropColumn('hubspot_note_id')
	})
}
