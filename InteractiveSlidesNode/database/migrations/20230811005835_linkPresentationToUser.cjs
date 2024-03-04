
exports.up = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table
      .string('user_id', 'varchar(255)')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.dropColumn('user_id');
  });
};
