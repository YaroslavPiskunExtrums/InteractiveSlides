exports.up = function(knex) {
  return knex.schema.createTable('data_sessions', function(table) {
    table.string('id').primary()
    table.string('name').notNullable().defaultTo('')
    table.specificType('answers', 'JSON').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.boolean('finished').notNullable().defaultTo(false)

    // Foreign key constraint
    table
      .string('presentation_id', 'varchar(255)')
      .references('id')
      .inTable('presentations')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('data_sessions')
}
