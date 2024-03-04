exports.up = function(knex) {
  return knex.schema.renameTable('embedded_obj_info', 'presentations_items').alterTable('presentations_items', function(table) {
    table.json('content_config')
  })

}

exports.down = function(knex) {
  return knex.schema
    .alterTable('presentation_items', function(table) {
      table.dropColumn('content_config')
    })
    .renameTable('presentation_items', 'embedded_obj_info')
}
