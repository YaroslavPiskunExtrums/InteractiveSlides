exports.up = function(knex) {
  return knex.schema.createTable('sales', function(table) {
    table.string('id').primary()
    table.string('name')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table
      .string('company_id')
      .references('id')
      .inTable('customer_companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('customer_companies')
}
