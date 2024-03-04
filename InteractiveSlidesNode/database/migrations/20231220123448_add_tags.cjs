
exports.up = function(knex) {
	return knex.schema
		.createTable('tags', function(table) {
			table.increments('id').primary()
			table.string('tag_title').notNullable()
			table.string('company_id')
				.references('id')
				.inTable('saas_companies')
				.onDelete('CASCADE')
				.onUpdate('CASCADE')
				.notNullable()
			table.timestamps(true, true)
		})
		.createTable('presentations_tags', function(table) {
			table.string('presentation_id')
				.references('id')
				.inTable('presentations')
				.onDelete('CASCADE')
				.onUpdate('CASCADE')
				.notNullable()
			table.integer('tag_id')
				.unsigned()
				.references('id')
				.inTable('tags')
				.onDelete('CASCADE')
				.onUpdate('CASCADE')
				.notNullable()

			table.primary(['presentation_id', 'tag_id'])
		})
}

exports.down = function(knex) {
	return knex.schema
		.dropTableIfExists('presentations_tags')
		.dropTableIfExists('tags')
}
