exports.up = function(knex) {
  return knex.schema.createTable('question_specialty_vote', table => {
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

    table
      .integer('specialty_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('question_specialty')
      .onDelete('CASCADE');

    table.integer('value').defaultTo(1);
    table.unique(['user_id', 'question_id', 'specialty_id']);

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_specialty_vote');
};
