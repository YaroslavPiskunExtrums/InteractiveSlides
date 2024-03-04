
exports.up = function(knex) {
  return knex.schema.createTable('presentations', function (table) {
    table.string('id').primary();
    table.string('unique_Id', "varchar(255)").notNullable();
    table.string('device_id', "varchar(255)").notNullable();
    table.dateTime('date_time_stamp');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('presentations');
};
