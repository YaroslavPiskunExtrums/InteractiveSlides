exports.up = function(knex) {
  return knex.schema.table('content', (table) => {
    table.json('content_config').alter();
  });
};

exports.down = function(knex) {
  return knex.schema.table('content', (table) => {
    table.string('content_config').alter();
  });
};
