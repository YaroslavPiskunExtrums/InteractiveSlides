exports.up = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.specificType('integration_fields', 'JSON').nullable()
  })
}

exports.down = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.dropColumn('integration_fields')
  })
}
