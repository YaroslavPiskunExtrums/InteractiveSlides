exports.up = function(knex) {
  return knex.schema.table('data_sessions', function(table) {
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table
      .string('sales_id')
      .references('id')
      .inTable('sales')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.table('data_sessions', function(table) {
    table.dropColumn('sales_id')
    table.dropColumn('updated_at')
  })
}
