exports.up = function(knex) {
  return knex.schema.createTable('data_sessions_answers', function(table) {
    table.string('id').primary()
    table.string('value')
    table.string('session_id')
    table.string('figure_id')
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.string('data_session_id', 'varchar(255)')
      .references('id')
      .inTable('data_sessions')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table.string('item_id', 'varchar(255)')
      .references('id')
      .inTable('embedded_obj_info')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('data_sessions_answers')

}
