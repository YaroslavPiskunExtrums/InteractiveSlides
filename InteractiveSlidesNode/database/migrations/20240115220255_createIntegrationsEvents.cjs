exports.up = function(knex) {
  return knex.schema.createTable('integrations_events', function(table) {
    table.string('id').primary()
    table.string('url')

    table.integer('integration_id')
      .references('id')
      .inTable('integrations')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .unsigned()

    table.string('session_id')
      .references('id')
      .inTable('data_sessions')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')

    table.dateTime('created_at').defaultTo(knex.fn.now())
    table.dateTime('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('integrations_events')
}
