exports.up = function(knex) {
  return knex.schema.createTable('customer_companies', function(table) {
    table.string('id').primary()
    table.string('name')
    table.timestamp('icon')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('customer_companies')
}


