exports.up = function(knex) {
  return knex.schema.table('data_sessions', function(table) {
    table.string('predefined_hs_company_id')
  })

}

exports.down = function(knex) {
  return knex.schema.table('data_sessions', function(table) {
    table.dropColumn('predefined_hs_company_id')
  })
}
