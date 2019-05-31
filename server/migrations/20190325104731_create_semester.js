exports.up = function(knex) {
  return knex.schema.createTable('semester', table => {
    table.increments();
    table
      .integer('value')
      .notNullable()
      .unique();
    table.string('name').notNullable();
    table.string('short_name').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('semester');
};
