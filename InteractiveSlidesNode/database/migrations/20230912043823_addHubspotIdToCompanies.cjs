exports.up = function(knex) {
  return knex.schema.table('customer_companies', function(table) {
    table.string('hubspot_id')
  })
}

exports.down = function(knex) {
  return knex.schema.table('customer_companies', function(table) {
    table.dropColumn('hubspot_id')
  })
}
