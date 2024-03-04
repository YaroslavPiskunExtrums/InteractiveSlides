exports.up = function(knex) {
  return knex.schema.createTable('content', function(table) {
    table.increments('id').primary()
    table.string('unique_id') // specificType('content_config', 'Byte(16)')
    table.string('shapename')
    table.timestamp('date_time')
    table.specificType('content_config', 'JSON')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('content')
}
