exports.up = function(knex) {
  return knex.schema.createTable('integrations', function(table) {
    table.increments('id').primary()
    table.string('access_token').notNullable()
    table.string('refresh_token').notNullable()
    table.string('token_type').notNullable()
    table.string('expires_in').notNullable()
    table.dateTime('created_at').defaultTo(knex.fn.now())

  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('integrations')
}
