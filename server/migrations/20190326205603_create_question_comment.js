exports.up = function (knex, Promise) {
  return knex.schema.createTable('question_comment', table => {
    table.increments();
    table.text('text').notNullable();
    table
      .boolean('private')
      .notNullable()
      .defaultTo(0);

    table
      .integer('question_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('question')
      .onDelete('CASCADE');

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('question_comment');
};
