
exports.up = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.string('name');
  });
};

exports.down = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.dropColumn('name');
  });
};
