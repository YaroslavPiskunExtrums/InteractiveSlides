exports.up = function(knex) {
  return knex.schema.table('customer_companies', function(table) {
    table.string('icon').alter()
  })
}

exports.down = function(knex) {

}

