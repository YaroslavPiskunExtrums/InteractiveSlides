exports.up = function(knex) {
  return knex.schema.alterTable('data_sessions_answers', function(table) {
    table.text('value').alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('data_sessions_answers', function(table) {
    table.string('value').alter()
  })
}

