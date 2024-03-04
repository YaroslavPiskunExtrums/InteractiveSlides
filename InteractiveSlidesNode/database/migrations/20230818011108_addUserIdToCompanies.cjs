exports.up = function(knex) {
  return knex.schema.table('customer_companies', function(table) {
    table.string('saas_client_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.table('customer_companies', function(table) {
    table.dropColumn('saas_client_id')
  })

}

