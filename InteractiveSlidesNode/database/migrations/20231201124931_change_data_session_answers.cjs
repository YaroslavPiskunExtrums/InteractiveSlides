
exports.up = function(knex) {
	return knex.schema.alterTable('data_sessions_answers', function(table) {
		table.dropColumn('session_id')
		table.dropColumn('figure_id')
		table.renameColumn('item_id', 'presentation_item_id')
	})
}

exports.down = function(knex) {
	return knex.schema.alterTable('data_sessions_answers', function(table) {
		table.string('session_id')
		table.string('figure_id')
		table.renameColumn('presentation_item_id', 'item_id')
	})
}
