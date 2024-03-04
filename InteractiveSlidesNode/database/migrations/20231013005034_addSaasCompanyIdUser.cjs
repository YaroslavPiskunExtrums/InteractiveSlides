exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('saas_company_id')
      .references('id')
      .inTable('saas_companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('saas_company_id')
  })

}
