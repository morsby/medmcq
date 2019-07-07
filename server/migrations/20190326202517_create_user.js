exports.up = (knex) => {
  return knex.schema.createTable('user', (table) => {
    table.increments();
    table
      .string('username')
      .notNullable()
      .unique();
    table.string('email').unique();
    table.string('password').notNullable();
    table.bigInteger('reset_password_expires').unsigned();
    table.string('reset_password_token');
    table.timestamps(true, true);
    table.string('old_id');

    table
      .integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('user_role')
      .onDelete('CASCADE')
      .defaultsTo(4);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user');
};
