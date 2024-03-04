exports.up = function(knex) {
  return knex.schema.alterTable('data_sessions', function(table) {
    table.string('read_only_id')
  })

}

exports.down = function(knex) {
  return knex.schema.alterTable('data_sessions', function(table) {
    table.dropColumn('read_only_id')
  })
}
