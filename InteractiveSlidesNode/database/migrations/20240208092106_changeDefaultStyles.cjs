
exports.up = function(knex) {
	return knex.schema.table('company_default_styles', function(table) {
		table.json('date_field_default_styles')
		table.json('personalization_default_styles')
	})
};

exports.down = function(knex) {
	return knex.schema.table('company_default_styles', function(table) {
		table.dropColumn('date_field_default_styles')
		table.dropColumn('personalization_default_styles')
	})
};
