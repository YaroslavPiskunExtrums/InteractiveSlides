exports.up = function(knex) {
  return knex.schema.createTable('presentations_slides', function(table) {
    table.string('id').primary()
    table.integer('slide').notNullable()
    table.string('url').notNullable()
    table.smallint('width')
    table.smallint('height')

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
  return knex.schema.dropTableIfExists('presentations_slides')
}
