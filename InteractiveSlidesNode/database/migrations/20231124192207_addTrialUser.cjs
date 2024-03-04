exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.boolean('is_trial_user').defaultTo(false)
  })

}

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('is_trial_user')
  })
}
