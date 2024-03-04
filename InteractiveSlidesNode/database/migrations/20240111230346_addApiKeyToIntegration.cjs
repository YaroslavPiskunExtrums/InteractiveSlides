exports.up = function(knex) {
  return knex.schema.table('integrations', function (table) {
    table.string('internal_api_key').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('integrations', function (table) {
    table.dropColumn('internal_api_key');
  });
};
