exports.up = function (knex) {
  return knex.schema.table('presentations', function (table) {
    table.string('save_color').notNullable().defaultTo("#ffffff")
    table.string('controls_colors').notNullable().defaultTo("#ffffff")
  })


}

exports.down = function (knex) {
  return knex.schema.table('presentations', function (table) {
    table.dropColumn('controls_colors')
    table.dropColumn('save_color')
  })
}
