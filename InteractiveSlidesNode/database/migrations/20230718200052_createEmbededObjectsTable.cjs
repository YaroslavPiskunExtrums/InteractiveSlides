exports.up = function(knex) {
  return knex.schema.createTable('embedded_obj_info', function(table) {
    table.string('id').primary()
    table.string('name', 'varchar(255)').notNullable()
    table.integer('slide', 'smallint').notNullable()
    table.specificType('size', 'JSON').notNullable()
    table.specificType('bounds', 'JSON').notNullable()

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
  return knex.schema.dropTableIfExists('embedded_obj_info')
}
