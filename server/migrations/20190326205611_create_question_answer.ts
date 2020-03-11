exports.up = function(knex) {
  return knex.schema.createTable('question_user_answer', (table) => {
    table.increments();

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
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table.integer('answer').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_user_answer');
};
