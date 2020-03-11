exports.up = function(knex) {
  return knex.schema.createTable('question_bookmark', (table) => {
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
      .notNullable()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE');

    table.timestamps(true, true);

    table.unique(['question_id', 'user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_bookmark');
};
