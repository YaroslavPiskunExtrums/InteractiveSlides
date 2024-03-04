exports.up = function(knex) {
  return knex.schema.alterTable('integrations_events', function(table) {
    table.dropForeign(['session_id']);
    table.dropColumn('session_id')

    table.string('presentation_id')
      .references('id')
      .inTable('presentations')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')


  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('integrations_events', function(table) {
    table.string('session_id')
      .references('id')
      .inTable('data_sessions')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')

    table.dropForeign(['presentation_id']);
    table.dropColumn('presentation_id')
  })
}
