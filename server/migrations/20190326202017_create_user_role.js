exports.up = function (knex, Promise) {
  return knex.schema.createTable('user_role', table => {
    table.increments();
    table
      .string('name')
      .notNullable()
      .unique();
    table.integer('level').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('user_role');
};
