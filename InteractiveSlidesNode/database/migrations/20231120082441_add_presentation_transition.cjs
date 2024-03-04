exports.up = function (knex) {
	return knex.schema.alterTable('presentations', function (table) {
		table.string('transition').notNullable().defaultTo("none")
	})


}

exports.down = function (knex) {
	return knex.schema.alterTable('presentations', function (table) {
		table.dropColumn('transition')
	})
}