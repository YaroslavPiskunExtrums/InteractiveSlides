
exports.up = function (knex) {
	return knex.schema.createTable('company_default_styles', function (table) {
		table.increments('id').primary()
		table.json('open_field_default_styles')
		table.json('button_default_styles')
		table.json('calculator_default_styles')
		table.json('customer_details_default_styles')
		table.json('multiple_choice_default_styles')
		table.json('range_selector_default_styles')
		table.string('company_id')
			.unique()
			.references('id')
			.inTable('saas_companies')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
	})

}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('company_default_styles')
}
