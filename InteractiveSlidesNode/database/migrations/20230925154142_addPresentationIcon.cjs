exports.up = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.string('presentation_icon')
  })

}

exports.down = function(knex) {
  return knex.schema.table('presentations', function(table) {
    table.dropColumn('presentation_icon')
  })
}
