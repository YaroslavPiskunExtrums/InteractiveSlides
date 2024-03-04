exports.up = function(knex) {
  return knex.schema.alterTable('data_sessions_answers', (table) => {
    table.json('value').alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('data_sessions_answers', (table) => {
    table.string('value').alter()
  })
}
