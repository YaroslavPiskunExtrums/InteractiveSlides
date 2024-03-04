
exports.up = function(knex) {
  return knex.schema.createTable('saas_companies', function(table) {
    table.string('id').primary()
    table.string('name').notNullable()
    // table.string('owner_email').notNullable()
    table.string('domain')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())


    // Foreign key constraint
    table.string('owner_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('saas_companies')
};
