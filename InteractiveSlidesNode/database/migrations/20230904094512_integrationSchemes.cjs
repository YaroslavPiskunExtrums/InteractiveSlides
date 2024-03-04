exports.up = function(knex) {
  return knex.schema.createTable('integration_schemes', function(table) {
    table.increments('id').primary()
    table.dateTime('created_at').defaultTo(knex.fn.now())
    table.string('scheme_id')
    table
      .string('user_id', 'varchar(255)')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('integration_schemes')
}
