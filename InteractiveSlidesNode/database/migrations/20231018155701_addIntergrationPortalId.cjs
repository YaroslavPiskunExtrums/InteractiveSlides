exports.up = function(knex) {
  return knex.schema.table('integrations', function(table) {
    table.string('hubspot_portal_id')
  })
}

exports.down = function(knex) {
  return knex.schema.table('integrations', function(table) {
    table.dropColumn('hubspot_portal_id')
  })
}
